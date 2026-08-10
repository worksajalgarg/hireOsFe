"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  applyStageEvent,
  StageTimeline,
  type StageRecord,
} from "@/components/resume-extractor/stage-timeline";
import { UploadZone } from "@/components/resume-extractor/upload-zone";
import {
  platformExtractResumeStream,
  type StageEvent,
} from "@/lib/ai-client";
import {
  getAccessToken,
  platformClient,
  setAccessToken,
} from "@/lib/platform-client";
import {
  hasAnyPermission,
  hasPermission,
  PERMISSIONS,
} from "@/lib/permissions";
import type { ResumeDetail, ResumeListItem } from "@/lib/types";

export function ResumeExtractorApp() {
  const router = useRouter();
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [stages, setStages] = useState<Record<string, StageRecord>>({});
  const [errorEvent, setErrorEvent] = useState<StageEvent | null>(null);
  const [fatal, setFatal] = useState<string | null>(null);
  const [editorText, setEditorText] = useState("");
  const [editorError, setEditorError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!getAccessToken()) {
      platformClient
        .refresh()
        .then((r) => setAccessToken(r.accessToken))
        .catch(() => router.push("/auth/login"));
    }
  }, [router]);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => platformClient.me(),
    retry: false,
  });

  const permissions = me.data?.permissions;
  const canReadResumes = hasAnyPermission(permissions, [
    PERMISSIONS.RESUMES_READ,
    PERMISSIONS.RESUMES_EXTRACT,
  ]);
  const canWriteResumes = hasPermission(permissions, PERMISSIONS.RESUMES_WRITE);
  const canExtractResumes = hasPermission(permissions, PERMISSIONS.RESUMES_EXTRACT);

  const resumes = useQuery({
    queryKey: ["resumes"],
    queryFn: () => platformClient.listResumes(),
    enabled: Boolean(me.data) && canReadResumes,
  });

  const detail = useQuery({
    queryKey: ["resumes", selectedId],
    queryFn: () => platformClient.getResume(selectedId!),
    enabled: Boolean(selectedId) && canReadResumes,
  });

  useEffect(() => {
    setEditorText("");
    setEditorError(null);
    setSaveMessage(null);
  }, [selectedId]);

  useEffect(() => {
    if (!detail.data) return;
    // Only populate when the API actually has JSON. Never clear on a null
    // refetch — that races with SSE-seeded Working JSON right after extract.
    const json = detail.data.workingJson ?? detail.data.extractedJson;
    if (!json) return;
    setEditorText(JSON.stringify(json, null, 2));
    setEditorError(null);
    setSaveMessage(null);
  }, [detail.data]);

  const upload = useMutation({
    mutationFn: (f: File) => platformClient.uploadResume(f),
    onSuccess: async (item) => {
      setSelectedId(item.id);
      setFile(null);
      await qc.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const saveJson = useMutation({
    mutationFn: (workingJson: Record<string, unknown>) =>
      platformClient.updateResumeWorkingJson(selectedId!, workingJson),
    onSuccess: async () => {
      setSaveMessage("Saved working JSON");
      await qc.invalidateQueries({ queryKey: ["resumes"] });
      await qc.invalidateQueries({ queryKey: ["resumes", selectedId] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => platformClient.deleteResume(id),
    onSuccess: async (_data, id) => {
      if (selectedId === id) setSelectedId(null);
      await qc.invalidateQueries({ queryKey: ["resumes"] });
    },
  });

  const resetPipeline = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStages({});
    setErrorEvent(null);
    setFatal(null);
    setRunning(false);
  }, []);

  const onExtract = async () => {
    if (!selectedId) return;
    resetPipeline();
    setRunning(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let finalResume: Record<string, unknown> | null = null;
      await platformExtractResumeStream(
        selectedId,
        getAccessToken(),
        (event) => {
          if (event.stage === "error") {
            setErrorEvent(event);
            return;
          }
          setStages((prev) => applyStageEvent(prev, event));
          // Seed Working JSON as soon as Final JSON succeeds — don't wait on
          // the post-stream refetch, which can leave the editor empty if the
          // detail query is slow or still shows the pre-extract row.
          if (
            event.stage === "final_json" &&
            event.status === "success" &&
            event.data?.resume &&
            typeof event.data.resume === "object" &&
            !Array.isArray(event.data.resume)
          ) {
            finalResume = event.data.resume as Record<string, unknown>;
            setEditorText(JSON.stringify(finalResume, null, 2));
            setEditorError(null);
            setSaveMessage(null);
          }
        },
        controller.signal,
      );
      if (finalResume) {
        qc.setQueryData<ResumeDetail>(["resumes", selectedId], (prev) =>
          prev
            ? {
                ...prev,
                status: "EXTRACTED",
                extractedJson: finalResume,
                workingJson: finalResume,
                errorMessage: null,
              }
            : prev,
        );
      }
      await qc.invalidateQueries({ queryKey: ["resumes"] });
      await qc.invalidateQueries({ queryKey: ["resumes", selectedId] });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setFatal((err as Error).message || "Extraction failed");
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  };

  const onSaveEditor = () => {
    setEditorError(null);
    setSaveMessage(null);
    try {
      const parsed = JSON.parse(editorText) as unknown;
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setEditorError("workingJson must be a JSON object");
        return;
      }
      saveJson.mutate(parsed as Record<string, unknown>);
    } catch {
      setEditorError("Invalid JSON");
    }
  };

  const onResetFromExtracted = () => {
    if (!detail.data?.extractedJson) return;
    setEditorText(JSON.stringify(detail.data.extractedJson, null, 2));
    setEditorError(null);
    setSaveMessage(null);
  };

  const selected: ResumeListItem | ResumeDetail | undefined = useMemo(() => {
    if (detail.data) return detail.data;
    return resumes.data?.find((r) => r.id === selectedId);
  }, [detail.data, resumes.data, selectedId]);

  if (me.isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-sm text-[var(--color-muted)]">
        Checking session…
      </div>
    );
  }

  if (me.isError) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-16">
        <p className="text-sm text-red-700">Sign in required.</p>
        <Button type="button" onClick={() => router.push("/auth/login")}>
          Go to login
        </Button>
      </div>
    );
  }

  if (!canReadResumes) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-[var(--color-navy)]">Access denied</h1>
        <p className="text-sm text-[var(--color-muted)]">
          You do not have permission to use Resume Extractor. Contact your workspace admin
          if you need <span className="font-medium">resumes.read</span> or{" "}
          <span className="font-medium">resumes.extract</span> access.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="animate-fade-up space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-navy)]">
          Resume Extractor
        </h1>
        <p className="max-w-2xl text-sm text-[var(--color-muted)]">
          Upload resumes to MinIO, extract via the AI pipeline, then edit working JSON for
          further processing.
        </p>
      </header>

      <section className="animate-fade-up-delay grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Library</h2>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => void resumes.refetch()}
            >
              Refresh
            </Button>
          </div>
          <ul className="max-h-[28rem] space-y-1 overflow-auto">
            {(resumes.data ?? []).map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    resetPipeline();
                  }}
                  className={`w-full rounded-xl px-3 py-2 text-left text-xs transition ${
                    selectedId === item.id
                      ? "bg-[var(--color-lavender)] text-[var(--color-navy)]"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <span className="block truncate font-medium">
                    {item.contactName || item.originalFilename}
                  </span>
                  <span className="text-[10px] uppercase tracking-wide text-[var(--color-muted)]">
                    {item.status}
                  </span>
                </button>
              </li>
            ))}
            {!resumes.data?.length ? (
              <li className="px-2 py-4 text-xs text-[var(--color-muted)]">No resumes yet</li>
            ) : null}
          </ul>
        </aside>

        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--color-border)]">
            <UploadZone
              file={file}
              disabled={!canWriteResumes || running || upload.isPending}
              onFileChange={setFile}
            />
            <div className="flex flex-wrap gap-2">
              {canWriteResumes ? (
                <Button
                  type="button"
                  disabled={!file || upload.isPending || running}
                  onClick={() => file && upload.mutate(file)}
                >
                  {upload.isPending ? "Uploading…" : "Upload to library"}
                </Button>
              ) : null}
              {canExtractResumes ? (
                <Button
                  type="button"
                  disabled={!selectedId || running}
                  onClick={() => void onExtract()}
                >
                  {running ? "Extracting…" : "Extract selected"}
                </Button>
              ) : null}
              {canWriteResumes ? (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedId || running || remove.isPending}
                  onClick={() => selectedId && remove.mutate(selectedId)}
                >
                  Delete
                </Button>
              ) : null}
              {running ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    abortRef.current?.abort();
                    setRunning(false);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
            {selected ? (
              <p className="text-xs text-[var(--color-muted)]">
                Selected: {selected.originalFilename} · {selected.status}
                {detail.data?.errorMessage ? ` · ${detail.data.errorMessage}` : ""}
              </p>
            ) : null}
            {upload.isError ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {(upload.error as Error).message}
              </p>
            ) : null}
            {fatal ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{fatal}</p>
            ) : null}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--color-border)]">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Pipeline</h2>
            <StageTimeline stages={stages} errorEvent={errorEvent} />
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--color-border)]">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-gray-900">Working JSON</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!detail.data?.extractedJson}
                  onClick={onResetFromExtracted}
                >
                  Reset from extracted
                </Button>
                {canWriteResumes ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={!selectedId || saveJson.isPending}
                    onClick={onSaveEditor}
                  >
                    {saveJson.isPending ? "Saving…" : "Save"}
                  </Button>
                ) : null}
              </div>
            </div>
            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              spellCheck={false}
              className="min-h-[22rem] w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-lavender)]/30 p-4 font-mono text-xs text-gray-800 outline-none focus:ring-2 focus:ring-[var(--color-navy)]/20"
              placeholder="Extract a resume to edit structured JSON here"
            />
            {editorError ? (
              <p className="mt-2 text-sm text-red-700">{editorError}</p>
            ) : null}
            {saveMessage ? (
              <p className="mt-2 text-sm text-emerald-700">{saveMessage}</p>
            ) : null}
            {saveJson.isError ? (
              <p className="mt-2 text-sm text-red-700">
                {(saveJson.error as Error).message}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
