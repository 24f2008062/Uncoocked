import { Resend } from "resend";

export const RESEND_FROM =
  process.env.RESEND_FROM || "Uncooked Portal <onboarding@resend.dev>";
export const RESEND_TO = process.env.RESEND_TO || "unfusedz.admin@gmail.com";

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail({ subject, html, attachments }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Simulating success for development.");
    return { simulated: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const data = await resend.emails.send({
    from: RESEND_FROM,
    to: RESEND_TO,
    subject,
    html,
    attachments,
  });

  if (data.error) {
    throw new Error(data.error.message || "Resend error");
  }
  return data;
}
