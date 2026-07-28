# hireOsFe

Frontend for the Enterprise AI Hiring Platform — Next.js + TypeScript. Recruiter, admin, and candidate experiences. No backend logic lives here; see the companion [hireOsBe](../hireOsBe) repo for the NestJS API and AI service this app talks to.

## Layout
- `app/(auth)/auth/*` — login, forgot password, accept invite
- `app/(dashboard)/settings/*` — profile, workspace policies, team/RBAC
- `lib/platform-client.ts` — typed HTTP client for `/api/v1` (Bearer + cookie credentials)
- `lib/types/` — hand-synced contracts with `hireOsBe/platform/src/common/types`

## Quickstart

```bash
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

Requires `hireOsBe` platform API on `http://localhost:4000` (seeded admin: `admin@hireos.local` / `Password123!`).

## Checks
```bash
npm run typecheck
npm run lint
npm run build
```
