# hireOsFe

Frontend for the Enterprise AI Hiring Platform — Next.js + TypeScript. Recruiter, admin, and candidate experiences. No backend logic lives here; see the companion [hireOsBe](../hireOsBe) repo for the NestJS API and AI service this app talks to.

## Layout
- `app/` — Next.js App Router routes: `recruiter/dashboard`, `admin/dashboard`, `candidate/interview`.
- `lib/platform-client.ts` — the only integration point with the backend, a typed HTTP client reading `PLATFORM_API_URL`.
- `lib/types/` — duplicated copy of the backend's shared type contracts (`Tenant`, `User`, `AuditEvent`, `CandidateEvaluation`). Kept in sync by hand with `hireOsBe/platform/src/common/types` — there is currently no automated check for drift between the two copies.

## Quickstart

```bash
npm install
cp .env.example .env   # sets PLATFORM_API_URL if hireOsBe isn't on localhost:4000
npm run dev             # http://localhost:3000
```

Requires `hireOsBe`'s platform API running (default expected at `http://localhost:4000`) for any page that calls `platformClient`.

## Checks (what CI runs)
```bash
npm run typecheck
npm run lint
npm run build
```

## Known accepted risk
`npm audit` reports moderate/high findings in `postcss`/`sharp`, both bundled transitively inside Next.js itself. At time of writing, Next 16.2.11 is the newest stable release and still ships these — there is no newer version to bump to yet. The CI `security-baseline` job's `npm audit` step is non-blocking for this reason.
