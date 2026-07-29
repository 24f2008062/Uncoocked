import { NextResponse } from "next/server";
import { sendEmail, escapeHtml } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, role, message } = await request.json();

    const data = await sendEmail({
      subject: `New Contact Request: ${escapeHtml(role)} - ${escapeHtml(name)}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Role:</strong> ${escapeHtml(role)}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
