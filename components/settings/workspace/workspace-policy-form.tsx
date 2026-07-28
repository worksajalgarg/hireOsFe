"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import { workspacePolicySchema } from "@/lib/schemas/auth";
import { platformClient, getAccessToken, setAccessToken } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Values = z.infer<typeof workspacePolicySchema>;

export function WorkspacePolicyForm() {
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (!getAccessToken()) {
      platformClient
        .refresh()
        .then((r) => setAccessToken(r.accessToken))
        .catch(() => router.push("/auth/login"));
    }
  }, [router]);

  const settings = useQuery({
    queryKey: ["workspace-settings"],
    queryFn: () => platformClient.getWorkspaceSettings(),
  });

  const form = useForm<Values>({
    resolver: zodResolver(workspacePolicySchema),
    values: {
      name: settings.data?.tenant.name ?? "",
      domain: settings.data?.tenant.domain ?? "",
      logoUrl: settings.data?.tenant.logoUrl ?? "",
      primaryColor:
        (settings.data?.tenant.settingsJson?.primaryColor as string | undefined) ?? "#0A1F33",
      retentionDays: settings.data?.policy.retentionDays ?? 90,
      audioStorageEnabled: settings.data?.policy.audioStorageEnabled ?? false,
      humanOverrideRequired: settings.data?.policy.humanOverrideRequired ?? true,
    },
  });

  const save = useMutation({
    mutationFn: (values: Values) =>
      platformClient.updateWorkspaceSettings({
        name: values.name,
        domain: values.domain,
        logoUrl: values.logoUrl || undefined,
        settingsJson: { primaryColor: values.primaryColor },
        retentionDays: values.retentionDays,
        audioStorageEnabled: values.audioStorageEnabled,
        humanOverrideRequired: values.humanOverrideRequired,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["workspace-settings"] });
    },
  });

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit((v) => save.mutate(v))}>
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Workspace details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-1.5">
            <Label>Custom domain</Label>
            <Input {...form.register("domain")} />
          </div>
          <div className="space-y-1.5">
            <Label>Logo URL</Label>
            <Input placeholder="https://…" {...form.register("logoUrl")} />
          </div>
          <div className="space-y-1.5">
            <Label>Primary brand color</Label>
            <Input type="color" className="h-11 w-24 p-1" {...form.register("primaryColor")} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Enterprise policies
        </h2>
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <Label>Retention period (days)</Label>
              <span className="font-medium text-gray-700">{form.watch("retentionDays")}</span>
            </div>
            <Controller
              control={form.control}
              name="retentionDays"
              render={({ field }) => (
                <Slider.Root
                  className="relative flex h-5 w-full touch-none items-center"
                  min={30}
                  max={365}
                  step={1}
                  value={[field.value]}
                  onValueChange={(v) => field.onChange(v[0])}
                >
                  <Slider.Track className="relative h-1.5 grow rounded-full bg-gray-200">
                    <Slider.Range className="absolute h-full rounded-full bg-[var(--color-navy)]" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-4 w-4 rounded-full bg-[var(--color-navy)] shadow" />
                </Slider.Root>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="audioStorageEnabled"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-4 text-sm text-gray-700">
                <span>Audio recording storage</span>
                <Switch.Root
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-6 w-11 rounded-full bg-gray-300 data-[state=checked]:bg-[var(--color-navy)]"
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </label>
            )}
          />

          <Controller
            control={form.control}
            name="humanOverrideRequired"
            render={({ field }) => (
              <label className="flex items-center justify-between gap-4 text-sm text-gray-700">
                <span>Mandate human rationale on AI override</span>
                <Switch.Root
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-6 w-11 rounded-full bg-gray-300 data-[state=checked]:bg-[var(--color-navy)]"
                >
                  <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </label>
            )}
          />
        </div>
      </section>

      <Button type="submit" disabled={save.isPending}>
        {save.isPending ? "Saving…" : "Save workspace settings"}
      </Button>
      {save.isSuccess && <p className="text-sm text-emerald-700">Settings updated.</p>}
      {save.isError && (
        <p className="text-sm text-red-600">
          {save.error instanceof Error ? save.error.message : "Save failed"}
        </p>
      )}
    </form>
  );
}
