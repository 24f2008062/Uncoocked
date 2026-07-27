import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthToken, requireEventManager } from "@/lib/auth/guards";

const prisma = new PrismaClient({});

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const data = await request.json();
    const eventId = params.id;

    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await requireEventManager(eventId, token))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title,
        type: data.type,
        date: new Date(data.date),
        location: data.location,
        description: data.description,
        bannerUrl: data.bannerUrl,
        ticketType: data.ticketType,
        price: data.price ? parseFloat(data.price) : 0,
        capacity: data.capacity ? parseInt(data.capacity) : 100,
        waitlistEnabled: data.waitlistEnabled ?? true,
        archived: data.archived !== undefined ? data.archived : undefined,
        googleMapsUrl: data.googleMapsUrl,
      },
    });

    return NextResponse.json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Events PUT API error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const eventId = params.id;

    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await requireEventManager(eventId, token))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Events DELETE API error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
