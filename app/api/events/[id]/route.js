import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const data = await request.json();
    const eventId = params.id;

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
