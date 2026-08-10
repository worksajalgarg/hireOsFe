"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ExtractionStatusBadge } from "@/components/recruiter/status-badges";
import type { JobRole } from "@/lib/types";

export default function JobRolesPage() {
  const roles = useQuery({
    queryKey: ["job-roles"],
    queryFn: () => platformClient.listJobRoles(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Job Roles</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Create a role from a job description, then track candidates against it.
          </p>
        </div>
        <Link href="/recruiter/roles/new">
          <Button>New role</Button>
        </Link>
      </div>

      <DataTable<JobRole>
        rows={roles.data ?? []}
        rowKey={(r) => r.id}
        loading={roles.isLoading}
        empty="No job roles yet — create one from a job description."
        columns={[
          {
            key: "title",
            header: "Title",
            render: (r) => (
              <Link href={`/recruiter/roles/${r.id}`} className="font-medium text-gray-900 hover:underline">
                {r.title}
              </Link>
            ),
          },
          { key: "department", header: "Department", render: (r) => r.department ?? "—" },
          { key: "status", header: "Status", render: (r) => r.status },
          {
            key: "extraction",
            header: "JD parsing",
            render: (r) => (r.activeExtraction ? <ExtractionStatusBadge status={r.activeExtraction.status} /> : "—"),
          },
        ]}
      />
    </div>
  );
}
