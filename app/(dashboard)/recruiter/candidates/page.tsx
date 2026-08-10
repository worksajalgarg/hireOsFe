"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import type { Candidate } from "@/lib/types";

export default function CandidatesPage() {
  const [q, setQ] = useState("");

  const candidates = useQuery({
    queryKey: ["candidates", q],
    queryFn: () => platformClient.listCandidates({ q: q || undefined }),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Candidates</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Everyone who has applied across any role.</p>
      </div>

      <Input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />

      <DataTable<Candidate>
        rows={candidates.data ?? []}
        rowKey={(c) => c.id}
        loading={candidates.isLoading}
        empty="No candidates yet."
        columns={[
          {
            key: "name",
            header: "Name",
            render: (c) => (
              <Link href={`/recruiter/candidates/${c.id}`} className="font-medium text-gray-900 hover:underline">
                {c.fullName}
              </Link>
            ),
          },
          { key: "email", header: "Email", render: (c) => c.primaryEmail ?? "—" },
          { key: "title", header: "Current title", render: (c) => c.currentTitle ?? "—" },
          { key: "source", header: "Source", render: (c) => c.source.replace("_", " ") },
        ]}
      />
    </div>
  );
}
