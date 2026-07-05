import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request) {
  try {
    const { name, email, role, message } = await request.json();

    // Verify environment variable is set
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Simulating success for development.");
      // In development without an API key, we simulate a successful send
      return NextResponse.json({ success: true, simulated: true }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: "Uncooked Portal <onboarding@resend.dev>", // Resend test domain
      to: "unfusedz.admin@gmail.com",
      subject: `New Contact Request: ${role} - ${name}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Role:</strong> ${role}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
