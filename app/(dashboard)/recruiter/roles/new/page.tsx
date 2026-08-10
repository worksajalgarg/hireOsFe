"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { createJobRoleSchema } from "@/lib/schemas/job-role";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDrop } from "@/components/ui/file-drop";
import { cn } from "@/lib/utils";

type FormValues = z.infer<typeof createJobRoleSchema>;

export default function NewJobRolePage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"paste" | "upload">("paste");
  const [file, setFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(createJobRoleSchema),
    defaultValues: { title: "", jdText: "" },
  });

  const createFromText = useMutation({
    mutationFn: (values: FormValues) => platformClient.createJobRole(values),
    onSuccess: (role) => router.push(`/recruiter/roles/${role.id}`),
    onError: (err: Error) => setError(err.message),
  });

  const createFromFile = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Choose a file first");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      return platformClient.createJobRoleFromFile(formData);
    },
    onSuccess: (role) => router.push(`/recruiter/roles/${role.id}`),
    onError: (err: Error) => setError(err.message),
  });

  const submitting = createFromText.isPending || createFromFile.isPending;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">New job role</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Paste or upload the job description — it&apos;s parsed automatically into structured requirements.
        </p>
      </div>

      <div className="inline-flex rounded-full border border-[var(--color-border)] bg-gray-50 p-1 text-sm">
        {(["paste", "upload"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full px-4 py-1.5 font-medium capitalize transition",
              mode === m ? "bg-white text-gray-900 shadow-sm" : "text-gray-500",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {mode === "paste" ? (
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => {
            setError(null);
            createFromText.mutate(values);
          })}
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Senior Backend Engineer" {...form.register("title")} />
            {form.formState.errors.title && (
              <p className="text-xs text-red-600">{form.formState.errors.title.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jdText">Job description</Label>
            <textarea
              id="jdText"
              rows={10}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white p-3 text-sm text-gray-900 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/15"
              {...form.register("jdText")}
            />
            {form.formState.errors.jdText && (
              <p className="text-xs text-red-600">{form.formState.errors.jdText.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Creating…" : "Create role"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="upload-title">Title</Label>
            <Input
              id="upload-title"
              placeholder="Senior Backend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <FileDrop
            accept=".pdf,.docx"
            onFiles={(files) => setFile(files[0] ?? null)}
            label={file ? file.name : "Drop the JD file here, or click to browse (.pdf, .docx)"}
          />
          <Button
            type="button"
            className="w-full"
            disabled={submitting || !file || !title}
            onClick={() => {
              setError(null);
              createFromFile.mutate();
            }}
          >
            {submitting ? "Creating…" : "Create role"}
          </Button>
        </div>
      )}
    </div>
  );
}
