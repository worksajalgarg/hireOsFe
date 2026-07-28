"use client";

import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPT = ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type UploadZoneProps = {
  file: File | null;
  disabled?: boolean;
  onFileChange: (file: File | null) => void;
};

export function UploadZone({ file, disabled, onFileChange }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = (next: File | null) => {
    if (!next) {
      onFileChange(null);
      return;
    }
    const name = next.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      return;
    }
    onFileChange(next);
  };

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-lavender)]/40 px-6 py-10 text-center transition",
        dragOver && "border-[var(--color-navy)] bg-[var(--color-lavender)]",
        disabled && "pointer-events-none opacity-60",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        pick(e.dataTransfer.files?.[0] ?? null);
      }}
    >
      <FileUp className="h-8 w-8 text-[var(--color-navy)]" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-[var(--color-navy)]">
          Drop a resume or click to browse
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">PDF or DOCX, up to 10MB</p>
      </div>
      {file ? (
        <p className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700">
          {file.name} · {(file.size / 1024).toFixed(1)} KB
        </p>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}
