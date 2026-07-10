# Fix Report — Mock Events, Dashboard Auth, & Recommendations

**Date:** 2026-07-10
**Scope:** `portal` (Next.js + Prisma event portal)
**Summary:** Three related regressions were fixed so the app behaves per its own plan/README (canonical mock data drives the UI, dashboard stays accessible, recommendations fallback to mock events).

---

## 1. Missing Mock Events

**Symptom:** No mock events visible anywhere (explorer, dashboard, recommendations fallback).

**Root cause:** `lib/mockData.js` had its `mockEvents` array emptied and `mergeWithMockEvents` had its mock-merge loop stripped during a prior cleanup. This contradicted the plan, which defines `mockData.js` as the single canonical source for both the UI and `prisma/seed.js` (README:197, plans:219).

**Fix:**
- `lib/mockData.js` — restored the 6 canonical mock events and the `mergeWithMockEvents` loop (DB events take precedence, mocks fill the gaps, deduped by `id`).
- `prisma/seed.js` — restored the seed that upserts the same mock events (organizer = `demo@campus.edu`), per the plan's single-source pattern.

**Impact:** Mock events now appear via the UI fallback immediately; `npx prisma db seed` also persists them.

---

## 2. Dashboard Rendered as a Sign-In Page

**Symptom:** Visiting `/dashboard` showed an "Access Denied / Sign In" wall instead of the dashboard.

**Root cause:** An auth refactor removed the local `user_session` fallback from `UserContext`. With no NextAuth session, `useUser()` returned `null`, and `app/dashboard/page.jsx:239` renders the sign-in gate whenever `user` is null. `app/components/home/EventMatrixPreview.jsx` still reads/writes `user_session`, expecting the old fallback.

**Fix:** `app/context/UserContext.jsx` — restored the local `user_session` fallback (when present, reuse it) and default to the `demo@campus.edu` demo user when unauthenticated, so the dashboard renders on first visit. Also restored the `login`/`signup` exports for call-site compatibility.

**Note:** This intentionally re-enables the demo/local session that the security refactor removed. If real auth should gate the dashboard later, that is a separate task.

---

## 3. Recommendations Section Missing on Events Page

**Symptom:** The "Recommended For You" section was absent from `/event`.

**Root cause:** `RecommendedEvents` returns `null` when the API returns zero items (`app/components/event/RecommendedEvents.jsx:84`). `getRecommendedEvents` (`lib/recommendations.js`) queried the database only and never implemented the plan's documented fallback ("Falls back to `mockEvents` if DB returns empty" — architecture/plans/project-testing-reference.md:227). With no seeded rows it returned `[]`, collapsing the section.

**Fix:** `lib/recommendations.js` — when the DB has no events, build the candidate list from the canonical `mockEvents` (normalized to the engine's shape: `tags`/`keywords` as JSON strings, `date` from `dateISO`). The engine then scores/falls back to trending as designed.

**Impact:** Combined with fix #2 (so `user` is truthy and the section is even rendered at `app/event/page.jsx:170`), the recommendation strip now populates from mock events until real events exist.

---

## Files Changed
- `lib/recommendations.js` — **(uncommitted)** added mock-events fallback
- `lib/mockData.js` — restored canonical mock events + merge loop _(committed in d9b51e6)_
- `prisma/seed.js` — restored mock-event seed _(committed in d9b51e6)_
- `app/context/UserContext.jsx` — restored local/demo session fallback _(committed in 8bba178)_

## Verification
- `node --check` passed on `lib/mockData.js` and `prisma/seed.js`.
- `eslint` ran clean on all four changed files (only an unrelated `.eslintignore` deprecation warning).
- Behavior verified against plan/README expectations; live UI/DB not executed in this session.
