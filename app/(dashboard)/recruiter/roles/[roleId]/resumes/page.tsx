"use client";

import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ResumeUploadPanel } from "@/components/recruiter/resume-upload-panel";
import { ResumeStatusBadge } from "@/components/recruiter/status-badges";
import type { Resume } from "@/lib/types";

export default function JobRoleResumesPage() {
  const params = useParams<{ roleId: string }>();
  const qc = useQueryClient();

  const resumes = useQuery({
    queryKey: ["resumes", params.roleId],
    queryFn: () => platformClient.listResumes(params.roleId),
    refetchInterval: (q) =>
      q.state.data?.some((r) => r.status === "UPLOADED" || r.status === "PARSING") ? 3000 : false,
  });

  // A resume that fails to parse never gets a candidateId (see
  // candidate-linking.service.ts — linking only runs on a successful
  // extraction), so it never appears on any candidate detail page — this
  // table is the only place it's visible at all, and the only place a
  // Re-parse action for it can live.
  const reparse = useMutation({
    mutationFn: (id: string) => platformClient.reparseResume(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resumes", params.roleId] }),
  });

  return (
    <div className="space-y-6">
      <ResumeUploadPanel
        jobRoleId={params.roleId}
        onUploaded={() => qc.invalidateQueries({ queryKey: ["resumes", params.roleId] })}
      />

      <DataTable<Resume>
        rows={resumes.data ?? []}
        rowKey={(r) => r.id}
        loading={resumes.isLoading}
        empty="No resumes uploaded yet."
        columns={[
          { key: "filename", header: "File", render: (r) => r.originalFilename },
          { key: "status", header: "Status", render: (r) => <ResumeStatusBadge status={r.status} /> },
          {
            key: "candidate",
            header: "Candidate",
            render: (r) => r.activeExtraction?.extractionJson?.candidateName ?? "—",
          },
          {
            key: "download",
            header: "",
            render: (r) => (
              <button
                className="text-sm text-[var(--color-navy)] hover:underline"
                onClick={async () => {
                  const { url } = await platformClient.getResumeDownloadUrl(r.id);
                  window.open(url, "_blank");
                }}
              >
                Download
              </button>
            ),
          },
          {
            key: "reparse",
            header: "",
            render: (r) =>
              r.status !== "UPLOADED" && r.status !== "PARSING" ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={reparse.isPending && reparse.variables === r.id}
                  onClick={() => reparse.mutate(r.id)}
                >
                  {reparse.isPending && reparse.variables === r.id ? "Re-parsing…" : "Re-parse"}
                </Button>
              ) : null,
          },
        ]}
      />
    </div>
  );
}
