import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const registrations = await prisma.registration.findMany({
      where: { eventId: id },
      include: {
        user: { select: { fullName: true, email: true } },
        ticketTier: true,
      },
      orderBy: { registeredAt: 'desc' }
    });

    // Map to a cleaner format for the frontend data table
    const formatted = registrations.map(reg => ({
      id: reg.id,
      name: reg.user.fullName,
      email: reg.user.email,
      date: reg.registeredAt.toISOString().split('T')[0],
      ticketType: reg.ticketTier ? reg.ticketTier.name : "General",
      paymentStatus: reg.status === "Confirmed" ? "Paid" : "Pending",
      status: reg.status,
      checkedIn: reg.checkInStatus
    }));

    return NextResponse.json({ attendees: formatted }, { status: 200 });
  } catch (error) {
    console.error("Registrations API Error:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { registrationId, action } = await request.json(); // action: 'approve', 'reject', 'checkin'

  try {
    let updateData = {};
    if (action === 'approve') updateData = { status: 'Confirmed' };
    if (action === 'reject') updateData = { status: 'Cancelled' };
    if (action === 'checkin') updateData = { checkInStatus: true };

    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: updateData
    });

    // Log the action
    await prisma.registrationLog.create({
      data: {
        registrationId,
        action,
        newStatus: updateData.status || null,
        performedBy: "organizer" // In real app, extract from session
      }
    });

    return NextResponse.json({ success: true, registration: updated }, { status: 200 });
  } catch (error) {
    console.error("Registrations Update Error:", error);
    return NextResponse.json({ error: "Failed to update registration" }, { status: 500 });
  }
}
