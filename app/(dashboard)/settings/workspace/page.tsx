"use client";

import { WorkspacePolicyForm } from "@/components/settings/workspace/workspace-policy-form";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Workspace</h1>
        <p className="mt-1 text-sm text-gray-500">Branding, domain, and enterprise policies.</p>
      </div>
      <WorkspacePolicyForm />
    </div>
  );
}
