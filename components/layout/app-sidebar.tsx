"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  APP_NAV,
  filterNav,
  SETTINGS_NAV,
  type NavItem,
} from "@/lib/permissions";

const ICONS: Record<string, typeof LayoutDashboard> = {
  "/recruiter/dashboard": LayoutDashboard,
};

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = ICONS[item.href];
  const active =
    pathname === item.href ||
    (item.href !== "/" && pathname.startsWith(`${item.href}/`)) ||
    (item.href === "/recruiter/dashboard" && pathname.startsWith("/recruiter/"));

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white",
        active && "bg-white text-[var(--color-navy)] shadow-sm",
      )}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-70" /> : null}
      {item.label}
    </Link>
  );
}

export function AppSidebar({ permissions }: { permissions?: string[] }) {
  const pathname = usePathname();
  const appItems = filterNav(APP_NAV, permissions);
  const settingsItems = filterNav(SETTINGS_NAV, permissions);

  if (!appItems.length && !settingsItems.length) {
    return (
      <aside className="text-sm text-gray-500">
        No pages available for your role.
      </aside>
    );
  }

  return (
    <aside className="space-y-6">
      {appItems.length > 0 ? (
        <nav className="space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Tools
          </p>
          {appItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      ) : null}

      {settingsItems.length > 0 ? (
        <nav className="space-y-1">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <Settings2 className="h-3.5 w-3.5" />
            Settings
          </p>
          {settingsItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      ) : null}
    </aside>
  );
}
