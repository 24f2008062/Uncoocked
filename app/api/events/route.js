import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ACTIVE_CITIES, DEFAULT_CITY, DEFAULT_STATE, DEFAULT_COUNTRY } from '../../config/cities';

const prisma = new PrismaClient({});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const whereClause = {
      city: { in: ACTIVE_CITIES }
    };

    if (!includeArchived) {
      whereClause.archived = false;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        date: 'asc'
      },
      include: {
        bulletinUpdates: {
          orderBy: { postedAt: 'desc' }
        },
        organizer: true,
        _count: {
          select: { registrations: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Extract organizerId from data if provided
    let organizerId = data.organizerId;

    if (organizerId && organizerId.includes('@')) {
      // Frontend passed email instead of user ID
      const user = await prisma.user.findUnique({ where: { email: organizerId } });
      if (user) {
        organizerId = user.id;
      } else {
        organizerId = null;
      }
    } else if (!organizerId && data.hostEmail) {
      // Fallback: look up user by hostEmail
      const user = await prisma.user.findUnique({ where: { email: data.hostEmail } });
      if (user) {
        organizerId = user.id;
      }
    }

    const newEvent = await prisma.event.create({
      data: {
        id: data.id,
        title: data.title,
        type: data.type,
        date: new Date(data.date),
        location: data.location,
        zone: data.zone || null,
        city: data.city || DEFAULT_CITY,
        state: data.state || DEFAULT_STATE,
        country: data.country || DEFAULT_COUNTRY,
        description: data.description,
        bannerUrl: data.bannerUrl,
        ticketType: data.ticketType || "Free",
        price: data.price ? parseFloat(data.price) : 0,
        capacity: data.capacity ? parseInt(data.capacity) : 100,
        waitlistEnabled: data.waitlistEnabled ?? true,
        organizerId: organizerId || null,
      },
    });

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Events POST API error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
