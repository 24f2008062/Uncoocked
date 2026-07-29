# Uncooked Portal 🚀

<p align="center">
  <em>The Zero-Noise Operating System for Student Events & Campus Ecosystems.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFF?style=flat&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
</p>

**Uncooked Portal** is a full-stack platform that lets campus organizers host, manage, and analyze events — and gives attendees a fast, noise-free way to discover events, register, and carry digital tickets in their pocket.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔐 Environment Variables](#-environment-variables)
- [🧩 How It Works](#-how-it-works)
- [⚠️ Important Notes](#️-important-notes)
- [🤝 Contributing](#-contributing)

---

## 🌐 Overview

Uncooked is built as a single Next.js (App Router) application. The same framework powers the public discovery experience, the authenticated organizer dashboards, and the JSON API that backs them — so there is no separate frontend/backend to keep in sync.

Two ideas drive the product:

1. **Discovery without noise** — a personalized recommendation engine ranks events by *relevance* (your interests + past engagement), not just popularity.
2. **Operator-grade tooling** — organizers get analytics, attendee management, live announcements, and ticket generation in one place.

---

## ✨ Features

### 🎟️ For Attendees
- **Event Discovery** — browse upcoming campus events (Hackathons, Fests, Workshops, Meetups) with live search, category, and zone filters.
- **Seamless Registration** — reserve free tickets or buy paid tickets in a couple of taps.
- **Digital Tickets** — download beautifully formatted, high-resolution **PNG tickets with scannable QR codes** for fast check-in (`html-to-image`).
- **Personalized Recommendations** — the engine matches events to your onboarding interests and the events you've viewed, saved, or registered for.
- **Real-Time Bulletins** — live announcements and schedule changes pushed by organizers (Pusher).
- **Waitlisting** — automatically join a waitlist when an event hits capacity.
- **Local Accounts** — sign up and sign in with **email & password** (NextAuth Credentials, passwords hashed with `scrypt`).

### 🎛️ For Organizers
- **Event Dashboard** — a command center to manage every aspect of your hosted events.
- **Analytics & Insights** — track revenue, registrations, and page views through interactive charts (Recharts).
- **Attendee Management** — see who's coming, manage waitlists, and record check-ins.
- **Live Announcements** — broadcast real-time updates and pinned messages straight to the public event page.
- **Image Cropper** — built-in interactive cropping tool for uploading the perfect event banner.

### 🧱 Platform
- **Onboarding** — interest selection that personalizes the entire feed.
- **Route Protection** — `/dashboard`, `/profile`, and `/onboarding` are gated by middleware; unauthenticated visitors are redirected to sign-in.
- **Graceful Fallbacks** — a curated set of **mock events** keeps the experience populated even before real events exist, and powers the recommendation fallback.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (hosted on Supabase) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) — Credentials (email & password) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Real-Time** | [Pusher](https://pusher.com/) (live chat & bulletins) |
| **Ticket Generation** | `html-to-image` (PNG + QR) |
| **Email** | [Resend](https://resend.com/) (contact / notifications) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Structure

```
portal/
├── app/
│   ├── api/                  # Route handlers (JSON API)
│   │   ├── auth/              # NextAuth handler + local register
│   │   ├── events/           # List / create events
│   │   ├── registrations/    # Register, check-in, waitlist
│   │   ├── recommendations/  # Personalized event feed
│   │   ├── users/            # Profile + onboarding upserts
│   │   ├── organizer/        # Organizer console data
│   │   ├── chat/             # Real-time event chat (Pusher)
│   │   ├── contact/          # Resend contact form
│   │   ├── reviews/          # Attendee reviews
│   │   └── opportunities/    # Opportunity applications
│   ├── components/          # UI (layout, explorer, event, dashboard…)
│   ├── context/            # UserContext + NextAuthProvider
│   ├── login/ signup/      # Local authentication pages
│   ├── onboarding/         # Interest personalization
│   ├── dashboard/ profile/ # Authenticated areas (middleware-gated)
│   ├── event/ opportunities/ contact/ about/
│   ├── layout.jsx
│   └── page.jsx
├── lib/
│   ├── prisma.js           # Shared Prisma client singleton
│   ├── recommendations.js  # Recommendation scoring engine
│   ├── mockData.js         # Canonical mock events (UI + seed source)
│   ├── email.js            # Resend helpers
│   └── …
├── prisma/
│   ├── schema.prisma      # Data model
│   └── seed.js            # Seeds canonical mock events
├── public/  architecture/  .env  next.config.js  package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- A PostgreSQL database (e.g. a free [Supabase](https://supabase.com/) project)
- (Optional) a [Resend](https://resend.com/) API key for email, and [Pusher](https://pusher.com/) keys for real-time features

### 1. Install Dependencies
```bash
npm install
```
> `postinstall` automatically runs `prisma generate`.

### 2. Configure Environment Variables
Copy `.env` and fill in your values (see [Environment Variables](#-environment-variables)). The database connection and auth secret are required; the others light up optional features.

### 3. Set Up the Database
Push the Prisma schema to your PostgreSQL database and seed the sample events:
```bash
npx prisma db push
npx prisma db seed
```

### 4. Start the Development Server
```bash
npm run dev
```
The portal will be available at [http://localhost:3000](http://localhost:3000).

### 5. Inspect the Database (Optional)
Launch Prisma Studio to browse and edit records visually:
```bash
npx prisma studio
```
It opens at `http://localhost:5555`.

---

## 🔐 Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `DIRECT_URL` | ✅ | Direct (non-pooled) connection for Prisma migrations |
| `NEXTAUTH_SECRET` | ✅ | Signs NextAuth session tokens |
| `NEXTAUTH_URL` | ✅ | Public app URL (used in production) |
| `RESEND_API_KEY` | ⚠️ | Sends contact-form / notification emails |
| `PUSHER_APP_ID` | ⚠️ | Real-time chat & bulletins |
| `NEXT_PUBLIC_PUSHER_KEY` | ⚠️ | Public Pusher key (client) |
| `PUSHER_SECRET` | ⚠️ | Server Pusher secret |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | ⚠️ | Pusher cluster |

---

## 🧩 How It Works

### Authentication (local)
Accounts are created via `/api/auth/register` (email + password, hashed with Node's `crypto.scrypt`). Sign-in uses a NextAuth **Credentials** provider that verifies the hash against the `User` row. Authenticated sessions unlock the gated routes through `middleware.js`.

### Recommendation Engine (`lib/recommendations.js`)
Each candidate event is scored across four weighted signals:

| Signal | Weight | What it captures |
| --- | --- | --- |
| Interest Match | 40% | Category/type, tags, keywords, and free-text match your onboarding interests |
| Tag Similarity | 25% | Overlap with events you've interacted with |
| Previous Engagement | 20% | Saved / registered / viewed tags |
| Popularity | 15% | Tiebreaker only — **never** a reason to recommend |

Events with **no relevance signal** are filtered out, so the feed shows what's actually *for you* rather than everything. Users who haven't onboarded yet see a "Trending" fallback instead.

### Mock Events (`lib/mockData.js`)
`lib/mockData.js` is the **single canonical source** for the sample events — used by both the UI (explorer, dashboard, recommendations) and the database seed (`prisma/seed.js`), so the two never drift apart. The API merges live database events with the mock fallback, deduping by `id`.

---

## ⚠️ Important Notes

- **Currency** — the platform is natively configured for **Indian Rupees (₹)**.
- **Location Constraints** — the current MVP is scoped to operate in **Lucknow** (zoned neighborhoods are Lucknow-specific).
- **Database** — the app targets **PostgreSQL** (Supabase). Run `prisma db push` / `prisma studio` against your hosted database rather than a local file.
- **Secrets** — never commit `.env`. `NEXTAUTH_SECRET` and the database credentials must stay server-side.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

<p align="center">
  <sub>Built with Next.js, Prisma & a lot of campus energy. 💜</sub>
</p>
