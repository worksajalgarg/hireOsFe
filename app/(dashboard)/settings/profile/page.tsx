"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePasswordSchema, profileSchema } from "@/lib/schemas/auth";
import { platformClient, getAccessToken, setAccessToken } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof changePasswordSchema>;

export default function ProfileSettingsPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: me.data?.profile?.firstName ?? "",
      lastName: me.data?.profile?.lastName ?? "",
      phone: me.data?.profile?.phone ?? "",
      jobTitle: me.data?.profile?.jobTitle ?? "",
      avatarUrl: me.data?.profile?.avatarUrl ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const saveProfile = useMutation({
    mutationFn: (values: ProfileValues) => platformClient.updateProfile(values),
    onSuccess: async () => {
      setMessage("Profile saved");
      await qc.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const savePassword = useMutation({
    mutationFn: (values: PasswordValues) =>
      platformClient.changePassword(values.currentPassword, values.newPassword),
    onSuccess: () => {
      setMessage("Password updated");
      passwordForm.reset();
    },
  });

  const onAvatar = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    // Placeholder URL until MinIO upload lands
    profileForm.setValue("avatarUrl", `local-preview://${file.name}`);
  };

  if (me.isError) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">Personal details and account security.</p>
      </div>

      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">Avatar</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-lg font-semibold text-gray-500">
            {avatarPreview || me.data?.profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarPreview ?? me.data?.profile?.avatarUrl ?? ""}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              (me.data?.profile?.firstName?.[0] ?? "U")
            )}
          </div>
          <label className="cursor-pointer rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onAvatar(e.target.files?.[0])}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Personal details
        </h2>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={profileForm.handleSubmit((v) => saveProfile.mutate(v))}
        >
          <div className="space-y-1.5">
            <Label>First name</Label>
            <Input {...profileForm.register("firstName")} />
          </div>
          <div className="space-y-1.5">
            <Label>Last name</Label>
            <Input {...profileForm.register("lastName")} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input {...profileForm.register("phone")} />
          </div>
          <div className="space-y-1.5">
            <Label>Job title</Label>
            <Input {...profileForm.register("jobTitle")} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saveProfile.isPending}>
              Save profile
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Password & MFA
        </h2>
        <form
          className="grid max-w-md gap-4"
          onSubmit={passwordForm.handleSubmit((v) => savePassword.mutate(v))}
        >
          <div className="space-y-1.5">
            <Label>Current password</Label>
            <Input type="password" {...passwordForm.register("currentPassword")} />
          </div>
          <div className="space-y-1.5">
            <Label>New password</Label>
            <Input type="password" {...passwordForm.register("newPassword")} />
          </div>
          <div className="space-y-1.5">
            <Label>Confirm password</Label>
            <Input type="password" {...passwordForm.register("confirmPassword")} />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            <span>MFA (TOTP)</span>
            <span className="text-xs font-medium text-amber-700">Coming soon</span>
          </div>
          <Button type="submit" disabled={savePassword.isPending}>
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
