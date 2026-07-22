import type { AuditEvent, Tenant, User } from "./types";

/**
 * Thin typed HTTP client for the hireOsBe platform API. hireOsFe never
 * imports backend code directly — this is the only integration point
 * between the two repos, matching the org's frontend/backend split.
 */
const PLATFORM_API_URL = process.env.PLATFORM_API_URL ?? "http://localhost:4000";

interface RequestContext {
  tenantId?: string;
  actorId?: string;
  actorRole?: string;
}

async function platformFetch<T>(path: string, ctx: RequestContext, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (ctx.tenantId) headers.set("x-tenant-id", ctx.tenantId);
  if (ctx.actorId) headers.set("x-actor-id", ctx.actorId);
  if (ctx.actorRole) headers.set("x-actor-role", ctx.actorRole);
  if (init?.body) headers.set("content-type", "application/json");

  const response = await fetch(`${PLATFORM_API_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Platform request failed: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T;
}

export const platformClient = {
  getCurrentTenant: (ctx: RequestContext) => platformFetch<Tenant>("/tenants/me", ctx),
  listUsers: (ctx: RequestContext) => platformFetch<User[]>("/users", ctx),
  listAuditEvents: (ctx: RequestContext) => platformFetch<AuditEvent[]>("/audit-events", ctx),
};
