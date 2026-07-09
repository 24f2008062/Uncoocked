# Opportunity Application Feature — Implementation Plan

## Overview
When a user clicks an opportunity card, a modal opens for them to submit basic details + resume. The submission is emailed via Resend to the same inbox used by the contact form (`unfusedz.admin@gmail.com`).

---

## Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `app/components/explorer/OpportunityApplicationModal.jsx` | Modal UI for opportunity application form + resume upload |
| 2 | `app/api/opportunities/apply/route.js` | API route to receive FormData, validate, send email via Resend |

---

## Files to Modify

| # | File | Change |
|---|------|--------|
| 1 | `app/components/explorer/OpportunitiesBoard.jsx` | Add `open`, `onClose`, `selectedOpportunity` state; wire "Apply Now" button to open modal; render `<OpportunityApplicationModal>` |
| 2 | `app/api/contact/route.js` | No changes needed — reuse same Resend pattern and recipient |

---

## Step-by-Step Implementation

### 1. `OpportunityApplicationModal.jsx`
- **Props:** `open`, `onClose`, `opportunity` (the clicked opportunity object with `title`, `company`, `type`, `location`, etc.)
- **Form fields:**
  - `fullName` (text, required)
  - `email` (email, required)
  - `phone` (tel, optional)
  - `role` (select: Student / Sponsor / Host / Other — same options as contact form)
  - `message` (textarea, optional)
  - `resume` (file input, accept `.pdf,.doc,.docx`, required, max ~5MB)
- **Resume handling:** Use native `<input type="file">` + `FormData`. No existing multipart upload pattern in this repo; implement client-side validation (type + size) before submit.
- **Submit flow:**
  - Build `FormData` with all fields + file
  - `fetch("/api/opportunities/apply", { method: "POST", body: formData })`
  - On success: show success state in modal, auto-close after 3s
  - On error: show error message inline (no `alert()`)
- **Modal styling:** Follow existing custom modal pattern (fixed inset-0, backdrop `bg-black/80 backdrop-blur-sm`, content `bg-[#0a0a0a] rounded-xl border border-zinc-800`). Use existing `.input` and `.btn-primary` classes from `globals.css`.

### 2. `app/api/opportunities/apply/route.js`
- **Method:** `POST` only
- **Parse:** Use `request.formData()` natively — no extra dependency needed.
- **Validate:**
  - `fullName`, `email`, `role` required
  - `resume` must be present, file size ≤ 5MB, type in `[application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document]`
  - Basic email format check
- **Email via Resend:**
  - Import `Resend` from `resend` (same as `/api/contact/route.js`)
  - `from`: same sender (`Uncooked Portal <onboarding@resend.dev>`)
  - `to`: same recipient (`unfusedz.admin@gmail.com`)
  - **Subject:** `New Opportunity Application — ${opportunityTitle}`
  - **HTML body:** Include user details (name, email, phone, role, message) + opportunity details (title, company, type, location)
  - **Resume attachment:** Use `resend.emails.send({ attachments: [{ filename: resume.name, content: base64Buffer }] })`
    - Convert uploaded file buffer to base64: `Buffer.from(await file.arrayBuffer()).toString('base64')`
- **Dev fallback:** If `RESEND_API_KEY` missing, return simulated success (same pattern as contact route).
- **Responses:**
  - 200: `{ success: true }`
  - 400: validation errors
  - 500: email send failure

### 3. `OpportunitiesBoard.jsx` changes
- Add `const [selectedOpportunity, setSelectedOpportunity] = useState(null)` and `const [isModalOpen, setIsModalOpen] = useState(false)`
- Wire "Apply Now" button: `onClick={() => { setSelectedOpportunity(opportunity); setIsModalOpen(true); }}`
- Add modal render:
  ```jsx
  {isModalOpen && selectedOpportunity && (
    <OpportunityApplicationModal
      open={isModalOpen}
      onClose={() => { setIsModalOpen(false); setSelectedOpportunity(null); }}
      opportunity={selectedOpportunity}
    />
  )}
  ```

---

## Edge Cases & Constraints
- **No server actions:** This app uses API routes, not Server Actions. Keep the new route in `app/api/`.
- **No form library:** Use native React state (`useState`) for form fields, same as the existing contact page.
- **File size:** Enforce 5MB limit client-side and server-side to avoid Resend attachment bloat.
- **Resend sandbox domain:** The current `from` uses `onboarding@resend.dev` (Resend test domain). If the project later moves to a custom domain, update the `from` address in both `/api/contact/route.js` and the new apply route together.
- **No database persistence:** This is email-only. If you later want to store applications, add a Prisma model, but it is out of scope for this plan.

---

## Verification Steps
1. Run `npm run dev` and navigate to `/opportunities`
2. Click "Apply Now" on any card → modal opens with opportunity context
3. Fill form, upload a PDF resume, submit → check `unfusedz.admin@gmail.com` for the email
4. Verify resume appears as an attachment in the received email
5. Submit without resume or required fields → inline validation errors appear
6. Click outside modal or close button → modal closes without submitting
