"use client";

import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
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
        ]}
      />
    </div>
  );
}
