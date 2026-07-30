# Host Verification & Event Hosting System - User Manual & Guide
**Version**: 1.0.0  
**Target Platform**: Uncooked Portal  
**Document Purpose**: Comprehensive operational manual and workflow guide for Event Organizers and Super Administrators.

---

## Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [User Roles & Permission Matrix](#2-user-roles--permission-matrix)
3. [Host Verification State Machine](#3-host-verification-state-machine)
4. [Organizer Workflow Guide](#4-organizer-workflow-guide)
   - [Applying for Host Verification](#applying-for-host-verification)
   - [Tracking Application Status](#tracking-application-status)
   - [Re-submitting Applications (Needs Info / Rejected)](#re-submitting-applications-needs-info--rejected)
   - [Hosting Events (Approved Organizers)](#hosting-events-approved-organizers)
5. [Super Admin Workflow Guide](#5-super-admin-workflow-guide)
   - [Accessing the Review Console](#accessing-the-review-console)
   - [Filtering & Searching Applications](#filtering--searching-applications)
   - [Executing Review Actions](#executing-review-actions)
   - [Audit Trail & Notifications](#audit-trail--notifications)
6. [Security & API Protection](#6-security--api-protection)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Overview & Purpose

The **Host Verification & Event Hosting System** is an enterprise-grade security and verification framework integrated into Uncooked Portal. It ensures that only verified campus event hosts, student clubs, and recognized organizations can publish events to the public Uncooked Event Matrix.

Every "Host Event" or "Host an Event" button across the platform acts as a gated entry point. Users are checked against their verification status before being granted access to event creation.

---

## 2. User Roles & Permission Matrix

| Role | Verification Status | Allowed Actions | Restricted Actions |
| :--- | :--- | :--- | :--- |
| **Standard User / Student** | `NOT_APPLIED` | Browse events, register, view digital tickets, submit host application | Cannot create or publish campus events |
| **Applicant Host** | `PENDING` / `UNDER_REVIEW` | Track application status, view admin feedback notes | Cannot create events; cannot submit duplicate application |
| **Needs Information Host** | `NEEDS_MORE_INFORMATION` | View reviewer notes, attach additional docs, re-submit application | Cannot create events until approved |
| **Approved Host** | `APPROVED` | Access Organizer Console (`/dashboard/organizer/new`), publish & edit events | Subject to administrative suspension |
| **Suspended Host** | `SUSPENDED` | View suspension notice, contact support | Blocked from event creation on UI and API level |
| **Super Admin** | Any / Admin Role | Full access to Super Admin Review Console (`/admin/host-verification`), approve/reject/suspend any user | N/A |

---

## 3. Host Verification State Machine

The verification status transitions through standard states:

```
[ NOT_APPLIED ]
       │
       ▼ (Submit Form)
  [ PENDING ] ──────► [ UNDER_REVIEW ]
       │                      │
       ├──────────────────────┼──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
[ NEEDS_MORE_INFO ]      [ APPROVED ]           [ REJECTED ]
       │                      │                      │
       ▼ (Re-submit)          ▼ (Admin Action)       ▼ (Re-apply)
  [ PENDING ]            [ SUSPENDED ]          [ PENDING ]
```

---

## 4. Organizer Workflow Guide

### Applying for Host Verification
1. Log in to your Uncooked account.
2. Click **Host Event** from the navigation explorer or your personal dashboard.
3. If you have not applied, you will automatically be directed to `/host-verification/apply`.
4. Fill out the application form:
   - **College / Organization Name** (Required): e.g. IIIT Lucknow, TechFest Org.
   - **Club / Department Name** (Optional): e.g. Coding Club, Cultural Team.
   - **Applicant Role / Designation** (Required): e.g. Event Lead, President.
   - **Planned Event Description** (Required): Summary of events you intend to host.
   - **Portfolio URL** (Optional): Link to previous event photos, website, or social media.
   - **Supporting Documents**: Attach official letterheads, IDs, or approval letters (up to 5MB per document).
5. Click **Submit Verification Application**.

### Tracking Application Status
- Navigate to `/host-verification/status` at any time or click **Host Event**.
- Your status dashboard displays:
  - Current status badge (`PENDING`, `UNDER_REVIEW`, `APPROVED`, etc.).
  - Detailed explanation of your current state.
  - Reviewer feedback notes provided by platform administrators.
  - Submission date timestamp.

### Re-submitting Applications (Needs Info / Rejected)
- If your status is set to `NEEDS_MORE_INFORMATION` or `REJECTED`:
1. Navigate to `/host-verification/status`.
2. Click **Re-submit Application** or **Re-apply for Host Status**.
3. Review reviewer feedback notes to see what details were requested.
4. Update missing fields or upload additional supporting documents.
5. Submit the form. Status resets to `PENDING` for administrative review.

### Hosting Events (Approved Organizers)
- Once status is set to `APPROVED`, clicking **Host Event** seamlessly routes you directly to the Organizer Event Creation Console (`/dashboard/organizer/new`).
- Fill out event parameters (Title, Date, Category, Location, Ticket Tiers, Capacity, Banner) and click **Publish & Host Event**.

---

## 5. Super Admin Workflow Guide

### Accessing the Review Console
1. Log in with an account having `Admin` role privileges.
2. Navigate to `/admin/host-verification`.

### Filtering & Searching Applications
- **Status Filter**: Click on status tags (`ALL`, `PENDING`, `UNDER_REVIEW`, `NEEDS_MORE_INFORMATION`, `APPROVED`, `REJECTED`, `SUSPENDED`) to filter the list.
- **Search Bar**: Type applicant name, email address, or organization name for real-time filtering.

### Executing Review Actions
For any application:
1. Click **Review & Update Status** to expand the review panel.
2. Inspect applicant details, planned event description, portfolio link, and attached documents.
3. Optionally enter **Reviewer Feedback / Reason Notes** in the text box.
4. Click one of the action buttons:
   - **Approve Application** (`APPROVED`): Grants immediate host permissions.
   - **Request More Information** (`NEEDS_MORE_INFORMATION`): Enables re-submission for the user.
   - **Reject Application** (`REJECTED`): Denies application with feedback.
   - **Suspend Privileges** (`SUSPENDED`): Revokes hosting privileges.
   - **Mark Under Review** (`UNDER_REVIEW`): Updates status to indicate active review.

### Audit Trail & Notifications
- Every status update automatically logs an immutable audit entry in `HostVerificationAuditLog`.
- The system automatically dispatches an HTML email notification to the applicant informing them of the decision and reviewer notes.

---

## 6. Security & API Protection

1. **Single Entry Point Routing (`useHostVerificationRedirect`)**:
   - Centralized hook queries `/api/host-verification/status` and enforces client-side routing.
2. **Backend API Protection (`POST /api/events`)**:
   - Server-side route verifies NextAuth JWT session and queries database to ensure caller has `HostVerification.status === 'APPROVED'`.
   - Direct HTTP POST requests by non-approved callers receive `HTTP 403 Forbidden`.
3. **Duplicate Submission Prevention**:
   - Applicants in `PENDING`, `UNDER_REVIEW`, or `APPROVED` states attempting duplicate POST submissions receive `HTTP 409 Conflict`.

---

## 7. Troubleshooting & FAQ

**Q: I clicked "Host Event" and was sent to a verification form instead of the creation page. Why?**  
A: To maintain platform security, all hosts must complete a one-time host verification application before publishing events.

**Q: How long does host verification review take?**  
A: Applications are typically reviewed by administrators within 24 to 48 hours.

**Q: Can a non-approved user create events by calling the API directly?**  
A: No. Backend route protection rejects unapproved requests with an HTTP 403 error.

**Q: Where can Super Admins view all pending verification requests?**  
A: In the Super Admin Review Console at [http://localhost:3000/admin/host-verification](http://localhost:3000/admin/host-verification).
