# HireOS — Master Design Plan

**Source documents analyzed:** `Enterprise_AI_Hiring_MVP_PRD_and_Roadmap(2).pdf`, `Enterprise_AI_Hiring_Platform_Technical_Roadmap.pdf`, `index(1).html` (aspirational prototype), `design.md` (visual system), `CLAUDE.md` (repo constraints).

**Scope stance (see §0):** This plan designs the PRD's 12-week MVP in full depth. The broader prototype (sourcing, CRM, workflow automation, integrations hub, analytics suite) is real product direction but is out of MVP scope — it is captured as Phase 2/3, named and sequenced, not exploded into full screen specs. Building any Phase 2/3 screen today would contradict the PRD's explicit non-goals and the CPTO's "decision-support layer, not a full ATS" positioning.

---

## 0. Why two documents disagree, and how this plan resolves it

`docs/index(1).html` depicts Agentic Sourcing, a Talent CRM Kanban, a no-code Workflow Automation builder, a 12-tile Integration hub, and a full BI-style Analytics module. The PRD explicitly puts all of that in **"What we are not building"** and **"Explicitly out of scope for MVP"** (§3, Technical Roadmap p.10 "Explicitly deferred"). The prototype is a north-star product-map artifact (it literally has a page called "Platform Capability Map" enumerating 12 future modules) — not the 12-week build target.

**Resolution:** every screen in this plan is tagged `[MVP]` or `[Phase 2/3]`. Only `[MVP]` screens get full per-screen specs (§6). `[Phase 2/3]` screens are named once in the IA (§4) and the roadmap (§8/§9) so nothing is silently lost, but are not designed further until a post-pilot trigger in PRD §15 fires.

---

## 1. Foundational Understanding

**Business goal:** Convert role context into structured, explainable candidate evidence via resume intelligence + AI voice screening, while keeping final hiring authority with authorized humans (PRD p.1 thesis).

**User goal:** Recruiters/hiring managers want to screen more candidates consistently, in less time, without losing the ability to explain *why* a candidate advanced.

**Pain points (PRD §1):**
- JDs don't capture real success criteria.
- Resume screening overweights keywords/pedigree over verified experience.
- First-round interviews are inconsistent across interviewers and don't validate resume claims.
- Hiring teams can't explain why one candidate progressed and another didn't.
- Generic "black-box" AI screening damages brand trust.

**Success metrics (PRD §10, §Pilot success thresholds):**
- ≥70% invited candidates complete the AI interview.
- ≥40% recruiter time reduction.
- ≥80% hiring-manager report usefulness rating.
- <10% technical retry rate.
- 100% of decisions have supporting evidence; <2% unsupported material statements.
- North-star: qualified candidates reviewed per recruiter-hour, without sacrificing evidence quality, candidate experience, or human control.

**Personas:** see §3.

**Business workflow (PRD §1 diagram, condensed):**

```
Role Context → Approved Rubric → Resume Evidence → AI Voice Screen → Explainable Review → Human Decision
```
AI structures evidence and recommends; humans retain final decision authority at every gate.

**Technical constraints (this repo, per CLAUDE.md + Technical Roadmap):**
- `hireOsFe` is presentation-only. No DB, no LLM calls, no business rules live here — everything crosses `lib/platform-client.ts` to `hireOsBe`.
- Backend is a NestJS modular monolith + separate Python/FastAPI AI control plane; scoring is **deterministic** (weights/rules/thresholds), never LLM-decided (Technical Roadmap p.3, p.5 "Final ranking — No LLM").
- No session-based auth yet; identity passed via `x-tenant-id` / `x-actor-id` / `x-actor-role` headers — so **there is currently no login screen contract from the backend side**. This is the single biggest gap flagged in §2.
- Every score/evidence/confidence field must render as distinct UI elements (CLAUDE.md, PRD FR-602) — this is a hard constraint on every candidate-evaluation screen in §6.

---

## 2. Gap Analysis — What the PRD Doesn't Say (But an Enterprise Product Needs)

Legend: ✅ covered by PRD/roadmap · ⚠️ implied but underspecified · ❌ missing, needs to be designed here.

| Area | Status | Notes |
|---|---|---|
| Login / SSO | ⚠️ | PRD says "SSO-ready architecture" (§8.1) but no session/login flow is specified anywhere — headers imply auth happens upstream (gateway/IdP). **A login screen must still exist in this FE** for the pre-SSO pilot window. |
| Signup / self-registration | ❌ | Not applicable — B2B enterprise workspace provisioning is admin-invite only (FR-101/102). No public signup. |
| Forgot / reset password | ❌ | Not specified. Needed if login is password-based pre-SSO. |
| OTP / MFA | ⚠️ | "MFA required for admins" (prototype Admin page) — PRD doesn't detail the challenge screen. |
| Session expired | ❌ | Not addressed. 30-min session timeout mentioned in prototype only. Needed given long-running interview review sessions. |
| RBAC / permission-denied | ✅ | FR-102/104, roles table (Recruiter/Hiring Manager/Admin/Auditor). Needs an explicit "Access Denied" screen per §5. |
| Profile | ❌ | Not covered. Minimal profile/settings screen still needed for any multi-user product. |
| Notifications | ⚠️ | "SLA reminders/escalations" implied by workflow (§FR area) but no notification center specified for MVP scope (workflow automation itself is Phase 2). A minimal in-app alert is still needed for review-queue SLAs (FR-701). |
| Settings | ⚠️ | Tenant policy config exists (FR-105) but no personal settings screen. |
| Audit Logs | ✅ | Fully specified — Governance Centre, FR-801/806. |
| Permission management UI | ⚠️ | RBAC exists (FR-102) but no screen to assign roles is detailed — must be designed (Admin > Users & Roles). |
| Search / Filter / Sort | ✅ | FR-701 (candidate list filters), review queue. |
| Bulk actions | ⚠️ | Only "bulk screening" trigger implied; no bulk UI pattern specified — needed for Candidate Intelligence review queue. |
| Import / Export | ✅ | CSV/API ingestion (FR-301); audit/evidence export (FR-806). |
| Delete confirmation | ⚠️ | Data deletion workflow (FR-802/803) exists at policy level; a candidate-record delete confirmation UI is not specified — must design. |
| Unsaved changes guard | ❌ | Not addressed — critical for the multi-step Role Context Studio (FR-201–206) and Interview Design Studio. |
| 404 / 500 | ❌ | Not addressed anywhere — must design generic error pages. |
| Maintenance mode | ❌ | Not addressed — worth a minimal banner given 99.5% availability target (§9 NFR). |
| Offline / degraded network | ✅ (partially) | FR-505/507 mandate recovery from transient network failure during interviews — this is a first-class flow (§7). |
| Empty states | ⚠️ | Implied everywhere (e.g., "no candidates yet") but never explicitly speced — must design per list screen. |
| Skeleton / loading states | ⚠️ | Latency targets exist (§9: resume 60s, evaluation 5min) — loading states must communicate these waits explicitly. |
| Success / error states | ✅ (implicit via acceptance signals) | Each FR row has an "acceptance signal" that implies a success state. |
| Retry flow | ✅ | FR-507 (pause/reschedule/retry), FR-505 (session resume). |
| Onboarding | ❌ | Not addressed — no first-run tour for a new tenant/recruiter. Needed given "pilot readiness: onboarding, support playbook" (roadmap Week 11) exists at ops level but not as a UI. |
| Help / Support | ⚠️ | "Support/accommodation route" mandatory for candidates (FR-502, §6.5) — recruiter-side help is not specified. |
| Activity timeline / history | ✅ | Governance audit timeline (FR-801), scorecard version history (FR-205). |
| Approval flow | ✅ | Role approval (FR-201–206), decision committee approval implied in Decision Workspace. |
| Data validation | ✅ | Extensive — FR-301 (file validation), FR-201 (required fields). |
| Pagination | ⚠️ | Implied by "5,000 candidates per role" scale target (§9) — must design for candidate list. |
| Responsive design | ✅ | Full breakpoint spec in `design.md`. |
| Accessibility | ✅ | §9 NFR: keyboard nav, screen-reader labels, captions, non-voice alternative for the interview — a first-class requirement, not an afterthought. |
| Dark mode | ❌ | Not specified in PRD; `design.md` is light-canvas only. Not required for MVP. |
| Keyboard navigation | ✅ | §9 NFR explicit requirement. |
| Internationalization | ⚠️ | English-only for MVP pilot (§ Pilot boundaries); Hindi/Hinglish is a named Phase 2 trigger (§15). Structure the UI for future i18n but do not build a language switcher now. |
| Consent / disclosure management | ✅ | FR-502, §6.5 — this is unusually first-class here versus typical enterprise SaaS, because it's a Responsible-AI requirement, not a legal afterthought. |
| Candidate appeal / complaint | ✅ | §8.3 "candidate appeal workflow enabled," §6.5 "report a technical or fairness concern" — needs a concrete screen (§10 AI-recommended fills a gap here: evidence-facing appeal view). |

---

## 3. User Roles

| Role | Purpose | Permissions | Restrictions | Pages Accessible | Actions Allowed | Actions Restricted |
|---|---|---|---|---|---|---|
| **Recruiter / Talent Partner** | Runs day-to-day screening for assigned roles | Full CRUD on assigned requisitions/candidates | Cannot see candidates outside assigned roles; PII masked per policy | Workspace Home, Role Context Studio (edit), Candidate Intelligence, Interview Design Studio, Decision Workspace | Create role draft, review resume evidence, invite to AI interview, disposition candidates with rationale | Cannot approve budget/compensation exceptions; cannot change tenant policy; cannot view audit/governance |
| **Hiring Manager** | Owns business outcome for a role; approves rubric and makes/co-makes final call | Approve rubric, view evidence, record/co-record decision | Limited PII; cannot edit workflow policy or invite candidates directly | Role Context Studio (approve), Candidate Intelligence (read), Decision Workspace | Approve scorecard, compare finalists, record decision + rationale | Cannot bulk-screen, cannot manage users, no audit export |
| **TA Leader / Workspace Admin** | Configures the tenant, owns governance & team performance | Manage users/roles, tenant policy, sees all business units | Still cannot bypass "human decision required" gate for any candidate | All MVP modules including Governance Centre, Admin/Users | Invite/deactivate users, assign roles, configure retention policy, export audit | Cannot directly overturn a recorded human decision without an audited override |
| **Compliance Reviewer** | Independent oversight of fairness/explainability | Read all decisions (redacted PII), full audit access | Cannot initiate hiring actions | Governance Centre, Decision Workspace (read-only), Audit Timeline | Investigate flagged fairness variance, generate evidence packs | Cannot edit rubrics, cannot advance/reject candidates |
| **Enterprise Admin / Auditor** | Tenant-level security & deployment configuration | RBAC, SSO config, data residency, backups | No candidate-evaluation actions | Admin/Security, Governance Centre | Configure SSO/SCIM, MFA policy, session settings | Cannot see unmasked candidate PII beyond need-to-know |
| **Candidate** | Completes screening | Consent, take interview, view own status | No access to scores/comparisons of self or others beyond disclosed summary | Candidate invitation page, AI Voice Interview, completion/confirmation | Consent, test mic/network, complete interview, request accommodation, report a concern | Cannot see internal fit score, competency breakdown, or other candidates |

Role identity maps to `x-actor-role` sent by `lib/platform-client.ts`; the FE must gate navigation/components client-side per role but treat all authorization as backend-enforced (never trust client-side role checks for security, only for UX).

---

## 4. Information Architecture

```
HireOS
├── Auth                                  [MVP — gap-filled, see §2]
│   ├── Login
│   ├── Forgot Password / Reset Password
│   ├── MFA Challenge (admin)
│   └── Session Expired
├── Workspace (tenant home)               [MVP]
│   ├── Action Inbox / Dashboard
│   └── Onboarding (first-run)            [MVP — AI Recommended]
├── Role Context Studio                   [MVP]  — FR-201–206
│   ├── Role list
│   ├── Create/Edit role (4-step wizard)
│   └── Role version history
├── Candidate Intelligence                [MVP]  — FR-301–306
│   ├── Candidate list / review queue
│   ├── Candidate 360° profile
│   ├── Resume evidence viewer
│   └── Duplicate resolution
├── Interview Design Studio               [MVP]  — FR-401–406
│   ├── Interview plan builder
│   ├── Question quality review
│   └── Approval & lock
├── AI Voice Interview (candidate app)     [MVP]  — FR-501–508
│   ├── Invitation / disclosure
│   ├── Device check
│   ├── Live interview
│   ├── Pause/reschedule/support
│   └── Completion & privacy notice
├── Evaluation & Explainability           [MVP]  — FR-601–606
│   ├── Candidate evaluation report
│   └── Evidence/contradiction drill-down
├── Decision Workspace                     [MVP]  — FR-701–705
│   ├── Finalist comparison matrix
│   ├── Human decision recorder
│   └── Decision history
├── Governance Centre                      [MVP]  — FR-801–806
│   ├── Audit timeline
│   ├── Model/prompt registry
│   ├── Retention & deletion console
│   ├── Fairness monitoring
│   └── Evidence pack export
├── Admin                                  [MVP — gap-filled]
│   ├── Users & Roles (RBAC)
│   ├── Tenant Settings / Branding
│   ├── Security (SSO/MFA/session policy)
│   └── Profile / Personal Settings
├── Support / Help                         [MVP — AI Recommended]
├── Error states (404/500/Access Denied)   [MVP — gap-filled]
│
├── Talent Sourcing (Agentic)              [Phase 2 — see PRD §15 "3–6 months"]
├── Talent CRM / Pipeline Kanban           [Phase 2]
├── Workflow Automation Builder            [Phase 2 — trigger: validated recruiter adoption]
├── Enterprise Integrations Hub            [Phase 2 — trigger: 2 paying customers]
└── Hiring Analytics Suite                 [Phase 2/3 — trigger: reliable quality metrics]
```

---

## 5. Complete Screen Inventory (MVP)

Each row: screen · type · priority (see §9 for rationale).

| # | Screen | Type | Priority |
|---|---|---|---|
| 1 | Login | Main | P0 |
| 2 | Forgot Password | Main | P1 |
| 3 | Reset Password | Main | P1 |
| 4 | MFA Challenge | Modal | P1 |
| 5 | Session Expired | Interstitial | P0 |
| 6 | Workspace Home / Action Inbox | Main | P0 |
| 7 | Onboarding Tour (first login) | Wizard/Overlay | P2 — AI Recommended |
| 8 | Role List | Main | P0 |
| 9 | Create Role — Step 1 Business Context | Wizard step | P0 |
| 10 | Create Role — Step 2 Competency Model | Wizard step | P0 |
| 11 | Create Role — Step 3 Evaluation Plan | Wizard step | P0 |
| 12 | Create Role — Step 4 Approval & Publish | Wizard step | P0 |
| 13 | Role Detail / Scorecard view | Sub screen | P0 |
| 14 | Role Version History | Sub screen | P1 |
| 15 | Unsaved Changes guard (role wizard) | Modal | P0 |
| 16 | Candidate Review Queue / List | Main | P0 |
| 17 | Candidate 360° Profile | Drawer | P0 |
| 18 | Resume Evidence Viewer | Sub screen | P0 |
| 19 | Duplicate Candidate Resolution | Modal | P1 |
| 20 | Bulk Screening Trigger + Progress | Modal/Toast | P1 |
| 21 | Candidate Delete Confirmation | Modal | P1 |
| 22 | Empty state — no candidates yet | Empty | P1 |
| 23 | Interview Plan Builder | Main | P0 |
| 24 | Question Quality Review | Sub screen | P0 |
| 25 | Interview Plan Approval & Lock | Modal | P0 |
| 26 | Candidate Invitation Page (branded) | Main (candidate) | P0 |
| 27 | Consent & Disclosure Screen | Main (candidate) | P0 |
| 28 | Device / Mic / Network Check | Main (candidate) | P0 |
| 29 | Live AI Voice Interview | Main (candidate) | P0 |
| 30 | Pause / Reschedule / Human-alternative | Modal (candidate) | P0 |
| 31 | Network-Failure Recovery | Interstitial (candidate) | P0 |
| 32 | Interview Completion & Privacy Notice | Main (candidate) | P0 |
| 33 | Post-interview Concern/Appeal Report | Main (candidate) | P1 — AI Recommended |
| 34 | Candidate Evaluation Report | Main | P0 |
| 35 | Evidence / Contradiction Drill-down | Drawer | P0 |
| 36 | Transcript Playback + Highlights | Sub screen | P1 |
| 37 | Finalist Comparison Matrix | Main | P0 |
| 38 | Human Decision Recorder | Panel/Modal | P0 |
| 39 | Decision History | Sub screen | P1 |
| 40 | Audit Timeline (searchable) | Main | P0 |
| 41 | Model / Prompt Registry | Main | P1 |
| 42 | Retention & Deletion Console | Main | P0 |
| 43 | Fairness / Adverse-Impact Monitoring | Main | P1 |
| 44 | Evidence Pack Export | Modal | P1 |
| 45 | Users & Roles (RBAC admin) | Main | P0 |
| 46 | Invite User | Modal | P0 |
| 47 | Tenant Settings / Branding | Main | P1 |
| 48 | Security Settings (SSO/MFA/session) | Main | P1 |
| 49 | Personal Profile / Settings | Main | P2 |
| 50 | Notification / Alert Center (minimal) | Panel | P2 |
| 51 | Help / Support | Main | P2 — AI Recommended |
| 52 | Access Denied (403) | Error | P0 |
| 53 | Not Found (404) | Error | P1 |
| 54 | Server Error (500) | Error | P1 |
| 55 | Maintenance Mode Banner | Interstitial | P2 — AI Recommended |

**Responsive variants:** every `Main` screen collapses per `design.md` breakpoints (1440/1024/768px); the Live AI Voice Interview and Device Check screens need a dedicated mobile-web layout since candidates frequently take interviews on phones (single-column video stage, larger touch targets ≥44×44px per `design.md` a11y rule).

---

## 6. Per-Screen Specs (MVP, representative depth)

To keep this document navigable, every P0 screen gets a full spec; P1/P2 screens get a condensed spec (purpose, key components, primary edge case) since their pattern is inherited from a sibling P0 screen.

### 6.1 Login `[P0]`
- **Purpose:** Authenticate a workspace user pre-SSO (PRD marks SSO "ready," not mandatory, for MVP).
- **Why it exists:** No login contract exists yet in the PRD/backend design — this is an FE-side gap-fill required for any multi-tenant pilot.
- **Users:** All internal roles (not candidates — candidates use the unauthenticated invitation link).
- **Entry point:** Direct URL / expired-session redirect.
- **Exit point:** Workspace Home (6.2), or Forgot Password.
- **Required components:** `text-input`, `button-primary-pill`, tenant logo slot (per tenant branding, FR-101).
- **States:** default, invalid-credentials error, account-locked, loading.
- **API dependency:** `platform-client.ts` auth call (conceptual — exact contract owned by hireOsBe).
- **Edge cases:** wrong tenant subdomain, disabled user account, MFA-required redirect.
- **Accessibility:** full keyboard flow, visible focus states, error announced via `aria-live`.

### 6.2 Workspace Home / Action Inbox `[P0]`
- **Purpose:** Surface prioritized, SLA-ranked actions (evidence review, decisions pending) — directly modeled on the prototype's Action Inbox pattern, which is compatible with MVP scope (it's a filtered view over Candidate Intelligence + Decision Workspace, not a new backend capability).
- **Users:** Recruiter, Hiring Manager, TA Leader.
- **Dependencies:** Candidate Intelligence review-queue data, Decision Workspace pending items.
- **Required components:** `card-dashboard-mockup`, `pill-tag-soft` status pills, KPI strip using `body-tabular`/`tnum` for all counts (design.md rule: never render metrics without `tnum`).
- **Empty state:** "No actions right now" — must not read as an error.
- **Loading state:** skeleton KPI strip + skeleton action rows (resume/evaluation latency targets mean this screen may show partial data — must label "processing" not "empty" when a report is still generating, per §9 NFR).
- **Edge case:** partial data (some candidates evaluated, others still processing) must show per-row status, not block the whole inbox.

### 6.3 Create Role — 4-step wizard `[P0]` (FR-201–206)
- **Purpose:** Turn JD + hiring-manager input into an approved, versioned, weighted rubric.
- **Steps:** Business Context → Competency Model (weights must total 100%, FR-203) → Evaluation Plan (interview coverage per competency, FR-204) → Approval & Publish (locks rubric, FR-205).
- **Required components:** `steps` stepper component, editable extracted-field list (FR-201: "user can edit every extracted field before approval" — the UI must never silently accept AI-suggested fields), weight inputs with live-sum validation, chip inputs for outcomes.
- **Unsaved-changes guard:** mandatory — this is a multi-step form with AI pre-fill; navigating away must warn (§2 gap).
- **Validation:** block "Submit for Approval" unless weights sum to 100% and every mandatory competency has ≥1 evidence anchor (FR-202).
- **Post-lock behavior:** once screening starts, rubric is read-only; changes require a new version (FR-205) — UI must visibly distinguish "Draft," "Approved v3.2," and "Locked" states.
- **Edge case:** AI role-quality-score panel (seen in prototype) is acceptable to keep as an assistive sidebar, but it must never auto-apply suggestions — "Apply suggestions" remains a explicit human action.

### 6.4 Candidate Review Queue `[P0]` (FR-701)
- **Purpose:** Prioritized, filterable list for recruiter triage.
- **Required components:** table with filters (status, confidence, review-flag), pagination (design for 5,000 candidates/role per §9 scalability NFR — virtualized table, not full client-side load), bulk-select checkbox row.
- **Empty state:** distinguishes "no candidates ingested yet" vs. "all candidates reviewed" (different CTAs).
- **Edge case:** candidates flagged for validation (date-overlap, claim mismatch per prototype's screening table) must visually differ from clean pass, using `pill-tag-soft` amber/red — never collapsed into the same "score."

### 6.5 Candidate 360° Profile / Evidence Viewer `[P0]` (FR-305)
- **Purpose:** Show criterion-level relevance, evidence strength, and confidence as **three distinct fields** — this is the CLAUDE.md hard constraint.
- **Required components:** per-criterion row showing `score`, `evidenceStrength`, `confidence` (from `lib/types/evaluation.ts`) side-by-side, never merged; `missingEvidence`/`contradictions` rendered as always-visible list items, not tooltips (CLAUDE.md explicit rule).
- **Edge case:** when evidence is missing, the UI must show "Missing evidence" as a first-class state, not a blank/zero score (FR-303: "unsupported conclusions are blocked or labelled missing").

### 6.6 Interview Plan Builder `[P0]` (FR-401–406)
- **Purpose:** Approve AI-generated common + candidate-specific questions before an interview can be launched.
- **Required components:** question list grouped by type (common competency / resume-validation / scenario), each question tagged with its **source claim** (FR-402: "every question shows its source claim and purpose") and an approve/reject/lock control (FR-404).
- **Validation gate:** "Approve interview plan" disabled until every mandatory competency has coverage (acceptance signal, FR-401).
- **Edge case:** question-quality check failures (ambiguity, bias risk, duplication — FR-406) surface inline per question, not as a silent auto-filter.

### 6.7 Candidate Invitation → Consent → Device Check → Live Interview `[P0]` (FR-501–508, §6 spec)
This is the single most constrained flow in the product — see full flow diagram in §7.2.
- **Invitation page:** branded, discloses AI-led + recorded/transcribed nature, expected duration, accommodation route (FR-502).
- **Consent screen:** interview **cannot start** until consent is recorded (hard gate, FR-502).
- **Device check:** mic/network pre-check; must complete without recruiter assistance on all supported browsers (FR-501).
- **Live interview:** shows visible progress, question N of M, and exposes candidate controls: repeat, clarify, pause (§6.5 safeguards). Must **never** display a face/emotion overlay or any inferred trait — CLAUDE.md/FR-508 hard prohibition.
- **Failure recovery:** on transient network/provider failure, session resumes from a safe checkpoint; **the candidate's score must never be silently lowered** by a technical failure (PRD §4 "brand-preservation rule," FR-505). This must be a visible, distinct UI state ("We're reconnecting you — this will not affect your evaluation"), not a generic spinner.
- **Completion:** confirmation + privacy notice + channel to report a technical/fairness concern (FR-802/§8.3 candidate appeal workflow) — see §10 AI-recommended screen 33.

### 6.8 Candidate Evaluation Report `[P0]` (FR-601–606)
- **Purpose:** Present the evidence-linked, non-final recommendation.
- **Required components:** per-competency `score` + `evidenceStrength` + `confidence` (same pattern as 6.5, reused, per design system consistency), contradiction list with neutral, non-accusatory language (FR-603: "flag language is neutral and requests human verification" — literally a copy-writing constraint the FE must honor), and the recommendation field rendered as `Strong Review | Review | Further Assessment | Insufficient Data` **never** as "Hire"/"Reject" (FR-604, CLAUDE.md hard rule).
- **Version transparency:** model/prompt/rubric version visible on the report (FR-606) — small but mandatory metadata row.
- **Edge case:** "second-pass grounding" may block a report from publishing (FR-605) — the UI must show a "report pending policy check" state distinct from normal processing.

### 6.9 Finalist Comparison Matrix + Human Decision Recorder `[P0]` (FR-701–705)
- **Purpose:** Side-by-side evidence comparison ending in a mandatory, rationale-backed human decision.
- **Required components:** comparison grid (criteria × candidates), AI decision-support panel kept visually and structurally separate from the "Human Decision" panel (FR-705: "keep AI recommendation and human decision as separate fields" — must be two distinct UI regions, not a combined widget).
- **Validation:** "Record Decision" disabled until a rationale is entered if tenant policy requires it (FR-704 "optional/required rationale based on policy").
- **Edge case:** decision controls checklist (bias review passed, no protected attributes shown, override rationale required) must block submission on any failed item, mirroring the prototype's Decision Controls card — this maps cleanly onto FR-604/§8.3 policy checks.

### 6.10 Governance Centre — Audit Timeline `[P0]` (FR-801)
- **Purpose:** Immutable, searchable event log across role/model/interview/evaluation/human actions.
- **Required components:** filterable table, before→after diff column, export-to-CSV (FR-806 — export must exclude hidden chain-of-thought/system prompts, a real constraint on what the export button is allowed to include).
- **Edge case:** events from AI actions must show model/prompt version inline (FR-606 pairs with FR-801).

### 6.11 Retention & Deletion Console `[P0]` (FR-802/803)
- **Purpose:** Configure tenant retention policy; process candidate data access/correction/deletion requests with tracked evidence of completion.
- **Required components:** policy-by-data-category table, request tracker with status (received → in progress → completed, with evidence link).
- **Edge case:** legal-hold exceptions must be visibly distinct from normal deletion schedule (Technical Roadmap §8.2 "Deletion").

### 6.12 Users & Roles (RBAC Admin) `[P0]` — gap-filled
- **Purpose:** Assign least-privilege roles per FR-102/104.
- **Required components:** user table with role/scope/PII-visibility columns (pattern lifted directly from the prototype's Access Control table, which is compatible with MVP RBAC scope), invite modal.
- **Edge case:** removing a user's role must immediately reflect in their candidate-visibility scope — no stale-permission window.

### 6.13 Access Denied / 404 / 500 `[P0/P1]` — gap-filled
- **Purpose:** Generic, on-brand fallback states using `design.md` tokens (not framework defaults).
- **403 (Access Denied):** explains *why* (role-scope, not "error"), offers a path back to an accessible page — never a dead end.
- **404 / 500:** minimal, on-brand, with a support contact link (ties to Help/Support, §screen 51).

### 6.14 Session Expired `[P0]` — gap-filled
- **Purpose:** Given interview-review sessions can run long, an expired session must preserve in-progress work where possible (e.g., a role-wizard draft) and redirect to Login with a clear "your session expired" message, not a silent redirect that loses context.

*(P1/P2 screens — Forgot/Reset Password, MFA Challenge, Role Version History, Duplicate Resolution, Bulk Screening progress, Transcript Playback, Decision History, Model/Prompt Registry, Fairness Monitoring, Evidence Pack Export, Tenant Settings, Security Settings, Profile, Notification Center, Help/Support, Onboarding, Maintenance banner — each inherits its state/component pattern from the nearest P0 sibling listed above; component and edge-case detail should be filled in during high-fidelity design using the same template.)*

---

## 7. Complete User Flows

### 7.1 Recruiter core loop (happy path + alternates)

```
Login → Workspace Home → Create Role (wizard) → Approve Rubric
   → Ingest Candidates (CSV/API) → Review Resume Evidence
   → Approve Interview Plan → Invite Candidates
   → [wait for candidate completion] → Review Evaluation Report
   → Finalist Comparison → Record Human Decision → Audit entry created
```

- **Alternative path — validation exception:** Resume evidence shows a claim mismatch → recruiter opens Evidence Viewer → drafts clarification request → candidate re-contacted outside this FE (email/manual) → status held at "Clarify" until resolved (mirrors prototype's screening-table "Clarify" pill).
- **Permission path:** Hiring Manager attempts to invite a candidate directly → Access Denied (6.13) with explanation that invitation is a Recruiter action; HM is redirected to the read-only Candidate Intelligence view.
- **Failure path:** Resume parse fails file-quality check (FR-301) → candidate enters "manual-review state," never silently dropped.
- **Error recovery:** Bulk screening job partially fails → per-candidate status shown (not an all-or-nothing failure banner).
- **Cancel flow:** Role wizard — "Save Draft" always available; closing without saving triggers the unsaved-changes guard (6.3).
- **Back navigation:** Wizard steps are back-navigable without losing entered data; rubric fields already approved become read-only once locked (FR-205).
- **Refresh:** Mid-review-queue refresh must preserve applied filters (URL-state, not just component state).
- **Timeout / session expired:** See 6.14 — in-progress wizard draft is recoverable after re-login.
- **Multi-user conflict:** Two reviewers open the same candidate simultaneously → last-write-wins is unacceptable for a decision record; edits must be attributed and timestamped (FR-703) and a "someone else is reviewing this" indicator is recommended (see §10).

### 7.2 Candidate interview flow (happy path + failure/recovery)

```
Open invitation link → Read disclosure → Give consent
   → Device/mic/network check [pass] → Live interview (Q1..Qn)
   → Completion & privacy notice
```

- **Alternative — accessibility/support route:** Candidate requests human alternative at any point (FR-507) → routed to a support/reschedule state, not silently scored as a non-response.
- **Failure path — network drop:** Mid-interview disconnect → "reconnecting" interstitial (6.7) → session resumes from checkpoint → if unrecoverable, routes to reschedule, with explicit non-penalty messaging (brand-preservation rule).
- **Failure path — unclear speech:** Low-confidence transcript segment flagged for reviewer, never auto-scored down (FR-506, §6.5).
- **Prompt-injection attempt:** Candidate tries to instruct the AI interviewer to reveal system prompts / change scoring — interviewer politely declines and continues per policy (§6.3 runtime policy) — from a UI perspective this must look like a graceful redirect, not an error.
- **Post-completion — appeal path:** Candidate reports a technical or fairness concern (screen 33, §10) → creates a governance review-queue item, does not alter the score directly.

---

## 8. Dependency Graph (Design Order)

Mapped 1:1 to the PRD's already-approved 12-week roadmap (not reinvented) so design and engineering stay in lockstep:

```
Week 1  Foundation:        Login, Access Denied/404/500, tenant threat-model inputs
   ↓
Week 2  Role Context:      Role List → Create Role wizard (all 4 steps) → Role Detail
   ↓
Week 3  Resume Evidence:   Candidate ingest → Review Queue → Evidence Viewer
   ↓
Week 4  Recruiter Alpha:   Workspace Home / Action Inbox ties Role+Evidence together;
                            Audit Timeline stub; Role Version History
   ↓
Week 5  Interview Design:  Interview Plan Builder → Question Quality Review → Approval
   ↓
Week 6  Voice Runtime:     Invitation → Consent → Device Check → Live Interview (basic)
   ↓
Week 7  Voice Evaluation:  Network-failure recovery states; Evaluation Report; Evidence/
                            Contradiction drill-down
   ↓
Week 8  Recruiter Beta:    Finalist Comparison Matrix, Human Decision Recorder,
                            Decision History, Model/Prompt Registry
   ↓
Week 9  Enterprise Controls: Users & Roles (RBAC), Security Settings, Retention &
                            Deletion Console, Session Expired
   ↓
Week 10 Quality Hardening: Accessibility pass (all screens), empty/error states audit,
                            Fairness Monitoring
   ↓
Week 11 Design-Partner Readiness: Onboarding, Help/Support, Tenant Settings/Branding,
                            Notification Center
   ↓
Week 12 Pilot Launch:      Evidence Pack Export, final polish, Maintenance banner
```

**Why this order:** Role Context must exist before Resume Evidence has anything to score against; Resume Evidence must exist before Interview Design can reference "resume-validation questions" (FR-402); the Voice runtime must be reliable before Evaluation can be trusted; Decision Workspace depends on Evaluation reports existing; Governance/Admin harden the perimeter last because they gate the pilot, not the demo loop.

---

## 9. Prioritization (P0–P3)

- **P0 — Pilot-gate-blocking** (PRD §14 Launch Acceptance Criteria maps directly to these): Login, Workspace Home, full Role Context Studio, Candidate Review Queue + Evidence Viewer, Interview Plan Builder, the entire candidate interview flow (invitation→consent→device check→live→recovery→completion), Evaluation Report, Finalist Comparison + Human Decision Recorder, Audit Timeline, Retention & Deletion Console, Users & Roles, Access Denied/Session Expired. *Rationale: PRD §14 explicitly requires "a recruiter can create a role, approve a scorecard, ingest candidates, invite interviews and produce an explainable shortlist end to end" plus security/audit/human-control gates — every P0 screen above is load-bearing for that sentence.*
- **P1 — Pilot-quality** (needed for the 100–250 candidate pilot to run smoothly but not literally blocking the first demo): Forgot/Reset Password, MFA, Role Version History, Duplicate Resolution, Bulk Screening, Transcript Playback, Decision History, Model/Prompt Registry, Fairness Monitoring, Evidence Pack Export, 404/500 pages, candidate appeal screen.
- **P2 — Post-pilot polish** (PRD §15 "Next 3 months" trigger: two paying customers / strong procurement pipeline): Onboarding tour, Personal Profile, Notification Center, Help/Support, Maintenance banner, Tenant Settings/Branding refinement.
- **P3 — Do not design yet** (PRD §15 "Avoid until validated"): Autonomous rejection UI, any emotion/personality/accent inference display, full ATS replacement screens, broad social-data enrichment UI, native multi-ATS integration management beyond the single prioritized integration. **These are intentionally excluded from this plan** — designing them now would contradict the PRD's explicit risk mitigation ("maintain decision-support position... not autonomous rejection," §13).

---

## 10. AI-Recommended Additions

Marked **AI Recommended** — inferred as necessary for an enterprise product of this class, not present in the PRD or prototype:

1. **AI Recommended — Onboarding tour for first tenant login.** *Why:* the PRD assumes a design-partner workshop gets recruiters comfortable with the tool (roadmap Week 11 "training"), but the product itself has no in-app equivalent; without it, a self-serve or second-wave tenant has no ramp.
2. **AI Recommended — Candidate post-interview appeal/concern screen (§screen 33).** *Why:* PRD §8.3 mandates a "candidate appeal workflow enabled" and §6.5 mandates a channel to "report a technical or fairness concern," but neither document specifies the actual UI — without it, the requirement is unimplementable.
3. **AI Recommended — "Someone else is reviewing this candidate" concurrency indicator.** *Why:* Decision Workspace and Candidate Intelligence are explicitly multi-reviewer (FR-703 "reviewer assignment," panel + hiring-manager both touch the same record) but no conflict-avoidance UI is specified; without it, two people can silently overwrite each other's notes.
4. **AI Recommended — Explicit "processing" status distinct from "empty" everywhere latency targets exist.** *Why:* §9 NFR defines concrete latencies (60s resume, 5min evaluation) that are long enough for a user to mistake "still processing" for "nothing here" — a generic empty state would misrepresent system state.
5. **AI Recommended — Degraded/offline banner for the candidate interview app.** *Why:* FR-505 requires recovery from network failure, but a candidate on a poor connection needs an upfront quality-check warning *before* starting, not only recovery *during* — reduces mid-interview drop-off, directly serving the ">=70% completion" pilot threshold.
6. **AI Recommended — Session-expired draft recovery for the Role Context wizard.** *Why:* the wizard is multi-step and AI-assisted (time-consuming to redo); without draft recovery across a 30-minute session timeout, hiring managers will abandon rubric creation, undermining the "approve a rubric in under 30 minutes" JTBD (PRD §2).
7. **AI Recommended — Minimal in-app notification bell for SLA-approaching items.** *Why:* Action Inbox (6.2) is pull-based; without any push signal, recruiters may miss the 4-hour interview-review SLA implied by the review-queue design, even though full workflow automation (reminders/escalations) is correctly deferred to Phase 2.

---

## 11. Final Master Design Plan (Consolidated Blueprint)

**Build this, in this order, for the 12-week MVP:**

1. **Foundation (Wk1):** Auth shell (Login, Session Expired, Access Denied, 404/500) + design-system component library wired to `design.md` tokens.
2. **Role Context Studio (Wk2):** Full 4-step wizard with unsaved-changes guard, weight validation, version locking.
3. **Candidate Intelligence (Wk3–4):** Ingestion, review queue (virtualized, filterable, paginated for 5,000-scale), Evidence Viewer with the mandatory score/evidenceStrength/confidence triad, Workspace Home Action Inbox tying it together.
4. **Interview Design Studio (Wk5):** Plan builder with source-claim-linked questions, quality-check surfacing, approval lock.
5. **Candidate Interview App (Wk6–7):** Invitation → consent → device check → live interview → recovery → completion, built to the strictest constraint set in the whole product (no biometric UI, ever; failure never silently penalizes).
6. **Evaluation & Decision (Wk7–8):** Evaluation Report, Finalist Comparison, Human Decision Recorder with AI/human fields kept structurally separate.
7. **Governance & Admin (Wk9):** RBAC, Retention/Deletion console, Audit Timeline, Security settings.
8. **Hardening (Wk10):** Full accessibility pass, empty/error/loading state audit across all P0/P1 screens, fairness monitoring dashboard.
9. **Pilot readiness (Wk11–12):** Onboarding, Help/Support, Notification bell, Evidence Pack Export, Tenant branding, Maintenance banner — then launch to 3–5 roles / 100–250 candidates per PRD pilot boundaries.

**Guardrails that apply to every screen without exception (from CLAUDE.md + PRD, restated once for the whole build):**
- Never collapse `score` + `evidenceStrength` + `confidence` into one number.
- Never render `missingEvidence`/`contradictions` behind a tooltip — always visible.
- Never build a UI affordance implying facial/emotional/accent/personality analysis exists.
- Never render the AI `recommendation` as a final hire/reject decision — it is one of `strong_review | review | further_assessment | insufficient_data`, always visually and structurally separate from the human decision field.
- Never let a technical failure (network, transcription) silently lower a candidate's score.

**Explicitly not building in this cycle (revisit only when a PRD §15 trigger fires):** Agentic sourcing, Talent CRM/Kanban, Workflow Automation builder, multi-ATS integration hub, full analytics suite, autonomous rejection, any biometric/emotion inference, native mobile apps.
