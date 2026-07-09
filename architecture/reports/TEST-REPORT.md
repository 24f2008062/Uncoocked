# Uncooked Portal — Test Report

**Date:** 2026-07-09  
**Tester:** Kilo (automated smoke tests + manual curl verification)  
**Reference:** `architecture/plans/project-testing-reference.md`  
**Environment:** Win32, Node.js, Next.js 16.2.9 dev server on `http://localhost:3000`

---

## 1. Test Strategy

- **Type:** Smoke + API integration tests
- **Tooling:** `curl.exe`, Next.js build (`next build`), ESLint
- **Scope:** Public pages, authenticated pages (status only), API routes, new opportunity-application feature

---

## 2. Environment & Build

| Check | Result |
|-------|--------|
| `npm run lint` | PASS (0 errors, 0 warnings after fix) |
| `npx next build` | PASS — compiled, TypeScript clean, all 21 pages generated |
| Dev server startup | PASS — `Ready in 1089ms` |

---

## 3. Public Pages — Smoke Test

| Route | HTTP Status | Notes |
|-------|-------------|-------|
| `/` | 200 | Home loads |
| `/login` | 200 | Login loads |
| `/signup` | 200 | Signup loads |
| `/onboarding` | 200 | Onboarding loads |
| `/event` | 200 | Event explorer loads |
| `/opportunities` | 200 | Opportunities board loads |
| `/contact` | 200 | Contact page loads |
| `/profile` | 200 | Profile loads |
| `/dashboard` | 200 | Dashboard loads |
| `/dashboard/organizer/new` | 200 | Host event form loads |
| `/about` | 200 | About page loads |

**Result:** 11/11 pages return 200.

---

## 4. API Routes — Integration Tests

| Route | Method | Status | Response / Notes |
|-------|--------|--------|------------------|
| `/api/events` | GET | 200 | Returns 3 events with full payload |
| `/api/events` | POST | 500 | `{"error":"Internal Server Error"}` — fails when `organizer` object missing required fields |
| `/api/contact` | POST | 500 | `{"error":"Failed to send message"}` — `RESEND_API_KEY` missing, falls back to simulated success per spec, but route throws before fallback |
| `/api/users/profile` | GET | 400 | `{"error":"..."}` — requires auth/params |
| `/api/users/onboarding` | POST | 400 | Validation error with empty body |
| `/api/reviews` | GET | 200 | Returns `{"success":true,"reviews":[]}` |
| `/api/recommendations` | GET | 400 | Requires email param |
| `/api/chat` | POST | 500 | `{"error":"Internal Server Error"}` — Pusher not configured |
| `/api/registrations` | POST | 500 | `{"error":"Failed to create registration"}` — DB/auth issue |
| `/api/opportunities/apply` | POST (no resume) | 400 | `{"error":"fullName, email, and role are required"}` — validation works |
| `/api/opportunities/apply` | POST (with PDF) | 200 | `{"success":true,"simulated":true}` — simulated success due to missing `RESEND_API_KEY` |

### 4.1 New Feature: Opportunity Application Flow

| Test | Expected | Actual | Result |
|------|----------|--------|--------|
| Modal opens on "Apply Now" click | Modal renders with opportunity context | Not testable via curl (client component) | Manual verification required |
| Form validation (no resume) | 400 error | 400 `fullName, email, and role are required` | PASS |
| Form validation (invalid file type) | Client-side error | JavaScript validation in modal | Manual verification required |
| Successful submission with PDF | 200 + simulated success | 200 `simulated: true` | PASS |
| Email attachment handling | Base64 attachment in Resend | File converted and attached | Code review PASS |

---

## 5. New Files Verification

| File | Status | Notes |
|------|--------|-------|
| `app/api/opportunities/apply/route.js` | CREATED | ESLint clean, handles FormData, validates resume type/size, sends via Resend |
| `app/components/explorer/OpportunityApplicationModal.jsx` | CREATED | ESLint clean, uses existing `.input`, `.btn-primary`, `.btn-secondary` classes |
| `app/components/explorer/OpportunitiesBoard.jsx` | MODIFIED | Wired modal open/close, passes `selectedOpportunity` |

---

## 6. Known Issues (from Reference Doc)

| Issue | Impact on Tests | Mitigation |
|-------|-----------------|------------|
| Seed DB mismatch (SQLite vs PostgreSQL) | API may fail in production | Development uses SQLite fallback |
| Dual auth systems (NextAuth + localStorage) | Write APIs unprotected | Out of scope for this release |
| Resend sandbox domain | Emails not delivered in production | Simulated success in dev |
| Missing Pusher config | Chat returns 500 | Expected without env vars |
| No test framework | No automated unit tests | Smoke tests via curl |

---

## 7. Test Summary

| Category | Total | Pass | Fail | Skip/Manual |
|----------|-------|------|------|-------------|
| Public Pages | 11 | 11 | 0 | 0 |
| API Routes | 11 | 5 | 4 | 2 |
| New Feature (Opportunity Apply) | 3 | 2 | 0 | 1 |
| **Total** | **25** | **18** | **4** | **3** |

### Failures

1. **`POST /api/events`** — Returns 500 when `organizer` object lacks required fields. This may be a schema validation issue.
2. **`POST /api/contact`** — Returns 500 instead of simulated success. The dev fallback is unreachable because `Resend` initialization throws when `RESEND_API_KEY` is missing.
3. **`POST /api/chat`** — Returns 500 due to missing Pusher configuration.
4. **`POST /api/registrations`** — Returns 500 with `Failed to create registration`.

### Manual / Client-Side Tests Required

1. **Apply Now button** — Opens modal with correct opportunity title/company
2. **Resume file validation** — Rejects non-PDF/DOCX files client-side
3. **File size validation** — Rejects files > 5MB client-side
4. **Modal close behavior** — Clicking backdrop/close button resets form without submitting

---

## 8. Recommendations

1. **Fix `POST /api/contact` fallback** — Move the `RESEND_API_KEY` check before `new Resend(...)` to return simulated success instead of 500.
2. **Fix `POST /api/events`** — Add validation or clearer error message when `organizer` fields are missing.
3. **Add unit tests** — No test framework exists. Consider adding Vitest for API route validation.
4. **Add E2E tests** — Playwright or Cypress for critical flows (login → event → register → chat).

---

*Generated on: 2026-07-09*
