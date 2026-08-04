# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository scope

This is **hireOsFe** — the frontend-only repo for the Enterprise AI Hiring Platform, split out from a former monorepo. It is a Next.js + TypeScript app with no backend logic: no database access, no LLM calls, no business rules. Everything here talks to the backend (**hireOsBe**, a sibling repo) over HTTP through `lib/platform-client.ts`.

If a task looks like it needs a database query, a new API endpoint, tenant/RBAC logic, or an AI agent — that work belongs in `hireOsBe`, not here.

## Product context (condensed — see hireOsBe's CLAUDE.md for the full architecture)

An enterprise hiring intelligence platform: recruiters define roles, candidates get evidence-based resume + AI voice-interview assessments, and humans make the final call. Three experiences live in `app/`:
- `app/recruiter/dashboard` — candidate review, evidence, shortlisting.
- `app/admin/dashboard` — tenant/user management, audit log views.
- `app/candidate/interview/[inviteToken]` — the candidate-facing AI voice interview UI, connected to LiveKit (`livekit-client`/`@livekit/components-react`). Currently a narrow POC: one screen (consent + mic permission + live room), not the full FR-501–508 flow (dedicated Device Check/Failure-recovery/Completion screens still land with the Sprint 4/6 build-out). No session-cookie auth — the candidate joins via a single-use invite token in the URL, validated server-side by `hireOsBe`'s `POST /interviews/join`.

## UI constraints that come from the product's Responsible AI requirements

These aren't optional styling choices — they reflect hard requirements from the product spec, so don't "simplify" them away:
- **Never collapse a score and its evidence into one number.** Any UI showing a candidate evaluation must show `score`, `evidenceStrength`, and `confidence` as distinct, visible fields (see `lib/types/evaluation.ts`), with `missingEvidence`/`contradictions` visible, not hidden behind a tooltip.
- **No facial, emotional, accent, or personality signals in any UI** — the backend never produces these fields, so there is nothing to render, but do not add UI affordances that imply such analysis exists.
- **AI recommendation and human decision are separate fields, always.** Never render an AI `recommendation` (`strong_review | review | further_assessment | insufficient_data`) as if it were a final hire/reject outcome — it isn't one, and the backend enforces this by never producing one.

## Integration with hireOsBe

- `lib/platform-client.ts` is the **only** place that talks to the backend. It reads `NEXT_PUBLIC_PLATFORM_API_URL` (see `.env.example`) and authenticates recruiter/admin requests with a Bearer token (stored in `sessionStorage`, set via `setAccessToken`) — there is no cookie-session auth on either side. The candidate interview flow (`joinInterview`) is the one deliberate exception: it's unauthenticated, using a single-use invite token in the URL instead, validated server-side.
- `lib/types/` is a **hand-maintained duplicate** of `hireOsBe/platform/src/common/types`. If you change a shared type here (`Tenant`, `User`, `AuditEvent`, `CandidateEvaluation`, `InterviewSession`), make the same change in hireOsBe (and vice versa) — there is no automated sync or shared package between the two repos at this stage.
