"use client";

let accessToken: string | null = null;

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PLATFORM_API_URL) ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? "https://hire-os-be.vercel.app/api/v1"
    : "http://localhost:4000/api/v1");

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) sessionStorage.setItem("hireos_access_token", token);
    else sessionStorage.removeItem("hireos_access_token");
  }
}

export function getAccessToken() {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = sessionStorage.getItem("hireos_access_token");
  }
  return accessToken;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  if (!headers.has("content-type") && init?.body && !isFormData) {
    // Never stamp a content-type on a FormData body — the browser needs to
    // set it itself (with the multipart boundary), and doing it here breaks
    // every file upload silently.
    headers.set("content-type", "application/json");
  }
  const token = getAccessToken();
  if (token) headers.set("authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { message?: string | string[] };
      if (Array.isArray(data.message)) message = data.message.join(", ");
      else if (data.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const platformClient = {
  login: (body: { email: string; password: string; tenantId?: string }) =>
    apiFetch<import("./types").LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  refresh: () => apiFetch<{ accessToken: string; expiresIn: number }>("/auth/refresh", { method: "POST" }),
  logout: () => apiFetch<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  forgotPassword: (email: string) =>
    apiFetch<{ ok: boolean; devToken?: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token: string, password: string) =>
    apiFetch<{ ok: boolean }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),
  acceptInvite: (body: {
    token: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) =>
    apiFetch<{ ok: boolean }>("/auth/accept-invite", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  ssoCallback: (provider: string, code: string) =>
    apiFetch<import("./types").LoginResponse>("/auth/sso/callback", {
      method: "POST",
      body: JSON.stringify({ provider, code }),
    }),
  me: () => apiFetch<import("./types").User>("/users/me"),
  updateProfile: (body: Record<string, unknown>) =>
    apiFetch("/users/me/profile", { method: "PATCH", body: JSON.stringify(body) }),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch("/users/me/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  getWorkspaceSettings: () =>
    apiFetch<import("./types").WorkspaceSettings>("/workspace/settings"),
  updateWorkspaceSettings: (body: Record<string, unknown>) =>
    apiFetch<import("./types").WorkspaceSettings>("/workspace/settings", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  listMembers: () => apiFetch<import("./types").TeamMember[]>("/workspace/members"),
  inviteMember: (email: string, roleId: string) =>
    apiFetch<{ invitationId: string; devToken?: string }>("/workspace/members/invite", {
      method: "POST",
      body: JSON.stringify({ email, roleId }),
    }),
  changeMemberRole: (userId: string, roleId: string) =>
    apiFetch(`/workspace/members/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ roleId }),
    }),
  removeMember: (userId: string) =>
    apiFetch(`/workspace/members/${userId}`, { method: "DELETE" }),
  getRoles: () => apiFetch<import("./types").RolesMatrix>("/roles"),
  createInterviewSession: (params: {
    candidateRef: string;
    resumeContext?: string;
    sessionType?: "candidate_interview" | "hiring_manager_discovery";
    promptId?: string;
  }) =>
    apiFetch<{ id: string; inviteUrl: string }>("/interviews", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  joinInterview: (inviteToken: string) =>
    apiFetch<import("./types").JoinInterviewResponse>("/interviews/join", {
      method: "POST",
      body: JSON.stringify({ inviteToken }),
    }),
  listPrompts: () =>
    apiFetch<
      Array<{
        id: string;
        title: string;
        description?: string;
        category: string;
        conversationFlow?: string;
        openingInstructions?: string;
        silenceInstructions?: string;
        systemBoundaries?: string;
        isDefault: boolean;
        createdAt: string;
      }>
    >("/prompts"),
  getPrompt: (id: string) => apiFetch<Record<string, unknown>>(`/prompts/${id}`),
  createPrompt: (body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>("/prompts", { method: "POST", body: JSON.stringify(body) }),
  updatePrompt: (id: string, body: Record<string, unknown>) =>
    apiFetch<Record<string, unknown>>(`/prompts/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deletePrompt: (id: string) => apiFetch<{ deleted: boolean }>(`/prompts/${id}`, { method: "DELETE" }),

  // ---- Job roles ----
  listJobRoles: (params?: { status?: string; q?: string; cursor?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.q) qs.set("q", params.q);
    if (params?.cursor) qs.set("cursor", params.cursor);
    if (params?.limit) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetch<import("./types").JobRole[]>(`/job-roles${suffix}`);
  },
  getJobRole: (id: string) => apiFetch<import("./types").JobRole>(`/job-roles/${id}`),
  createJobRole: (body: {
    title: string;
    jdText: string;
    department?: string;
    location?: string;
    employmentType?: string;
    seniority?: string;
  }) =>
    apiFetch<import("./types").JobRole>("/job-roles", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  createJobRoleFromFile: (formData: FormData) =>
    apiFetch<import("./types").JobRole>("/job-roles/upload", {
      method: "POST",
      body: formData,
    }),
  updateJobRole: (id: string, body: Record<string, unknown>) =>
    apiFetch<import("./types").JobRole>(`/job-roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  setJobRoleStatus: (id: string, status: import("./types").JobRoleStatus) =>
    apiFetch<import("./types").JobRole>(`/job-roles/${id}/status`, {
      method: "POST",
      body: JSON.stringify({ status }),
    }),
  reparseJobRole: (id: string) =>
    apiFetch<import("./types").JobRole>(`/job-roles/${id}/reparse`, { method: "POST" }),
  getJobRoleJdDownloadUrl: (id: string) =>
    apiFetch<{ url: string }>(`/job-roles/${id}/jd-download`),

  // ---- Resumes ----
  // One file per call by design — the backend parses synchronously per
  // request (see hireOsBe's implementation plan); the upload panel fans
  // this out with bounded client-side concurrency for multi-file selections.
  uploadResume: (jobRoleId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<import("./types").Resume>(`/job-roles/${jobRoleId}/resumes`, {
      method: "POST",
      body: formData,
    });
  },
  listResumes: (jobRoleId: string) =>
    apiFetch<import("./types").Resume[]>(`/job-roles/${jobRoleId}/resumes`),
  getResume: (id: string) => apiFetch<import("./types").Resume>(`/resumes/${id}`),
  getResumeDownloadUrl: (id: string) => apiFetch<{ url: string }>(`/resumes/${id}/download`),
  reparseResume: (id: string) =>
    apiFetch<import("./types").Resume>(`/resumes/${id}/reparse`, { method: "POST" }),
  deleteResume: (id: string) => apiFetch<{ deleted: boolean }>(`/resumes/${id}`, { method: "DELETE" }),

  // ---- Candidates & pipeline ----
  listPipeline: (jobRoleId: string) =>
    apiFetch<Record<import("./types").ApplicationStage, import("./types").Application[]>>(
      `/job-roles/${jobRoleId}/pipeline`,
    ),
  listCandidates: (params?: { q?: string; cursor?: string }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.cursor) qs.set("cursor", params.cursor);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return apiFetch<import("./types").Candidate[]>(`/candidates${suffix}`);
  },
  getCandidate: (id: string) => apiFetch<import("./types").Candidate>(`/candidates/${id}`),
  updateCandidate: (id: string, body: Record<string, unknown>) =>
    apiFetch<import("./types").Candidate>(`/candidates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  createApplication: (body: { candidateId: string; jobRoleId: string }) =>
    apiFetch<import("./types").Application>("/applications", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  moveApplicationStage: (id: string, body: { toStage: import("./types").ApplicationStage; note?: string }) =>
    apiFetch<import("./types").Application>(`/applications/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  setApplicationDisposition: (
    id: string,
    body: { status: import("./types").ApplicationStatus; reason?: string },
  ) =>
    apiFetch<import("./types").Application>(`/applications/${id}/disposition`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
