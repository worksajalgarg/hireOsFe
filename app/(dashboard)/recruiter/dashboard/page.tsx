"use client";

import { useEffect, useState } from "react";
import { Copy, ExternalLink, Check } from "lucide-react";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SessionType = "candidate_interview" | "hiring_manager_discovery";

const SESSION_TYPE_OPTIONS: { value: SessionType; label: string; description: string }[] = [
  {
    value: "candidate_interview",
    label: "Candidate Interview",
    description: "AI voice screening interview with a candidate.",
  },
  {
    value: "hiring_manager_discovery",
    label: "Hiring Manager Discovery",
    description: "Structured intake call to build a hiring package from a hiring manager.",
  },
];

export default function RecruiterDashboardPage() {
  const [candidateRef, setCandidateRef] = useState("");
  const [resumeContext, setResumeContext] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>("candidate_interview");
  const [selectedPromptId, setSelectedPromptId] = useState<string>("");
  const [prompts, setPrompts] = useState<Array<{ id: string; title: string; category: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load available DB prompt templates on mount
  useEffect(() => {
    platformClient
      .listPrompts()
      .then((data) => setPrompts(data))
      .catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInviteUrl(null);
    setCopied(false);
    setSubmitting(true);
    try {
      const result = await platformClient.createInterviewSession({
        candidateRef: candidateRef.trim(),
        resumeContext: resumeContext.trim() || undefined,
        sessionType,
        promptId: selectedPromptId || undefined,
      });
      setInviteUrl(result.inviteUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create interview session");
    } finally {
      setSubmitting(false);
    }
  };

  const onCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Recruiter dashboard</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Create an interview session, select a prompt template from DB, and generate a 7-day invite link.
          </p>
        </div>
        <a
          href="/recruiter/prompts"
          className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Manage Prompts →
        </a>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-[var(--color-border)] bg-white p-6"
      >
        <div className="space-y-1.5">
          <Label htmlFor="candidateRef">Candidate reference / Name</Label>
          <Input
            id="candidateRef"
            placeholder="e.g. Jane Doe or candidate ATS ID"
            value={candidateRef}
            onChange={(e) => setCandidateRef(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="promptTemplate">Select Prompt Template (Database)</Label>
          <select
            id="promptTemplate"
            value={selectedPromptId}
            onChange={(e) => setSelectedPromptId(e.target.value)}
            className="flex w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-navy/40 focus:ring-2 focus:ring-navy/15"
          >
            <option value="">Default AI Interviewer Prompt</option>
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label>Session type</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SESSION_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSessionType(opt.value)}
                className={cn(
                  "rounded-xl border p-3 text-left text-sm transition",
                  sessionType === opt.value
                    ? "border-navy/50 bg-navy/5 ring-2 ring-navy/15"
                    : "border-[var(--color-border)] hover:bg-gray-50",
                )}
              >
                <div className="font-medium text-gray-900">{opt.label}</div>
                <div className="mt-0.5 text-xs text-gray-500">{opt.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="resumeContext">
            Resume context <span className="font-normal text-gray-400">(optional)</span>
          </Label>
          <textarea
            id="resumeContext"
            placeholder="Paste resume JSON or plain text — grounds the agent's questions in the candidate's actual background"
            value={resumeContext}
            onChange={(e) => setResumeContext(e.target.value)}
            rows={4}
            className="flex w-full rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-navy/40 focus:ring-2 focus:ring-navy/15"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting || !candidateRef.trim()} className="w-full">
          {submitting ? "Generating…" : "Generate Invite Link"}
        </Button>
      </form>

      {inviteUrl && (
        <div className="mt-4 space-y-2 rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <Label>Invite link</Label>
          <div className="flex items-center gap-2">
            <Input value={inviteUrl} readOnly className="font-mono text-xs" />
            <Button type="button" variant="outline" size="sm" onClick={onCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(inviteUrl, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
