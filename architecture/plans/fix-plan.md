# Uncooked Portal — Fix / Remediation Plan

**Source:** `architecture/plans/project-testing-reference.md` (Section 10: Known Issues & Gotchas)  
**Generated:** 2026-07-09  
**Scope:** Defects, security gaps, data-integrity bugs, and production-readiness gaps identified during codebase audit.

---

## Priority Legend

| Priority | Meaning |
|----------|---------|
| **P0 — Critical** | Security hole or data-loss; fix before any deployment |
| **P1 — High** | Breaks correctness in prod or blocks real usage |
| **P2 — Medium** | Tech debt, UX, or hygiene; fix when convenient |
| **P3 — Low** | Cosmetic / cleanup |

---

## P0 — Critical

### F1. No server-side route protection (auth bypass)
**Problem:** All access control is client-side (`if (!user)` guards + context redirects). Write APIs have no server auth, so any client (or `curl`) can create events, register arbitrary emails, upsert users, post bulletins, etc.

**Affected:**
- `app/api/events/route.js` (POST create event — `organizerId` is a raw email, no verification)
- `app/api/registrations/route.js` (POST create registration — no auth)
- `app/api/users/onboarding/route.js` (POST — no auth)
- `app/api/users/profile/route.js` (POST — no auth)
- `app/api/organizer/[eventId]/overview/route.js` and all `/api/events/[id]/*` write routes

**Fix:**
1. Add `middleware.js` at project root using `getToken({ req, secret: process.env.NEXTAUTH_SECRET })` to guard `/dashboard/*`, `/profile`, and write API routes.
2. In each write handler, derive the acting user from the JWT (`req.nextauth.token.sub`) instead of trusting a client-supplied email.
3. For organizer-scoped writes, verify the user is the event organizer (`Event.organizerId`) or listed in `EventManager` before allowing PUT/DELETE/POST on `/api/events/[id]/*`.

---

### F2. Dummy passwords + simulated login
**Problem:** `app/api/users/onboarding/route.js:28` stores `passwordHash: 'dummy'`. `login`/`signup` in `UserContext` (`:58-71`) perform no credential check — any email/password logs in. Combined with F1, this is a full auth bypass.

**Fix:**
1. Decide auth model: **(a)** Google-only (recommended — remove mock login entirely) or **(b)** credentials with `bcrypt` + real `passwordHash`.
2. If (a): remove mock `login`/`signup` localStorage paths from `app/context/UserContext.jsx`; make `/login` and `/signup` Google-only. Remove the "any mock email/password" note.
3. If (b): hash passwords on signup, verify on login via a real credential provider in `app/api/auth/[...nextauth]/route.js`.

---

## P1 — High

### F3. Prisma seed uses SQLite, schema expects PostgreSQL
**Problem:** `prisma/seed.js:1-4` hardcodes `datasourceUrl: "file:../dev.db"`, but `schema.prisma:10-16` uses `provider = "postgresql"` with `DATABASE_URL`/`DIRECT_URL`. Seed will fail or write to a DB the app never reads.

**Fix:**
- Either remove the hardcoded `datasourceUrl` from `seed.js` (let it use `DATABASE_URL`), or — if SQLite is intended for local dev — change `schema.prisma` provider to `sqlite` and drop `DIRECT_URL`. Pick one and make seed + schema agree.

### F4. Profile bio/team never persisted server-side
**Problem:** `app/profile/page.jsx:108,172` stores `bio` and `team` only in `localStorage["profile_${user}"]`. `app/api/users/profile/route.js` has no fields for them, so they are lost across devices/sessions.

**Fix:**
1. Add `bio String?` and `team String?` (or a JSON field) to the `User` model in `schema.prisma`.
2. Extend `GET`/`POST` in `app/api/users/profile/route.js` to read/write these fields.
3. Stop relying on `localStorage` for these fields in `app/profile/page.jsx`.

### F5. Resend sender on sandbox domain
**Problem:** `app/api/contact/route.js:18` and `app/api/opportunities/apply/route.js` send from `onboarding@resend.dev` (Resend test domain). Test domains cannot deliver to arbitrary recipients reliably and will be rejected in production.

**Fix:**
1. Verify a real sending domain in the Resend dashboard.
2. Centralize the `from` address in one helper (e.g., `lib/resend.js`) and update both routes + `.env`/`README` docs to use it.

### F6. Contact form: unescaped user input into HTML email
**Problem:** `app/api/contact/route.js:21-29` interpolates `name`/`email`/`message` directly into an HTML string with no sanitization. Low risk (single admin recipient) but a bad pattern to copy to the new apply route.

**Fix:**
- Sanitize/escape inputs (or use Resend React/`@react-email` templates) before interpolation. Apply the same helper to `/api/opportunities/apply`.

---

## P2 — Medium

### F7. Orphaned API endpoint
**Problem:** `app/api/opportunities/apply/route.js` works but previously had no frontend caller. `OpportunityApplicationModal` now posts to it, so this is partially resolved — but it is missing `export const runtime = "nodejs"` guard (Resend + `Buffer` require Node, not Edge) and has no server-side auth (anyone can POST applications).

**Fix:**
- Add `export const runtime = "nodejs"` to the route.
- Add a lightweight rate limit / bot check (e.g., honeypot field or CAPTCHA) since it is an unauthenticated public endpoint.

### F8. No centralized notification/toast system
**Problem:** ~15+ `alert()` calls across dashboard, organizer pages, TwinLayout, EventChat, ReviewSection, etc. Inconsistent UX; alerts are blocking.

**Fix:**
- Add one lightweight toast provider (e.g., `sonner` — small, no UI lib needed) and replace `alert()` calls. Keep inline success banners where already present.

### F9. NextAuth fails open on DB error
**Problem:** `app/api/auth/[...nextauth]/route.js:61` returns `true` even when the Prisma user lookup throws; `app/api/users/onboarding/route.js:61` also fails open.

**Fix:**
- On DB error, return `false` (deny) rather than proceeding. Log the error and surface a clean failure to the user.

---

## P3 — Low

### F10. Unused dependencies
**Problem:** `jspdf`, `html2canvas`, `@next-auth/prisma-adapter` are in `package.json` but never imported in app code; `@opengsd/gsd-core` is CLI tooling, not production.

**Fix:**
- Remove `jspdf`, `html2canvas`, `@next-auth/prisma-adapter` from `dependencies` if not used.
- If keeping credentials auth (F2), re-enable the adapter properly; otherwise delete its import.

### F11. Dual auth state in `UserContext`
**Problem:** NextAuth session and mock localStorage session run in parallel, causing redirect flicker and ambiguity about which identity is authoritative.

**Fix:**
- After F2 resolves the auth model, collapse `UserContext` to a single source of truth (NextAuth session preferred; drop localStorage session entirely).

### F12. `next.config.js` rewrites proxy to Flask backend
**Problem:** `next.config.js:14-23` proxies `/api/:path*` → `http://127.0.0.1:5000/api/:path*` with `fallback`. If no Flask server is running, any `/api/*` call not also defined in `app/api/` resolves to a connection-refused error.

**Fix:**
- Mark Next.js API routes as `destination` so they take precedence, or remove the proxy if the Flask backend is deprecated.

---

## Suggested Execution Order

| Step | Items | Why |
|------|-------|-----|
| 1 | F1, F2 | Block all deployment until auth is real |
| 2 | F3 | Make seed + runtime DB consistent |
| 3 | F4, F5, F6 | Data correctness + email deliverability |
| 4 | F7, F8, F9 | Close remaining public-endpoint and UX gaps |
| 5 | F10, F11, F12 | Hygiene/cleanup |

---

## Verification After Fixes

1. `npm run build` succeeds with new `middleware.js`.
2. `curl -X POST /api/events` (no token) returns 401/403, not 200.
3. `npx prisma db seed` writes to the same DB the app reads.
4. Profile bio/team survive a logout→login in a different browser.
5. Test emails arrive from the verified domain, not `onboarding@resend.dev`.
6. No `alert()` remains in `app/**` (grep check).
