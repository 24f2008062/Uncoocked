import { NextResponse } from "next/server";
import { Resend } from "resend";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 5 * 1024 * 1024;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fullName = (formData.get("fullName") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const phone = (formData.get("phone") || "").toString().trim();
    const role = (formData.get("role") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();
    const opportunityTitle = (formData.get("opportunityTitle") || "").toString().trim();
    const opportunityCompany = (formData.get("opportunityCompany") || "").toString().trim();
    const opportunityType = (formData.get("opportunityType") || "").toString().trim();
    const opportunityLocation = (formData.get("opportunityLocation") || "").toString().trim();
    const resume = formData.get("resume");

    if (!fullName || !email || !role) {
      return NextResponse.json(
        { error: "fullName, email, and role are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!resume || typeof resume === "string") {
      return NextResponse.json(
        { error: "Resume file is required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(resume.type)) {
      return NextResponse.json(
        { error: "Resume must be a PDF or Word document" },
        { status: 400 }
      );
    }

    if (resume.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Resume must be under 5MB" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not set. Simulating success for development.");
      return NextResponse.json({ success: true, simulated: true }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fileBuffer = Buffer.from(await resume.arrayBuffer());

    const data = await resend.emails.send({
      from: "Uncooked Portal <onboarding@resend.dev>",
      to: "unfusedz.admin@gmail.com",
      subject: `New Opportunity Application — ${opportunityTitle}`,
      html: `
        <h2>New Opportunity Application</h2>
        <h3>Opportunity</h3>
        <p><strong>Title:</strong> ${opportunityTitle}</p>
        <p><strong>Company:</strong> ${opportunityCompany}</p>
        <p><strong>Type:</strong> ${opportunityType}</p>
        <p><strong>Location:</strong> ${opportunityLocation}</p>
        <br/>
        <h3>Applicant</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Role:</strong> ${role}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message || "N/A"}</p>
      `,
      attachments: [
        {
          filename: resume.name,
          content: fileBuffer.toString("base64"),
        },
      ],
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Failed to send application" }, { status: 500 });
  }
}
