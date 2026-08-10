"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EvidenceList } from "@/components/recruiter/evidence-list";
import { ExtractionStatusBadge } from "@/components/recruiter/status-badges";
import { SectionCard } from "@/components/recruiter/section-card";
import type { JobRoleStatus } from "@/lib/types/job-role";

const JOB_ROLE_STATUS_OPTIONS: { value: JobRoleStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open" },
  { value: "ON_HOLD", label: "On hold" },
  { value: "CLOSED", label: "Closed" },
];

export default function JobRoleOverviewPage() {
  const params = useParams<{ roleId: string }>();
  const qc = useQueryClient();

  const role = useQuery({
    queryKey: ["job-role", params.roleId],
    queryFn: () => platformClient.getJobRole(params.roleId),
    // Polling only matters if a parse is still in flight (e.g. a re-parse
    // just fired) — the create flow itself already awaits the synchronous
    // parse before this page ever loads.
    refetchInterval: (q) => {
      const status = q.state.data?.activeExtraction?.status;
      return status === "PENDING" || status === "RUNNING" ? 3000 : false;
    },
  });

  const reparse = useMutation({
    mutationFn: () => platformClient.reparseJobRole(params.roleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-role", params.roleId] }),
  });

  const setStatus = useMutation({
    mutationFn: (status: JobRoleStatus) => platformClient.setJobRoleStatus(params.roleId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-role", params.roleId] }),
  });

  if (role.isLoading) return <p className="text-sm text-gray-400">Loading…</p>;
  if (!role.data) return <p className="text-sm text-red-600">Role not found.</p>;

  const extraction = role.data.activeExtraction?.extractionJson;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Parsed requirements (read-only)
          </h2>
          <div className="flex items-center gap-2">
            {role.data.activeExtraction && <ExtractionStatusBadge status={role.data.activeExtraction.status} />}
            <Button size="sm" variant="outline" disabled={reparse.isPending} onClick={() => reparse.mutate()}>
              {reparse.isPending ? "Re-parsing…" : "Re-parse"}
            </Button>
          </div>
        </div>

        {role.data.activeExtraction?.status === "FAILED" && (
          <p className="text-sm text-red-600">
            {role.data.activeExtraction.errorMessage ?? "Extraction failed — try re-parsing."}
          </p>
        )}

        {extraction ? (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <SectionCard title="Must-have" count={extraction.mustHaveRequirements.length}>
                <EvidenceList
                  items={extraction.mustHaveRequirements}
                  label={(r) => r.requirement}
                  tone="must"
                  emptyText="No must-have requirements extracted"
                />
              </SectionCard>
              <SectionCard title="Nice-to-have" count={extraction.niceToHaveRequirements.length}>
                <EvidenceList
                  items={extraction.niceToHaveRequirements}
                  label={(r) => r.requirement}
                  tone="nice"
                  emptyText="No nice-to-have requirements extracted"
                />
              </SectionCard>
            </div>
            <SectionCard title="Responsibilities" count={extraction.responsibilities.length}>
              <EvidenceList
                items={extraction.responsibilities}
                label={(r) => r.responsibility}
                tone="responsibility"
                emptyText="No responsibilities extracted"
              />
            </SectionCard>
            {extraction.unparsedSections.length > 0 && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <h3 className="mb-2 text-sm font-medium text-amber-800">Could not confidently parse</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-amber-900">
                  {extraction.unparsedSections.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No parsed requirements yet.</p>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 text-sm">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Details</h2>
        <dl className="space-y-2">
          <div>
            <dt className="text-gray-400">Department</dt>
            <dd className="text-gray-800">{role.data.department ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-gray-400">Location</dt>
            <dd className="text-gray-800">{role.data.location ?? "—"}</dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Status</dt>
            <dd>
              <Select
                value={role.data.status}
                onValueChange={(value) => setStatus.mutate(value as JobRoleStatus)}
                options={JOB_ROLE_STATUS_OPTIONS}
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
