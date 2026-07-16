import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken, requireEventManager } from "@/lib/auth/guards";

export async function PUT(request, { params }) {
  const { id } = await params;
  const { capacity, waitlistEnabled } = await request.json();

  const token = await getAuthToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await requireEventManager(id, token))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        capacity,
        waitlistEnabled
      }
    });

    await prisma.eventActivityLog.create({
      data: {
        eventId: id,
        action: "Settings Updated",
        performedBy: "organizer"
      }
    });

    return NextResponse.json({ success: true, event: updated }, { status: 200 });
  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const token = await getAuthToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await requireEventManager(id, token))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // In production, ensure cascaded deletes for registrations, analytics, etc
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Event Error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
