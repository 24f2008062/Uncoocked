# Uncooked Student Builder Portal - Project Blueprint

This blueprint outlines the visual identity, page routing structure, state management, and component architecture of the Uncooked portal web application.

---

## 🎨 Visual Identity & Theme

* **Color Palette**: Solid black backgrounds, glassmorphism headers, and glowing neon purple highlights (`#bf40ff` / `rgb(191, 64, 255)`).
* **Typography**: Modern typography with heavy font weights (e.g. `font-black`, `font-extrabold`) and custom text shadow classes (`neon-text-glow`).
* **Micro-interactions**: Scale transforms on hover, glowing borders, and fade-in animations on tab transitions.

---

## 📂 Page Routing & Files

The application uses Next.js App Router. Below is the file map corresponding to the public and protected routes:

### 1. Homepage (`/`) — [app/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/page.tsx)
* **Hero Block**: Focuses on value propositions for student builders with options to browse events or download the native app. Includes the interactive [MobileMockup.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/MobileMockup.tsx).
* **Trust Signals**: Logo/badge strip ([TrustSignals.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/TrustSignals.tsx)) representing active backing from top ecosystem organizations.
* **Features Matrix**: 3-column feature showcase (Zero-Noise Feeds, Instant Checkouts, Team Matchmaking) using high-contrast cards with purple glowing hover borders.

### 2. Events Explorer (`/event`) — [app/event/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/event/page.tsx)
* **Title Header & Search Bar**: Integrated side-by-side search field next to the "Event Matrix" heading.
* **Featured Active Events**: High-priority events rendered in compact grid cards (e.g., Hackathons and VC Sprints).
* **Virtual Details Router**: Selecting "View Details" mounts [TwinLayout.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/TwinLayout.tsx) in place. It offers markdown schedules, prize listings, bulletin boards ([BulletinBoard.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/BulletinBoard.tsx)), and registrations.
* **CommandCenter explorer**: Embeds [CommandCenter.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/CommandCenter.tsx) showing categories, counts, and items matching the query.

### 3. Opportunities Hub (`/opportunities`) — [app/opportunities/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/opportunities/page.tsx)
* **Workflow Timeline**: A horizontal step-by-step pipeline mapping the builder process ([ProcessFlow.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/ProcessFlow.tsx)).
* **Openings Dashboard**: Houses a sidebar-filtered list of fellowships, startup developer roles, and freelance gigs ([OpportunitiesSection.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/OpportunitiesSection.tsx)).

### 4. About & Mission (`/about`) — [app/about/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/about/page.tsx)
* **Core Metrics**: Numeric callouts showing builder statistics, prize distribution, and speed.
* **Student Reviews**: Star-rated feedback cards from previous builders ([Testimonials.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/Testimonials.tsx)).
* **Operations Team**: Profiles of the core team with direct LinkedIn URLs ([TeamSection.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/TeamSection.tsx)).

### 5. Contact Coordinator (`/contact`) — [app/contact/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/contact/page.tsx)
* **Contact Form**: Secure form allowing student builders to message operations coordinates directly.

### 6. Authentication (`/login`) — [app/login/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/login/page.tsx)
* **Dual-role selector**: A beautiful user interface that logs sessions in as either an `attendee` or an `organizer`.

### 7. Protected Panel (`/dashboard`) — [app/dashboard/page.tsx](file:///d:/CODESPACE/Uncooked/portal/app/dashboard/page.tsx)
* **Auth Guard**: Rejects access if the active session role is not `organizer` (displays a clean Access Denied prompt).
* **Registrations Database**: Lists coordinator statistics (total signups, active listings) and displays active student signups grouped under expandable/collapsible event cards.

---

## 🔄 Client State & LocalStorage Synchronization

1. **User Authentication Context**:
   * Managed by [UserContext.tsx](file:///d:/CODESPACE/Uncooked/portal/app/context/UserContext.tsx).
   * Stores user session email and user role (`attendee` | `organizer`).
   * State is persisted across page reloads via `localStorage` checks.
   * [Navbar.tsx](file:///d:/CODESPACE/Uncooked/portal/app/components/Navbar.tsx) dynamically renders the **Dashboard** link and profile options only for authorized roles.

2. **Roster Signups**:
   * Event signups are saved in `localStorage` under `registrations`, linking student details with the respective event IDs (e.g. `hackathon-2026`).
