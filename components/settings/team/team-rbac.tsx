"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inviteMemberSchema } from "@/lib/schemas/auth";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";

type InviteValues = z.infer<typeof inviteMemberSchema>;

export function InviteMemberDialog({
  roles,
}: {
  roles: Array<{ id: string; name: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const qc = useQueryClient();
  const form = useForm<InviteValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", roleId: roles[0]?.id ?? "" },
  });

  const invite = useMutation({
    mutationFn: (values: InviteValues) => platformClient.inviteMember(values.email, values.roleId),
    onSuccess: async (result) => {
      setDevToken(result.devToken ?? null);
      await qc.invalidateQueries({ queryKey: ["members"] });
      form.reset({ email: "", roleId: roles[0]?.id ?? "" });
    },
  });

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button>Invite member</Button>
      </Modal.Trigger>
      <Modal.Content title="Invite member">
        <form className="space-y-4" onSubmit={form.handleSubmit((v) => invite.mutate(v))}>
          <div className="space-y-1.5">
            <Label>Work email</Label>
            <Input type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <select
              className="h-11 w-full rounded-xl border border-[var(--color-border)] px-3 text-sm"
              {...form.register("roleId")}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          {devToken && (
            <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              Dev invite token: <code className="break-all">{devToken}</code>
            </p>
          )}
          <Button type="submit" className="w-full" disabled={invite.isPending}>
            Send invite
          </Button>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}

export function TeamMembersTable() {
  const members = useQuery({
    queryKey: ["members"],
    queryFn: () => platformClient.listMembers(),
  });
  const roles = useQuery({
    queryKey: ["roles"],
    queryFn: () => platformClient.getRoles(),
  });
  const qc = useQueryClient();

  const remove = useMutation({
    mutationFn: (userId: string) => platformClient.removeMember(userId),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Members</h2>
        <InviteMemberDialog roles={roles.data?.roles ?? []} />
      </div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(members.data ?? []).map((m) => (
              <tr key={m.userId} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium text-gray-900">
                  {[m.firstName, m.lastName].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">{m.email}</td>
                <td className="px-4 py-3">{m.roleName}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(m.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove.mutate(m.userId)}
                    disabled={remove.isPending}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PermissionsMatrix() {
  const roles = useQuery({
    queryKey: ["roles"],
    queryFn: () => platformClient.getRoles(),
  });

  if (!roles.data) return null;

  return (
    <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
        Permissions matrix
      </h2>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
            <th className="py-2 pr-4">Permission</th>
            {roles.data.roles.map((role) => (
              <th key={role.id} className="px-3 py-2 text-center">
                {role.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.data.permissions.map((perm) => (
            <tr key={perm.id} className="border-b border-gray-50">
              <td className="py-2 pr-4">
                <div className="font-medium text-gray-800">{perm.slug}</div>
                <div className="text-xs text-gray-500">{perm.description}</div>
              </td>
              {roles.data.roles.map((role) => (
                <td key={role.id} className="px-3 py-2 text-center">
                  {role.permissions.includes(perm.slug) ? "✓" : "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
