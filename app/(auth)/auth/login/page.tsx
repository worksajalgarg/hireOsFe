"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { getDefaultLandingPath } from "@/lib/permissions";
import { loginSchema } from "@/lib/schemas/auth";
import { platformClient, setAccessToken } from "@/lib/platform-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

type LoginValues = z.infer<typeof loginSchema>;

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.6 2.8 12 2.8 6.9 2.8 2.8 6.9 2.8 12S6.9 21.2 12 21.2c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.1-1.3H12z"
      />
      <path fill="#34A853" d="M3.9 7.5l3 2.2C7.7 7.6 9.7 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.7 3.7 14.6 2.8 12 2.8 8.4 2.8 5.3 4.8 3.9 7.5z" />
      <path fill="#4A90E2" d="M12 21.2c2.5 0 4.6-.8 6.1-2.2l-2.8-2.2c-.8.5-1.8.9-3.3.9-3.5 0-4.9-2.4-5.1-3.6l-3 2.3C5.2 19.2 8.3 21.2 12 21.2z" />
      <path fill="#FBBC05" d="M6.9 14.1c-.2-.6-.4-1.3-.4-2.1s.1-1.5.4-2.1l-3-2.3C3.5 9 3.2 10.4 3.2 12s.3 3 1.1 4.4l2.6-2.3z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ssoMessage, setSsoMessage] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      const result = await platformClient.login(values);
      setAccessToken(result.accessToken);
      // document.cookie write happens inside an async submit handler after an
      // await, not during render, so it's not a React-tracked mutation the
      // compiler needs to guard against; the rule can't distinguish that
      // statically.
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = "hireos_access_hint=1; path=/; max-age=86400; SameSite=Lax";
      router.push(getDefaultLandingPath(result.user.permissions));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  });

  const onSso = async (provider: string) => {
    setSsoMessage(null);
    setError(null);
    try {
      // Stub: exchange a placeholder code; real WorkOS wiring comes later
      const result = await platformClient.ssoCallback(provider, "email:admin@hireos.local");
      setAccessToken(result.accessToken);
      router.push(getDefaultLandingPath(result.user.permissions));
    } catch (err) {
      setSsoMessage(err instanceof Error ? err.message : "SSO is not available yet");
    }
  };

  return (
    <div className="w-full max-w-[420px] animate-fade-up rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(20,30,60,0.08)]">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Sign in to HireOS</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Enter your credentials to manage your talent pipeline.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work Email</Label>
          <Input id="email" type="email" placeholder="name@company.com" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-red-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-gray-800">
              Forgot password?
            </Link>
          </div>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password && (
            <p className="text-xs text-red-600">{form.formState.errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        <span>or continue with</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="animate-fade-up-delay space-y-3">
        <Button type="button" variant="outline" className="w-full rounded-xl" onClick={() => onSso("google")}>
          <GoogleIcon />
          Continue with Google
        </Button>
        <Button type="button" variant="outline" className="w-full rounded-xl" onClick={() => onSso("saml")}>
          <KeyRound className="h-4 w-4 text-gray-500" />
          Continue with SAML SSO
        </Button>
        {ssoMessage && <p className="text-center text-xs text-amber-700">{ssoMessage}</p>}
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <a href="mailto:access@hireos.local" className="font-semibold text-gray-900">
          Request Access
        </a>
      </p>
    </div>
  );
}
