# Uncooked Portal — Project Testing Reference

**Generated:** 2026-07-09  
**Stack:** Next.js 16.2.9 (App Router) + React 19.2.4 + Prisma 5.11 + NextAuth 4.24 + Resend 6.17 + Pusher + Tailwind CSS v4  
**Package manager:** npm  
**Node target:** Win32 (PowerShell shell)  
**Database:** PostgreSQL (schema); SQLite dev.db used by seed only (inconsistency — see note below)

---

## 1. Environment Setup

### Required `.env` keys (from code references)

| Key | Purpose | Notes |
|-----|---------|-------|
| `DATABASE_URL` | Prisma PostgreSQL connection | Used by `prisma/schema.prisma:13` |
| `DIRECT_URL` | Prisma direct connection | Used by `prisma/schema.prisma:14` |
| `NEXTAUTH_URL` | NextAuth base URL | e.g., `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth JWT secret | Required |
| `GOOGLE_CLIENT_ID` | Google OAuth | Falls back to `"mock-client-id"` if missing |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | Falls back to `"mock-client-secret"` if missing |
| `RESEND_API_KEY` | Email sending via Resend | If missing, contact + apply routes return simulated success |
| `PUSHER_APP_ID` | Real-time chat | Required for chat to function |
| `PUSHER_SECRET` | Real-time chat | Required for chat to function |
| `NEXT_PUBLIC_PUSHER_KEY` | Real-time chat (client) | Required for chat to function |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Real-time chat (client) | Required for chat to function |
| `WATCHPACK_POLLING` | Dev server file watching | Webpack/Watchpack |

### Quick start

```bash
npm install
npm run dev
# App runs on http://localhost:3000
```

### Seed database (if needed)

```bash
npx prisma db seed
# Note: seed.js hardcodes SQLite (file:../dev.db), but schema expects PostgreSQL.
# Seed will fail if DATABASE_URL points to Postgres and dev.db doesn't exist.
```

---

## 2. All Routes & Pages

### Public Pages

| Route | File | Component | Description |
|-------|------|-----------|-------------|
| `/` | `app/page.jsx:15` | `Home` | Hero, metrics, event matrix preview, feature grid, builder network, bulletin feed, dashboard preview, opportunities preview, partners, CTA, review section. |
| `/about` | `app/about/page.jsx:8` | `AboutPage` | About Uncooked / UnfusedZ, team section. |
| `/login` | `app/login/page.jsx:9` | `LoginPage` | Mock email+password login + Google OAuth. Redirects to `/dashboard`. |
| `/signup` | `app/signup/page.jsx:9` | `SignupPage` | Registration form (name, email, password, DOB). Calls `/api/users/onboarding`. Redirects to `/onboarding`. |
| `/onboarding` | `app/onboarding/page.jsx:17` | `OnboardingPage` | 20 interest categories multi-select. Saves via `/api/users/onboarding`. Redirects to `/event`. |
| `/event` | `app/event/page.jsx:10` | `EventPage` | Event explorer with search, category/zone filters, TwinLayout detail view, RecommendedEvents. Force-dynamic. |
| `/contact` | `app/contact/page.jsx:5` | `ContactPage` | Contact form (name, email, role, message) → `/api/contact`. |
| `/opportunities` | `app/opportunities/page.jsx:5` | `OpportunitiesPage` | Wraps `OpportunitiesBoard` with search/type filters. |
| `/profile` | `app/profile/page.jsx:32` | `ProfilePage` | Student profile console: avatar, rank/XP, editable fields, interests, bio. |
| `/dashboard` | `app/dashboard/page.jsx:55` | `DashboardPage` | Attending events (ongoing/upcoming/past) + hosted events. Ticket modals, announcements, history modal. |

### Organizer Dashboard Routes

| Route | File | Component | Description |
|-------|------|-----------|-------------|
| `/dashboard/organizer/new` | `app/dashboard/organizer/new/page.jsx:34` | `HostEventForm` | Create/edit event form. |
| `/dashboard/organizer/[eventId]` | `app/dashboard/organizer/[eventId]/page.jsx:25` | `OrganizerOverviewPage` | Stats overview + recent activities. |
| `/dashboard/organizer/[eventId]/content` | `app/dashboard/organizer/[eventId]/content/page.jsx:9` | `ContentEditorPage` | Markdown editor + banner ImageCropper. |
| `/dashboard/organizer/[eventId]/attendees` | `app/dashboard/organizer/[eventId]/attendees/page.jsx:8` | `AttendeesPage` | Attendee table, CSV export, check-in, cancel. |
| `/dashboard/organizer/[eventId]/analytics` | `app/dashboard/organizer/[eventId]/analytics/page.jsx:11` | `AnalyticsPage` | Recharts: timeline, funnel, pie, revenue charts. |
| `/dashboard/organizer/[eventId]/announcements` | `app/dashboard/organizer/[eventId]/announcements/page.jsx:6` | `AnnouncementsPage` | Bulletin board with create/pin/delete. |
| `/dashboard/organizer/[eventId]/settings` | `app/dashboard/organizer/[eventId]/settings/page.jsx:8` | `SettingsPage` | Capacity, waitlist, managers, lifecycle (complete/archive/delete). |

---

## 3. All API Routes

| Route | File | Methods | Description |
|-------|------|---------|-------------|
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.js` | GET, POST | Google OAuth. JWT sessions (2hr). |
| `/api/events` | `app/api/events/route.js` | GET, POST | List events; create event (no auth). |
| `/api/events/[id]` | `app/api/events/[id]/route.js` | PUT, DELETE | Update/delete event. |
| `/api/events/[id]/analytics` | `app/api/events/[id]/analytics/route.js` | GET | EventAnalytic logs. |
| `/api/events/[id]/announcements` | `app/api/events/[id]/announcements/route.js` | GET, POST | Bulletin updates. |
| `/api/events/[id]/bulletins` | `app/api/events/[id]/bulletins/route.js` | POST | Create bulletin update. |
| `/api/events/[id]/complete` | `app/api/events/[id]/complete/route.js` | POST | Mark event Completed. |
| `/api/events/[id]/content` | `app/api/events/[id]/content/route.js` | PUT | Update description, schedule, venue, banner. |
| `/api/events/[id]/dashboard` | `app/api/events/[id]/dashboard/route.js` | GET | Organizer stats aggregate. |
| `/api/events/[id]/registrations` | `app/api/events/[id]/registrations/route.js` | GET, PUT | List registrations; approve/reject/check-in. |
| `/api/events/[id]/settings` | `app/api/events/[id]/settings/route.js` | PUT, DELETE | Update capacity/waitlist; delete event. |
| `/api/events/interact` | `app/api/events/interact/route.js` | POST | Record VIEW/SAVE/REGISTER. |
| `/api/organizer/[eventId]/overview` | `app/api/organizer/[eventId]/overview/route.js` | GET | Organizer overview stats. |
| `/api/registrations` | `app/api/registrations/route.js` | GET, POST | List/create registrations. |
| `/api/registrations/[id]` | `app/api/registrations/[id]/route.js` | DELETE | Delete registration. |
| `/api/registrations/[id]/checkin` | `app/api/registrations/[id]/checkin/route.js` | PUT | Check-in / undo check-in. |
| `/api/users/onboarding` | `app/api/users/onboarding/route.js` | POST | Upsert user interests. |
| `/api/users/profile` | `app/api/users/profile/route.js` | GET, POST | Fetch/upsert user profile. |
| `/api/recommendations` | `app/api/recommendations/route.js` | GET | Recommended events by email. |
| `/api/reviews` | `app/api/reviews/route.js` | GET, POST | List/create reviews. |
| `/api/chat` | `app/api/chat/route.js` | POST, GET, DELETE | Chat messages (Pusher). |
| `/api/contact` | `app/api/contact/route.js` | POST | Contact form → Resend email. |
| `/api/opportunities/apply` | `app/api/opportunities/apply/route.js` | POST | Resume upload → Resend email with attachment. |

---

## 4. All Components

### `app/components/layout/`

| File | Component | Description |
|------|-----------|-------------|
| `Navbar.jsx` | `Navbar` | Fixed top nav. Logo, links, hamburger, auth dropdown, profile menu. |
| `Footer.jsx` | `Footer` | Site footer. Hidden on `/opportunities`. |
| `TwinLayout.jsx` | `TwinLayout` | Two-column event detail: banner+description left, registration/chat/bulletin right. |
| `SplashScreen.jsx` | `SplashScreen` | Animated splash (~3.3s) with SVG web mesh pulse. |

### `app/components/dashboard/`

| File | Component | Description |
|------|-----------|-------------|
| `DashboardHeader.jsx` | `DashboardHeader` | Username, attending/hosted counts, rank progress bar, rank guide modal. |
| `CommandCenter.jsx` | `CommandCenter` | Tabbed event categories + search. Event cards with register CTAs. |
| `RegistrationDatabase.jsx` | `RegistrationDatabase` | Expandable localStorage-backed registration table. |
| `SessionMonitor.jsx` | `SessionMonitor` | Fixed session-expiry warning (5m/1m). "Stay Signed In" button. |

### `app/components/home/`

| File | Component | Description |
|------|-----------|-------------|
| `Hero.jsx` | `Hero` | Animated gradient headline, CTAs, floating stats card. |
| `Metrics.jsx` | `Metrics` | 4-column animated stat cards (CountUp). |
| `EventMatrixPreview.jsx` | `EventMatrixPreview` | Searchable/filterable event grid with registration modal. |
| `FeatureGrid.jsx` | `FeatureGrid` | 2x2 platform feature showcase. |
| `BuilderNetwork.jsx` | `BuilderNetwork` | Animated ecosystem map (6 majors → Campus Students hub). |
| `BulletinFeed.jsx` | `BulletinFeed` | Simulated scrolling live bulletin feed. |
| `DashboardPreview.jsx` | `DashboardPreview` | Static mockup of student console. |
| `OpportunitiesPreview.jsx` | `OpportunitiesPreview` | Static preview of opportunities board. |
| `Partners.jsx` | `Partners` | 6-column partner logos with grayscale hover. |
| `CTA.jsx` | `CTA` | Final call-to-action section. |
| `ReviewSection.jsx` | `ReviewSection` | Horizontal scrollable reviews + submission form. |

### `app/components/explorer/`

| File | Component | Description |
|------|-----------|-------------|
| `EventsExplorer.jsx` | `EventsExplorer` | Event search/category/zone filters, animated card grid, host event button. |
| `OpportunitiesBoard.jsx` | `OpportunitiesBoard` | Opportunity search/type filters, animated cards, apply modal trigger. |
| `OpportunityApplicationModal.jsx` | `OpportunityApplicationModal` | Application form (name, email, phone, role, resume upload, message) → `/api/opportunities/apply`. |

### `app/components/event/`

| File | Component | Description |
|------|-----------|-------------|
| `EventDescription.jsx` | `EventDescription` | Markdown description, organizer info, venue + Google Maps, tags. |
| `EventChat.jsx` | `EventChat` | Real-time Pusher chat. Locked for non-registrants. Emoji picker, unsend. |
| `BulletinBoard.jsx` | `BulletinBoard` | Organizer bulletin board + broadcast composer + conversion modal. |
| `RecommendedEvents.jsx` | `RecommendedEvents` | Horizontal scrollable recommended events. Save/view/register interactions. |
| `RegisterModal.jsx` | `RegisterModal` | Registration/payment modal (decorative card fields, no real payment). |
| `RegistrationCard.jsx` | `RegistrationCard` | Ticket status, QR, countdown, download, add to calendar, cancel/waitlist. |
| `TicketModal.jsx` | `TicketModal` | Ticket visualization with QR. Download as PNG via `html-to-image`. React portal. |

### `app/components/ui/`

| File | Component | Description |
|------|-----------|-------------|
| `ImageCropper.jsx` | `ImageCropper` | Image upload + crop (`react-easy-crop`). Returns base64 data URL. |
| `TrustSignals.jsx` | `TrustSignals` | Trusted-by logos strip. |
| `Testimonials.jsx` | `Testimonials` | 3-column testimonial cards. |
| `TeamSection.jsx` | `TeamSection` | 5-column team member cards. |
| `ProcessFlow.jsx` | `ProcessFlow` | 5-step horizontal/vertical pipeline. |
| `MobileMockup.jsx` | `MobileMockup` | CSS-only smartphone mockup. |
| `CountUp.jsx` | `CountUp` | Animated counter (`framer-motion` + `useInView`). |
| `ConversionModal.jsx` | `ConversionModal` | App install prompt with QR placeholder. |

---

## 5. Layout & Context

### Layout Chain
- `app/layout.jsx` → `NextAuthProvider` → `UserProvider` → `SessionMonitor` → `Navbar` + `<main>{children}</main>` + `Footer`
- `app/dashboard/organizer/[eventId]/layout.jsx` → Sidebar nav (Overview, Attendees, Announcements, Settings). Auth guard redirects to `/dashboard` if no user.

### Context Providers
| File | Provider | Exports | Purpose |
|------|----------|---------|---------|
| `app/context/NextAuthProvider.jsx` | `NextAuthProvider` | — | `SessionProvider` wrapper. Refetch interval 5 min, window focus refetch. |
| `app/context/UserContext.jsx` | `UserProvider` | `useUser()` | Local + NextAuth session sync. `login/signup/logout` helpers. Auto-redirect to `/onboarding` if incomplete. localStorage fallback sessions. |

---

## 6. Prisma Data Model

### Models (17 total)

| Model | Key Fields | Relations |
|-------|------------|-----------|
| `User` | id, role (default "User"), email (unique), passwordHash, interests (JSON), preferenceScore, onboardingCompleted | → Registration, UserActivity, Event (organizer), EventManager, Account, Session |
| `Event` | title, type, category, tags (JSON), keywords (JSON), popularityScore, date, location, zone, city (default "Lucknow"), state, country, description, schedule (Markdown), prizePool (Markdown), bannerUrl, ticketType (default "Free"), price, capacity, waitlistEnabled, archived, status | ← User (organizer), → Registration, BulletinUpdate, UserActivity, TicketTier, Coupon, EventAnalytic, EventManager, EventActivityLog |
| `TicketTier` | eventId, name, price, capacity, soldCount, description | → Event, Registration |
| `Coupon` | eventId, code, discountPct, maxUses, currentUses | → Event, Registration |
| `Registration` | userId, eventId, ticketTierId, couponId, status (default "Pending"), checkInStatus, teamName, track, registeredAt | → User, Event, TicketTier, Coupon, RegistrationLog |
| `BulletinUpdate` | eventId, title, content, postedAt | → Event |
| `UserActivity` | userId, eventId, interactionType (VIEW/SAVE/REGISTER), timestamp | → User, Event |
| `EventAnalytic` | eventId, date, views, uniqueVisitors, registrations, attendance, revenue | → Event |
| `EventManager` | eventId, userId, role (default "Admin"), addedAt | → Event, User |
| `RegistrationLog` | registrationId, action, oldStatus, newStatus, timestamp, performedBy | → Registration |
| `EventActivityLog` | eventId, action, details, performedBy, timestamp | → Event |
| `ChatMessage` | eventId, userName, userEmail, message, createdAt | Standalone (no FKs) |
| `Review` | userName, userEmail, rating, comment, createdAt | Standalone |
| `Account` | userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state | → User (NextAuth) |
| `Session` | sessionToken (unique), userId, expires | → User (NextAuth) |
| `VerificationToken` | identifier, token (unique), expires | Standalone (standard NextAuth, unused) |

### Seed Data
- **1 demo user:** `demo@campus.edu`, role `Organizer`, interests `["AI & Machine Learning", "Programming"]`
- **6 mock events:** upserted with `organizerId` = demo user

---

## 7. Key Business Logic

### Event Recommendation Engine (`lib/recommendations.js`)
- Weighted scoring: Interest Match 40%, Tag Similarity 25%, Previous Engagement 20%, Popularity 15%
- Falls back to `mockEvents` if DB returns empty
- Incomplete onboarding → sorts by `popularityScore` + `date`
- Returns top 10 events with `recommendationScore` and `recommendationReason`

### Event Interactions (`app/api/events/interact/route.js`)
- `VIEW` / `SAVE` / `REGISTER` interactions create `UserActivity` records
- `REGISTER` also creates a `Registration`

### Chat (`app/api/chat/route.js`)
- Requires registration for event
- Blocks hosts (`event.isHost` or `organizerId/email === user`)
- Supports unsend (delete own messages)
- Pusher broadcast on POST

### Registration (`app/api/registrations/route.js`)
- GET enforces ownership/manager auth check (event-scoped) or email lookup
- POST auto-creates event from `mockEvents` if missing, auto-creates user — **no auth on POST**

---

## 8. UI / Styling Conventions

### Framework
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- Custom theme in `app/globals.css` using CSS `@theme` variables
- Dark theme: backgrounds `#000000` / `surface-0` through `surface-3`, foreground `#F8F8F8`
- Accent colors: `#A855F7` (purple), `#C084FC` (lavender)

### Custom Classes (`globals.css`)
| Class | Purpose |
|-------|---------|
| `.card` | Black card with border, shadow, hover lift |
| `.btn-primary` | Purple accent pill button |
| `.btn-secondary` | Dark surface neutral border button |
| `.input` | Dark input with purple focus ring |
| `.section-label` | Uppercase muted small label |
| `.no-scrollbar` | Hide scrollbar |
| `.animate-fadeIn` | Opacity 0→1 |
| `.animate-slideUp` | Opacity 0 + translateY 8px → 0 |

### Modal Pattern (no library)
- Root `div` with `fixed inset-0 z-50 flex items-center justify-center`
- Backdrop `div` with `absolute inset-0 bg-black/80 backdrop-blur-sm` + `onClick={onClose}`
- Content `div` with `bg-[#0a0a0a] rounded-xl border border-zinc-800 shadow-2xl`
- Used by: `RegisterModal`, `TicketModal`, `ConversionModal`, inline rank modals

### Icons
- `lucide-react` (20+ components used)

### Animations
- `framer-motion` for cards, counters, page transitions
- CSS keyframes for `fadeIn`, `slideUp`

### Path Aliases
- `jsconfig.json`: `"@/*"` → `["./*"]`

---

## 9. Testing Entry Points

### What to smoke-test first

| Priority | Route | What to verify |
|----------|-------|----------------|
| P0 | `/login` | Mock login (any email + password ≥4 chars) → redirects to `/dashboard`. Google OAuth button present. |
| P0 | `/signup` | Form validation, redirect to `/onboarding`. Google sign-up button. |
| P0 | `/onboarding` | Interest selection, submit → redirects to `/event`. |
| P0 | `/event` | Event list loads, search/filter works, click event → TwinLayout detail. |
| P0 | `/contact` | Form submits → Resend email (or simulated success). |
| P1 | `/opportunities` | Board renders cards, search/filter works, "Apply Now" opens modal. |
| P1 | `/opportunities` → Apply modal | Form validation, resume upload (PDF/DOC/DOCX, ≤5MB), submit → `/api/opportunities/apply`. |
| P1 | `/dashboard` | Attending events load, hosted events load, ticket modals open, announcements work. |
| P1 | `/dashboard/organizer/new` | Event creation form submits. |
| P2 | `/dashboard/organizer/[eventId]/analytics` | Charts render with data. |
| P2 | `/profile` | Profile loads, edit/save works, rank/XP displays. |

### What NOT to test (known issues / out of scope)

| Item | Reason |
|------|--------|
| Real payment processing | `RegisterModal` card fields are decorative only |
| Real Pusher chat | Requires `PUSHER_*` env vars + backend |
| Real Resend emails | Requires `RESEND_API_KEY`; otherwise simulated |
| Real Google OAuth | Requires valid `GOOGLE_CLIENT_ID`/`SECRET` |
| Database consistency | Seed uses SQLite but schema expects PostgreSQL |
| Route protection | No middleware; all auth is client-side |

---

## 10. Known Issues & Gotchas

1. **Dual auth systems:** NextAuth (Google/JWT) and mock localStorage sessions coexist. `login`/`signup` accept any input.
2. **No server-side auth:** Write APIs (`/api/events` POST, `/api/registrations` POST, `/api/users/*`) have no auth checks. Anyone can create events or register any email.
3. **Passwords are dummy:** `passwordHash: 'dummy'` in DB. Login is purely client-side simulation.
4. **Seed DB mismatch:** `prisma/seed.js` uses SQLite (`file:../dev.db`), but `schema.prisma` expects PostgreSQL via `DATABASE_URL`.
5. **Orphaned API:** `/api/opportunities/apply` exists and works but had no frontend caller until the planned `OpportunityApplicationModal` was added.
6. **No toast/notification framework:** Errors use `alert()` or inline banners. No centralized toast system.
7. **Resend sandbox:** Sender is `onboarding@resend.dev` (Resend test domain). Needs custom domain for production.
8. **Profile bio/team:** Persist only to `localStorage`, never to the database.
9. **`html2canvas` and `jspdf`:** Listed in dependencies but not imported anywhere in app code.
10. **`@next-auth/prisma-adapter`:** Listed but commented out; not used.

---

## 11. How to Run Tests

```bash
# Install
npm install

# Dev server
npm run dev

# Lint
npm run lint

# Prisma generate (after schema changes)
npx prisma generate

# Prisma migrate (if using Postgres)
npx prisma migrate dev

# Seed (if using SQLite dev.db)
npx prisma db seed
```

---

## 12. Quick Reference: File Tree

```
D:\CODESPACE\Uncooked\portal\
├── .env                        # Secrets (do not expose)
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .next/                      # Build output
├── .vercel/
├── .vscode/
├── app/
│   ├── actions/                # Empty — no server actions
│   ├── api/
│   │   ├── auth/[...nextauth]/route.js
│   │   ├── chat/route.js
│   │   ├── contact/route.js
│   │   ├── events/route.js + [id]/
│   │   │   ├── [id]/analytics/route.js
│   │   │   ├── [id]/announcements/route.js
│   │   │   ├── [id]/bulletins/route.js
│   │   │   ├── [id]/complete/route.js
│   │   │   ├── [id]/content/route.js
│   │   │   ├── [id]/dashboard/route.js
│   │   │   ├── [id]/registrations/route.js
│   │   │   ├── [id]/settings/route.js
│   │   └── events/interact/route.js
│   │   ├── organizer/[eventId]/overview/route.js
│   │   ├── recommendations/route.js
│   │   ├── registrations/route.js + [id]/ + [id]/checkin/
│   │   ├── reviews/route.js
│   │   ├── users/onboarding/route.js + profile/route.js
│   │   └── opportunities/apply/route.js
│   ├── components/
│   │   ├── dashboard/ (CommandCenter, DashboardHeader, RegistrationDatabase, SessionMonitor)
│   │   ├── event/     (BulletinBoard, EventChat, EventDescription, RecommendedEvents, RegisterModal, RegistrationCard, TicketModal)
│   │   ├── explorer/  (EventsExplorer, OpportunitiesBoard, OpportunityApplicationModal)
│   │   ├── home/      (BuilderNetwork, BulletinFeed, CTA, DashboardPreview, EventMatrixPreview, FeatureGrid, Hero, Metrics, OpportunitiesPreview, Partners, ReviewSection)
│   │   ├── layout/    (Footer, Navbar, SplashScreen, TwinLayout)
│   │   └── ui/        (ConversionModal, CountUp, ImageCropper, MobileMockup, ProcessFlow, TeamSection, Testimonials, TrustSignals)
│   ├── config/cities.js
│   ├── contact/page.jsx
│   ├── context/ (NextAuthProvider, UserContext)
│   ├── dashboard/page.jsx + organizer/[eventId]/...
│   ├── event/page.jsx
│   ├── login/page.jsx
│   ├── onboarding/page.jsx
│   ├── opportunities/page.jsx
│   ├── profile/page.jsx
│   ├── signup/page.jsx
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── lib/
│   ├── cropImage.js
│   ├── mockData.js
│   ├── prisma.js
│   ├── recommendations.js
│   └── generated/prisma/...
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── public/
│   └── logo.png
├── next.config.js
├── package.json
├── postcss.config.mjs
├── jsconfig.json
├── netlify.toml
├── README.md
└── User_Manual.md
```
