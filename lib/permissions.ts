export const PERMISSIONS = {
  WORKSPACE_SETTINGS_READ: "workspace.settings.read",
  WORKSPACE_SETTINGS_WRITE: "workspace.settings.write",
  MEMBERS_READ: "members.read",
  MEMBERS_INVITE: "members.invite",
  MEMBERS_ROLE_WRITE: "members.role.write",
  MEMBERS_REMOVE: "members.remove",
  ROLES_READ: "roles.read",
  ROLES_WRITE: "roles.write",
  AUDIT_READ: "audit.read",
  PROFILE_READ: "profile.read",
  PROFILE_WRITE: "profile.write",
  INTERVIEWS_MANAGE: "interviews.manage",
  JOBS_READ: "jobs.read",
  JOBS_WRITE: "jobs.write",
  CANDIDATES_READ: "candidates.read",
  CANDIDATES_WRITE: "candidates.write",
  RESUMES_READ: "resumes.read",
  RESUMES_UPLOAD: "resumes.upload",
} as const;

export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function hasPermission(
  permissions: string[] | undefined,
  required: PermissionSlug,
): boolean {
  return Boolean(permissions?.includes(required));
}

export function hasAnyPermission(
  permissions: string[] | undefined,
  required: PermissionSlug | PermissionSlug[],
): boolean {
  const list = Array.isArray(required) ? required : [required];
  return list.some((slug) => hasPermission(permissions, slug));
}

export type NavItem = {
  href: string;
  label: string;
  permission?: PermissionSlug | PermissionSlug[];
};

export const APP_NAV: NavItem[] = [
  {
    href: "/recruiter/dashboard",
    label: "Recruiter Dashboard",
    permission: PERMISSIONS.INTERVIEWS_MANAGE,
  },
  {
    href: "/recruiter/roles",
    label: "Job Roles",
    permission: PERMISSIONS.JOBS_READ,
  },
  {
    href: "/recruiter/candidates",
    label: "Candidates",
    permission: PERMISSIONS.CANDIDATES_READ,
  },
];

export const SETTINGS_NAV: NavItem[] = [
  { href: "/settings/profile", label: "Profile", permission: PERMISSIONS.PROFILE_READ },
  {
    href: "/settings/workspace",
    label: "Workspace",
    permission: PERMISSIONS.WORKSPACE_SETTINGS_READ,
  },
  {
    href: "/settings/team",
    label: "Team & RBAC",
    permission: [PERMISSIONS.MEMBERS_READ, PERMISSIONS.ROLES_READ],
  },
];

export const ALL_NAV: NavItem[] = [...APP_NAV, ...SETTINGS_NAV];

export function filterNav(items: NavItem[], permissions?: string[]): NavItem[] {
  return items.filter(
    (item) => !item.permission || hasAnyPermission(permissions, item.permission),
  );
}

export function canAccessPath(pathname: string, permissions?: string[]): boolean {
  // Per-prefix checks, not a blanket /recruiter/* -> INTERVIEWS_MANAGE
  // match — roles/candidates are gated on their own permission slugs.
  if (pathname.startsWith("/recruiter/roles")) {
    return hasPermission(permissions, PERMISSIONS.JOBS_READ);
  }
  if (pathname.startsWith("/recruiter/candidates")) {
    return hasPermission(permissions, PERMISSIONS.CANDIDATES_READ);
  }
  if (pathname === "/recruiter" || pathname.startsWith("/recruiter/")) {
    return hasPermission(permissions, PERMISSIONS.INTERVIEWS_MANAGE);
  }
  const item = ALL_NAV.find(
    (nav) => pathname === nav.href || pathname.startsWith(`${nav.href}/`),
  );
  if (!item) return true;
  return !item.permission || hasAnyPermission(permissions, item.permission);
}

/** First sidebar route the user is allowed to open (Tools, then Settings). */
export function getDefaultLandingPath(permissions?: string[]): string {
  const allowed = filterNav(ALL_NAV, permissions);
  return allowed[0]?.href ?? "/settings/profile";
}
