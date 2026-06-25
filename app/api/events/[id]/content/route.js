import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const { id } = await params;
  const { description, schedule, venue, bannerUrl, tags } = await request.json();

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        description,
        schedule,
        location: venue,
        bannerUrl,
        tags
      }
    });

    // Log the change
    await prisma.eventActivityLog.create({
      data: {
        eventId: id,
        action: "Content Updated",
        performedBy: "organizer"
      }
    });

    return NextResponse.json({ success: true, event: updated }, { status: 200 });
  } catch (error) {
    console.error("Update Content Error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
