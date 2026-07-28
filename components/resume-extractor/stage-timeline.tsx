"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Circle, Loader2, SkipForward, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StageEvent, StageName, StageStatus } from "@/lib/ai-client";

export const PIPELINE_STAGES: { id: StageName; label: string }[] = [
  { id: "upload_received", label: "Upload" },
  { id: "file_validation", label: "File validation" },
  { id: "docling", label: "Docling" },
  { id: "ocr_fallback", label: "OCR fallback" },
  { id: "text_normalization", label: "Text normalization" },
  { id: "llm_extraction", label: "LLM extraction" },
  { id: "pydantic_validation", label: "Pydantic validation" },
  { id: "final_json", label: "Final JSON" },
];

export type StageRecord = {
  stage: StageName;
  status: StageStatus | "pending";
  message?: string;
  data?: Record<string, unknown>;
};

function StatusIcon({ status }: { status: StageRecord["status"] }) {
  if (status === "running") {
    return <Loader2 className="h-4 w-4 animate-spin text-[var(--color-navy)]" />;
  }
  if (status === "success") {
    return <Check className="h-4 w-4 text-emerald-600" />;
  }
  if (status === "failed") {
    return <X className="h-4 w-4 text-red-600" />;
  }
  if (status === "skipped") {
    return <SkipForward className="h-4 w-4 text-[var(--color-muted)]" />;
  }
  return <Circle className="h-4 w-4 text-[var(--color-border)]" />;
}

function previewPayload(data?: Record<string, unknown>): string | null {
  if (!data || Object.keys(data).length === 0) return null;
  if (typeof data.resume === "object") {
    return JSON.stringify(data.resume, null, 2);
  }
  if (typeof data.raw_json === "string") return data.raw_json;
  if (typeof data.preview === "string") return data.preview;
  if (typeof data.markdown_preview === "string") return data.markdown_preview;
  return JSON.stringify(data, null, 2);
}

type StageTimelineProps = {
  stages: Record<string, StageRecord>;
  errorEvent?: StageEvent | null;
};

export function StageTimeline({ stages, errorEvent }: StageTimelineProps) {
  const [open, setOpen] = useState<string | null>(null);

  const items = useMemo(() => {
    return PIPELINE_STAGES.map((meta) => {
      const record = stages[meta.id] ?? {
        stage: meta.id,
        status: "pending" as const,
      };
      return { ...meta, record };
    });
  }, [stages]);

  return (
    <ol className="space-y-3">
      {items.map(({ id, label, record }) => {
        const payload = previewPayload(record.data);
        const isOpen = open === id;
        return (
          <li
            key={id}
            className={cn(
              "overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white",
              record.status === "running" && "ring-1 ring-[var(--color-navy)]/20",
            )}
          >
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
              onClick={() => setOpen(isOpen ? null : id)}
              disabled={!payload && !record.message}
            >
              <StatusIcon status={record.status} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {record.message ? (
                  <p className="truncate text-xs text-[var(--color-muted)]">{record.message}</p>
                ) : (
                  <p className="text-xs text-[var(--color-muted)]">Waiting</p>
                )}
              </div>
              {(payload || record.message) && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--color-muted)] transition",
                    isOpen && "rotate-180",
                  )}
                />
              )}
            </button>
            {isOpen && payload ? (
              <pre className="max-h-64 overflow-auto border-t border-[var(--color-border)] bg-[var(--color-lavender)]/30 px-4 py-3 text-xs text-gray-800 whitespace-pre-wrap">
                {payload}
              </pre>
            ) : null}
          </li>
        );
      })}
      {errorEvent ? (
        <li className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorEvent.message}
        </li>
      ) : null}
    </ol>
  );
}

export function applyStageEvent(
  prev: Record<string, StageRecord>,
  event: StageEvent,
): Record<string, StageRecord> {
  if (event.stage === "error") return prev;
  return {
    ...prev,
    [event.stage]: {
      stage: event.stage,
      status: event.status,
      message: event.message,
      data: event.data,
    },
  };
}
