export type StageName =
  | "upload_received"
  | "file_validation"
  | "docling"
  | "ocr_fallback"
  | "text_normalization"
  | "llm_extraction"
  | "pydantic_validation"
  | "final_json"
  | "error";

export type StageStatus = "running" | "success" | "failed" | "skipped";

export type StageEvent = {
  stage: StageName;
  status: StageStatus;
  message: string;
  data?: Record<string, unknown>;
};

const PLATFORM_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_PLATFORM_API_URL) ||
  "http://localhost:4000/api/v1";

function parseSseChunk(buffer: string): { events: StageEvent[]; rest: string } {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const events: StageEvent[] = [];

  for (const part of parts) {
    const lines = part.split("\n");
    const dataLines = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart());
    if (!dataLines.length) continue;
    try {
      events.push(JSON.parse(dataLines.join("\n")) as StageEvent);
    } catch {
      // ignore malformed chunks
    }
  }

  return { events, rest };
}

async function readSseResponse(
  response: Response,
  onEvent: (event: StageEvent) => void,
): Promise<void> {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parsed = parseSseChunk(buffer);
    buffer = parsed.rest;
    for (const event of parsed.events) {
      onEvent(event);
    }
  }

  if (buffer.trim()) {
    const parsed = parseSseChunk(buffer + "\n\n");
    for (const event of parsed.events) {
      onEvent(event);
    }
  }
}

/** Direct AI-service extract (debug). Prefer platformExtractResumeStream. */
export async function extractResumeStream(
  file: File,
  onEvent: (event: StageEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const aiBase =
    process.env.NEXT_PUBLIC_AI_SERVICE_URL?.replace(/\/$/, "") ??
    "http://localhost:8000";
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${aiBase}/resume-extractor/extract`, {
    method: "POST",
    body: form,
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `Extract failed (${response.status})`);
  }

  await readSseResponse(response, onEvent);
}

export async function platformExtractResumeStream(
  resumeId: string,
  accessToken: string | null,
  onEvent: (event: StageEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const headers = new Headers();
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${PLATFORM_BASE}/resumes/${resumeId}/extract`, {
    method: "POST",
    headers,
    credentials: "include",
    signal,
  });

  if (!response.ok) {
    let message = `Extract failed (${response.status})`;
    try {
      const data = (await response.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  await readSseResponse(response, onEvent);
}
