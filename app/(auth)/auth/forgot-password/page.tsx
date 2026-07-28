"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/schemas/auth";
import { platformClient } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Values = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const [devToken, setDevToken] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await platformClient.forgotPassword(values.email);
    setDevToken(result.devToken ?? null);
    setDone(true);
  });

  return (
    <div className="w-full max-w-[420px] animate-fade-up rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(20,30,60,0.08)]">
      <h1 className="text-2xl font-semibold text-gray-900">Reset your password</h1>
      <p className="mt-2 text-sm text-gray-500">
        We&apos;ll email a reset link if an account exists for that address.
      </p>

      {done ? (
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p>If an account exists, a reset email has been sent.</p>
          {devToken && (
            <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
              Dev token: <code className="break-all">{devToken}</code>
            </p>
          )}
          <Link href="/auth/login" className="font-semibold text-[var(--color-navy)]">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
          </div>
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Send reset link
          </Button>
          <Link href="/auth/login" className="block text-center text-sm text-gray-500">
            Back to sign in
          </Link>
        </form>
      )}
    </div>
  );
}
