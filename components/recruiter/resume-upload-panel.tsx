"use client";

import * as React from "react";
import { platformClient } from "@/lib/platform-client";
import { FileDrop } from "@/components/ui/file-drop";
import type { Resume } from "@/lib/types";

const MAX_CONCURRENT_UPLOADS = 3;

type UploadRowStatus = "queued" | "uploading" | "done" | "error";

interface UploadRow {
  key: string;
  file: File;
  status: UploadRowStatus;
  error?: string;
}

/** One file per backend request by design (see resumes.controller.ts's
 * module docstring) — this fans a multi-file selection out into requests
 * with bounded client-side concurrency, so a 20-file batch fires at most
 * MAX_CONCURRENT_UPLOADS requests at a time rather than all at once. */
export function ResumeUploadPanel({
  jobRoleId,
  onUploaded,
}: {
  jobRoleId: string;
  onUploaded: (resume: Resume) => void;
}) {
  const [rows, setRows] = React.useState<UploadRow[]>([]);

  const updateRow = (key: string, patch: Partial<UploadRow>) => {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  };

  const handleFiles = async (files: File[]) => {
    const newRows: UploadRow[] = files.map((file) => ({
      key: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      status: "queued",
    }));
    setRows((prev) => [...newRows, ...prev]);

    let index = 0;
    const worker = async () => {
      while (index < newRows.length) {
        const row = newRows[index++];
        updateRow(row.key, { status: "uploading" });
        try {
          const resume = await platformClient.uploadResume(jobRoleId, row.file);
          updateRow(row.key, { status: "done" });
          onUploaded(resume);
        } catch (err) {
          updateRow(row.key, { status: "error", error: err instanceof Error ? err.message : "Upload failed" });
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENT_UPLOADS, newRows.length) }, worker));
  };

  return (
    <div className="space-y-3">
      <FileDrop
        accept=".pdf,.docx"
        multiple
        onFiles={(files) => void handleFiles(files)}
        label="Drop resumes here, or click to browse (.pdf, .docx)"
      />
      {rows.length > 0 && (
        <ul className="space-y-1.5">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm"
            >
              <span className="truncate text-gray-700">{row.file.name}</span>
              <span
                className={
                  row.status === "error"
                    ? "text-red-600"
                    : row.status === "done"
                      ? "text-green-600"
                      : "text-gray-400"
                }
              >
                {row.status === "uploading"
                  ? "Uploading…"
                  : row.status === "queued"
                    ? "Queued"
                    : row.status === "error"
                      ? row.error
                      : "Done"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
