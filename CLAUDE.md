# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository scope

This is **hireOsFe** — the frontend-only repo for the Enterprise AI Hiring Platform, split out from a former monorepo. It is a Next.js + TypeScript app with no backend logic: no database access, no LLM calls, no business rules. Everything here talks to the backend (**hireOsBe**, a sibling repo) over HTTP through `lib/platform-client.ts`.

If a task looks like it needs a database query, a new API endpoint, tenant/RBAC logic, or an AI agent — that work belongs in `hireOsBe`, not here.

## Product context (condensed — see hireOsBe's CLAUDE.md for the full architecture)

An enterprise hiring intelligence platform: recruiters define roles, candidates get evidence-based resume + AI voice-interview assessments, and humans make the final call. Three experiences live in `app/`:
- `app/recruiter/dashboard` — candidate review, evidence, shortlisting.
- `app/admin/dashboard` — tenant/user management, audit log views.
- `app/candidate/interview` — the candidate-facing voice interview UI (not yet implemented — backend voice runtime is a later milestone).

## UI constraints that come from the product's Responsible AI requirements

These aren't optional styling choices — they reflect hard requirements from the product spec, so don't "simplify" them away:
- **Never collapse a score and its evidence into one number.** Any UI showing a candidate evaluation must show `score`, `evidenceStrength`, and `confidence` as distinct, visible fields (see `lib/types/evaluation.ts`), with `missingEvidence`/`contradictions` visible, not hidden behind a tooltip.
- **No facial, emotional, accent, or personality signals in any UI** — the backend never produces these fields, so there is nothing to render, but do not add UI affordances that imply such analysis exists.
- **AI recommendation and human decision are separate fields, always.** Never render an AI `recommendation` (`strong_review | review | further_assessment | insufficient_data`) as if it were a final hire/reject outcome — it isn't one, and the backend enforces this by never producing one.

## Integration with hireOsBe

- `lib/platform-client.ts` is the **only** place that talks to the backend. It reads `PLATFORM_API_URL` (see `.env.example`) and passes tenant/actor identity via headers (`x-tenant-id`, `x-actor-id`, `x-actor-role`) — there is no session-based auth yet on either side.
- `lib/types/` is a **hand-maintained duplicate** of `hireOsBe/platform/src/common/types`. If you change a shared type here, make the same change in hireOsBe (and vice versa) — there is no automated sync or shared package between the two repos at this stage.
