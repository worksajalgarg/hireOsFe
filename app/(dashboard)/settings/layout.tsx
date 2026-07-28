"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { platformClient, setAccessToken } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/workspace", label: "Workspace" },
  { href: "/settings/team", label: "Team & RBAC" },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      await platformClient.logout();
    } catch {
      // ignore
    }
    setAccessToken(null);
    document.cookie = "hireos_access_hint=; path=/; max-age=0";
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#f4f5f9]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--color-navy)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-navy)] text-sm font-bold text-white">
              H
            </span>
            <span className="font-semibold">HireOS</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Settings</p>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white",
                pathname === item.href && "bg-white text-[var(--color-navy)] shadow-sm",
              )}
            >
              {item.label}
            </Link>
          ))}
        </aside>
        <div className="animate-fade-up">{children}</div>
      </div>
    </div>
  );
}
