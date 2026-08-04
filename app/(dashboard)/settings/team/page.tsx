"use client";

import {
  PermissionsMatrix,
  TeamMembersTable,
} from "@/components/settings/team/team-rbac";

export default function TeamSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team & RBAC</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage members, roles, and permission access for this workspace.
        </p>
      </div>
      <TeamMembersTable />
      <PermissionsMatrix />
    </div>
  );
}
