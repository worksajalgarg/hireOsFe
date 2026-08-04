"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { platformClient, setAccessToken } from "@/lib/platform-client";

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
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

  const displayName =
    [user.profile?.firstName, user.profile?.lastName].filter(Boolean).join(" ") ||
    user.email;

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
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{user.roleName ?? "Member"}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <AppSidebar permissions={user.permissions} />
        <div className="min-w-0 animate-fade-up">{children}</div>
      </div>
    </div>
  );
}
