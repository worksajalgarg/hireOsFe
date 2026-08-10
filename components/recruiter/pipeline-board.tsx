"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { DataTable } from "@/components/ui/data-table";
import { Select } from "@/components/ui/select";
import { ApplicationStatusBadge } from "@/components/recruiter/status-badges";
import { APPLICATION_STAGES, type Application, type ApplicationStage } from "@/lib/types";

const STAGE_OPTIONS = APPLICATION_STAGES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }));

/** A table with a stage-count summary strip, not a drag-and-drop kanban
 * board — no DnD library installed, and a table gives keyboard access and
 * bulk-select for free (see hireOsFe's implementation plan). */
export function PipelineBoard({ jobRoleId, pipeline }: { jobRoleId: string; pipeline: Record<string, Application[]> }) {
  const qc = useQueryClient();
  const moveStage = useMutation({
    mutationFn: (params: { id: string; toStage: ApplicationStage }) =>
      platformClient.moveApplicationStage(params.id, { toStage: params.toStage }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pipeline", jobRoleId] }),
  });

  const allApplications = APPLICATION_STAGES.flatMap((stage) => pipeline[stage] ?? []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {APPLICATION_STAGES.map((stage) => (
          <div
            key={stage}
            className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1 text-xs text-gray-600"
          >
            {stage.replace(/_/g, " ")} · {(pipeline[stage] ?? []).length}
          </div>
        ))}
      </div>

      <DataTable<Application>
        rows={allApplications}
        rowKey={(a) => a.id}
        empty="No candidates in this pipeline yet."
        columns={[
          {
            key: "candidate",
            header: "Candidate",
            render: (a) => (
              <Link href={`/recruiter/candidates/${a.candidateId}`} className="font-medium text-gray-900 hover:underline">
                {a.candidate?.fullName ?? a.candidateId}
              </Link>
            ),
          },
          {
            key: "stage",
            header: "Stage",
            render: (a) => (
              <Select
                value={a.stage}
                options={STAGE_OPTIONS}
                onValueChange={(toStage) => moveStage.mutate({ id: a.id, toStage: toStage as ApplicationStage })}
                className="w-48"
              />
            ),
          },
          {
            key: "status",
            header: "Status",
            render: (a) => <ApplicationStatusBadge status={a.status} />,
          },
        ]}
      />
    </div>
  );
}
