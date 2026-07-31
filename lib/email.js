import nodemailer from "nodemailer";
// import { Resend } from "resend";

export const SMTP_FROM =
  process.env.SMTP_FROM ||
  process.env.SMTP_USER ||
  "Uncooked Portal <uncooked.official@gmail.com>";
export const RESEND_TO = process.env.RESEND_TO || "unfusedz.admin@gmail.com";

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendEmail({ to = RESEND_TO, subject, html, attachments }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP_USER or SMTP_PASS not configured in .env. Simulating email send for development.");
    console.log(`\n[SIMULATED EMAIL TO ${to}]\nSubject: ${subject}\n==========================================\n`);
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    html,
    attachments,
  });

  return info;

  /* --- Resend code commented out for now ---
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Simulating success for development.");
    return { simulated: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const data = await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject,
    html,
    attachments,
  });

  if (data.error) {
    throw new Error(data.error.message || "Resend error");
  }
  return data;
  ----------------------------------------- */
}
