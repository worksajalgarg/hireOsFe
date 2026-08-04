"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { canAccessPath, getDefaultLandingPath } from "@/lib/permissions";
import { getAccessToken, platformClient, setAccessToken } from "@/lib/platform-client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!getAccessToken()) {
      platformClient
        .refresh()
        .then((r) => setAccessToken(r.accessToken))
        .catch(() => router.push("/auth/login"));
    }
  }, [router]);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => platformClient.me(),
    retry: false,
  });

  useEffect(() => {
    if (me.isError) {
      router.push("/auth/login");
    }
  }, [me.isError, router]);

  useEffect(() => {
    if (!me.data) return;
    const permissions = me.data.permissions;
    if (!canAccessPath(pathname, permissions)) {
      const landing = getDefaultLandingPath(permissions);
      if (landing !== pathname) {
        router.replace(landing);
      }
    }
  }, [me.data, pathname, router]);

  if (me.isLoading || !me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f9] text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  return <AppShell user={me.data}>{children}</AppShell>;
}
