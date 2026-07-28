"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { acceptInviteSchema } from "@/lib/schemas/auth";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Values = z.infer<typeof acceptInviteSchema>;

function AcceptInviteForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      token: params.get("token") ?? "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await platformClient.acceptInvite({
        token: values.token,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept invite");
    }
  });

  return (
    <div className="w-full max-w-[420px] animate-fade-up rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(20,30,60,0.08)]">
      <h1 className="text-2xl font-semibold text-gray-900">Join your workspace</h1>
      <p className="mt-2 text-sm text-gray-500">Set a password to activate your HireOS account.</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="token">Invite token</Label>
          <Input id="token" {...form.register("token")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...form.register("firstName")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...form.register("lastName")} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...form.register("password")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          Activate account
        </Button>
        <Link href="/auth/login" className="block text-center text-sm text-gray-500">
          Already have an account? Sign in
        </Link>
      </form>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500">Loading…</div>}>
      <AcceptInviteForm />
    </Suspense>
  );
}
