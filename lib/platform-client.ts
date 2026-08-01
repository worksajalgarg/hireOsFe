"use client";

let accessToken: string | null = null;

const API_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PLATFORM_API_URL) ||
  "http://localhost:4000/api/v1";

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
  if (!headers.has("content-type") && init?.body) {
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
};
