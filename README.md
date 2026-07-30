# hireOsFe

Frontend for the Enterprise AI Hiring Platform — Next.js + TypeScript. Recruiter, admin, and candidate experiences. No backend logic lives here; see the companion [hireOsBe](../hireOsBe) repo for the NestJS API and AI service this app talks to.

## Layout
- `app/(auth)/auth/*` — login, forgot password, accept invite
- `app/(dashboard)/settings/*` — profile, workspace policies, team/RBAC
- `app/candidate/interview/[inviteToken]/` — candidate-facing AI voice interview room (LiveKit POC, unauthenticated invite-link flow — no session cookie)
- `lib/platform-client.ts` — typed HTTP client for `/api/v1` (Bearer + cookie credentials)
- `lib/types/` — hand-synced contracts with `hireOsBe/platform/src/common/types`

## Quickstart

```bash
npm install
cp .env.example .env.local
npm run dev             # http://localhost:3000
```

Requires `hireOsBe` platform API on `http://localhost:4000` (seeded admin: `admin@hireos.local` / `Password123!`).

## LiveKit voice interview (POC)

`app/candidate/interview/[inviteToken]/page.tsx` connects to a LiveKit room via `livekit-client`/`@livekit/components-react` (consent → mic permission → live agent audio). Needs `hireOsBe`'s `livekit-server` + `platform` + `ai-service` voice agent worker running — see `hireOsBe/README.md`'s "LiveKit voice interview (POC)" section for the full local setup and how to get an invite URL.

## Checks
```bash
npm run typecheck
npm run lint
npm run build
```
