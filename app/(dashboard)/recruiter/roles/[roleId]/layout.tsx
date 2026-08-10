"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { platformClient } from "@/lib/platform-client";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "", label: "Overview" },
  { href: "/resumes", label: "Resumes" },
  { href: "/candidates", label: "Candidates" },
];

export default function JobRoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ roleId: string }>();
  const base = `/recruiter/roles/${params.roleId}`;

  const role = useQuery({
    queryKey: ["job-role", params.roleId],
    queryFn: () => platformClient.getJobRole(params.roleId),
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/recruiter/roles" className="text-sm text-gray-500 hover:text-gray-800">
          ← Job Roles
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
          {role.data?.title ?? "Loading…"}
        </h1>
      </div>

      <nav className="flex gap-1 border-b border-[var(--color-border)]">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`;
          const active = pathname === href;
          return (
            <Link
              key={tab.href}
              href={href}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium",
                active ? "border-[var(--color-navy)] text-gray-900" : "border-transparent text-gray-500",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
