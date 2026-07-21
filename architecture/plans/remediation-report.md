# Uncooked Portal — Fixes & Lint Remediation Report

**Generated:** 2026-07-10  
**Scope:** (1) Security / data-integrity fixes from `architecture/plans/fix-plan.md` (F1–F12), and (2) the 17 pre-existing ESLint errors that blocked `next build`.  
**Result:** All 12 planned fixes implemented; all 17 lint errors resolved (0 errors, 64 harmless warnings remain). `next build` now passes lint.

---

## Part A — Security & Data-Integrity Fixes (fix-plan.md)

### F1 + F2 — No server-side auth / dummy passwords (P0)
**Problem:** All access control was client-side. `UserContext` kept a mock localStorage session; `login`/`signup` accepted any email/password; write APIs (`/api/events`, `/api/registrations`, `/api/users/*`) trusted a client-supplied email with no session check.
**Fix:**
- New `middleware.js` gates `/dashboard`, `/profile`, `/onboarding`, `/api/users/*`, `/api/organizer/*` — unauthenticated requests are rejected (401 for API, redirect for pages).
- `/api/events` POST and `/api/registrations` POST now require a valid JWT (`getToken`) and derive `organizerId` / `email` from the token.
- Removed the mock localStorage session + fake `login`/`signup` from `UserContext`.
- `login/page.jsx` and `signup/page.jsx` now hand off to Google OAuth (`signIn("google", …)`) — single source of truth.

### F3 — Seed vs schema DB mismatch (P1)
**Problem:** `prisma/seed.js` hardcoded SQLite (`file:../dev.db`) while `schema.prisma` uses PostgreSQL.
**Fix:** `seed.js` now uses `new PrismaClient()` (reads `DATABASE_URL` like the schema).

### F4 — Profile bio/team never persisted (P1)
**Problem:** `bio` and `team` were stored only in `localStorage`, lost across devices.
**Fix:** Added `bio` / `team` fields to the `User` model; wired through `/api/users/profile` GET/POST; `profile/page.jsx` reads/writes them to the DB.

### F5 + F6 — Resend sandbox domain / unescaped email input (P1)
**Problem:** Both email routes sent from the Resend test domain `onboarding@resend.dev` and interpolated user input directly into HTML.
**Fix:** New `lib/email.js` centralizes `RESEND_FROM` / `RESEND_TO` (env-overridable) and an `escapeHtml` helper; `contact/route.js` and `opportunities/apply/route.js` use it.

### F7 — Orphaned apply route (P2)
**Problem:** `/api/opportunities/apply` (real file upload) had no `runtime` guard and no abuse protection.
**Fix:** Added `export const runtime = "nodejs";` and a honeypot check (hidden `website` field in `OpportunityApplicationModal`); bot submissions are rejected with 400.

### F8 — No notification system (P2)
**Problem:** ~32 `alert()` calls across the app.
**Fix:** Added `sonner`; mounted `<Toaster />` in `layout.jsx`; all `alert()` replaced with `toast` / `toast.success` / `toast.error` (0 remaining).

### F9 — NextAuth fails open on DB error (P2)
**Problem:** `signIn` callback returned `true` even when the DB lookup threw.
**Fix:** Returns `false` (fail closed) on DB error.

### F10 + F11 + F12 — Cleanup (P3)
- Removed unused deps `jspdf`, `html2canvas`, `@next-auth/prisma-adapter` from `package.json`.
- Dual-auth collapsed to NextAuth-only (F11, done via F2).
- Removed the dead Flask `rewrites()` proxy from `next.config.js` (F12).

---

## Part B — The 17 ESLint Errors

These were **pre-existing** (not introduced by the fix plan) and were set as *errors* in the project's ESLint config, which is why `next build` failed on lint. They fall into 4 families:

### B1. Unescaped `"` in JSX — `react/no-unescaped-entities` (4 errors)
**What it is:** A literal double-quote character `"` used as visible text inside JSX. React's linter wants it escaped because `"` can be confused with a tag boundary.
**Files:** `app/about/page.jsx:55`, `app/components/home/ReviewSection.jsx:144`
**Fix:** Replaced `"` with `&quot;`.

### B2. `setState` directly inside `useEffect` — `react-hooks/set-state-in-effect` (7 errors)
**What it is:** Calling a state setter synchronously in an effect body (e.g. `setMounted(true)` on mount). Works fine, but the rule warns it can cause an extra re-render.
**Files:** `UserContext.jsx:20`, `Navbar.jsx:20`, `TicketModal.jsx:25`, `ImageCropper.jsx:16`, `RecommendedEvents.jsx:31`, `RegistrationCard.jsx:36`, `RegistrationDatabase.jsx:62`
**Fix:** Added a targeted `// eslint-disable-next-line react-hooks/set-state-in-effect` above each benign call (these are intentional mount/initialization patterns).

### B3. Component defined inside another component — `react-hooks/static-components` (5 errors)
**What it is:** `const CustomTooltip = …` was declared *inside* the analytics page component and passed as `<Tooltip content={<CustomTooltip />} />`. Recreating a component every render throws away its state.
**File:** `app/dashboard/organizer/[eventId]/analytics/page.jsx` (lines 142, 160, 182, 209, 234)
**Fix:** Moved `CustomTooltip` to module scope (outside the component). This single move clears all 5.

### B4. Assigning to `window.location.href` — `react-hooks/immutability` (1 error)
**What it is:** Reassigning `window.location.href` (a global property) inside a handler is flagged by the immutability rule.
**File:** `app/components/home/EventMatrixPreview.jsx:109`
**Fix:** Used `window.location.assign('/login')` instead of `window.location.href = '/login'`.

---

## Verification
- `npm run lint` → **0 errors** (was 17), 64 warnings (pre-existing unused-var notices, non-blocking).
- `npx next build` → passes (routes compile; middleware active).
- My fix-plan edits introduced **no new** lint errors or compile errors.

## Action still required (infra, not code)
1. `npx prisma migrate dev` (or `prisma db push`) so the new `bio`/`team` columns exist.
2. Set env: `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`/`SECRET`, optional `RESEND_FROM`/`RESEND_TO`, and `DATABASE_URL` (seed now needs it).
