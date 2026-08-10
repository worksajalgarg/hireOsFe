"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { EvidenceList } from "@/components/recruiter/evidence-list";
import { SectionCard } from "@/components/recruiter/section-card";
import {
  ApplicationStageBadge,
  ApplicationStatusBadge,
  ResumeStatusBadge,
} from "@/components/recruiter/status-badges";
import type { Resume } from "@/lib/types/resume";

function ResumeEvidence({ resume, candidateId }: { resume: Resume; candidateId: string }) {
  const qc = useQueryClient();
  const reparse = useMutation({
    mutationFn: () => platformClient.reparseResume(resume.id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["candidate", candidateId] }),
  });

  const raw = resume.activeExtraction?.extractionJson;
  // Extraction rows persisted before the schema widened (certifications,
  // projects, awards, publications, languages, professionalSummary,
  // structured unparsedSections) don't have these keys at all — default
  // them so old rows render instead of throwing. Re-parsing backfills the
  // real values; this only covers rendering stale rows gracefully.
  const extraction = raw
    ? {
        ...raw,
        certifications: raw.certifications ?? [],
        projects: raw.projects ?? [],
        awards: raw.awards ?? [],
        publications: raw.publications ?? [],
        languages: raw.languages ?? [],
        verificationTopics: raw.verificationTopics ?? [],
        unparsedSections: raw.unparsedSections ?? [],
      }
    : null;

  return (
    <SectionCard title={resume.originalFilename}>
      <div className="mb-3 -mt-1 flex items-center justify-between">
        <ResumeStatusBadge status={resume.status} />
        {resume.status === "PARSE_FAILED" && (
          <Button size="sm" variant="outline" disabled={reparse.isPending} onClick={() => reparse.mutate()}>
            {reparse.isPending ? "Re-parsing…" : "Re-parse"}
          </Button>
        )}
      </div>

      {resume.status === "PARSE_FAILED" && (
        <p className="text-sm text-red-600">
          {resume.activeExtraction?.errorMessage ?? "Extraction failed — try re-parsing."}
        </p>
      )}
      {(resume.status === "UPLOADED" || resume.status === "PARSING") && (
        <p className="text-sm text-gray-400">Parsing…</p>
      )}

      {extraction && (
        <div className="space-y-6">
          {extraction.professionalSummary && (
            <p className="text-sm leading-relaxed text-gray-700">{extraction.professionalSummary}</p>
          )}

          {extraction.skills.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Skills</h4>
              <EvidenceList
                items={extraction.skills}
                label={(s) => (s.yearsExperience ? `${s.skill} (${s.yearsExperience}y)` : s.skill)}
                tone="must"
                layout="chips"
              />
            </div>
          )}

          {extraction.workHistory.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Work history</h4>
              <ul className="space-y-4">
                {extraction.workHistory.map((entry, i) => (
                  <li key={i}>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.title} · {entry.company}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.startDate ?? "—"} – {entry.isCurrent ? "Present" : (entry.endDate ?? "—")}
                    </p>
                    {entry.responsibilities.length > 0 && (
                      <div className="mt-1.5">
                        <EvidenceList
                          items={entry.responsibilities}
                          label={(r) => r.claim}
                          tone="responsibility"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {extraction.education.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Education</h4>
              <EvidenceList items={extraction.education} label={(e) => e.claim} tone="nice" />
            </div>
          )}

          {extraction.certifications.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Certifications</h4>
              <EvidenceList items={extraction.certifications} label={(e) => e.claim} tone="nice" />
            </div>
          )}

          {extraction.projects.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Projects</h4>
              <EvidenceList items={extraction.projects} label={(e) => e.claim} tone="responsibility" />
            </div>
          )}

          {extraction.awards.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Awards</h4>
              <EvidenceList items={extraction.awards} label={(e) => e.claim} tone="nice" />
            </div>
          )}

          {extraction.publications.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Publications</h4>
              <EvidenceList items={extraction.publications} label={(e) => e.claim} tone="nice" />
            </div>
          )}

          {extraction.languages.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Languages</h4>
              <EvidenceList items={extraction.languages} label={(e) => e.claim} tone="nice" layout="chips" />
            </div>
          )}

          {extraction.verificationTopics.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Worth verifying
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                {extraction.verificationTopics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {extraction.unparsedSections.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">
                Could not confidently parse
              </h4>
              <div className="space-y-2">
                {extraction.unparsedSections.map((s, i) => (
                  <div key={i}>
                    <p className="text-sm font-medium text-amber-900">{s.sectionTitle}</p>
                    <p className="text-sm text-amber-800">{s.rawText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}

export default function CandidateDetailPage() {
  const params = useParams<{ candidateId: string }>();

  const candidate = useQuery({
    queryKey: ["candidate", params.candidateId],
    queryFn: () => platformClient.getCandidate(params.candidateId),
  });

  if (candidate.isLoading) return <p className="text-sm text-gray-400">Loading…</p>;
  if (!candidate.data) return <p className="text-sm text-red-600">Candidate not found.</p>;

  const c = candidate.data;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{c.fullName}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{c.currentTitle ?? "No title on file"}</p>
        </div>

        {c.resumes.length > 0 ? (
          c.resumes.map((resume) => (
            <ResumeEvidence key={resume.id} resume={resume} candidateId={c.id} />
          ))
        ) : (
          <p className="text-sm text-gray-400">No resumes uploaded for this candidate yet.</p>
        )}
      </div>

      <div className="space-y-4">
        <dl className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 text-sm">
          <div>
            <dt className="text-gray-400">Email</dt>
            <dd className="break-all text-gray-800">{c.primaryEmail ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Phone</dt>
            <dd className="text-gray-800">{c.primaryPhone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Location</dt>
            <dd className="text-gray-800">{c.location ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Source</dt>
            <dd className="text-gray-800">{c.source.replace("_", " ")}</dd>
          </div>
        </dl>

        <SectionCard title="Applications" count={c.applications.length}>
          {c.applications.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {c.applications.map((app) => (
                <li key={app.id} className="flex items-center justify-between gap-2 py-2.5 first:pt-0 last:pb-0">
                  <Link
                    href={`/recruiter/roles/${app.jobRoleId}`}
                    className="truncate text-sm font-medium text-navy hover:underline"
                  >
                    {app.jobRole.title}
                  </Link>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <ApplicationStageBadge stage={app.stage} />
                    <ApplicationStatusBadge status={app.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No applications yet</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
