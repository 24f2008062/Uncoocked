import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { ACTIVE_CITIES, DEFAULT_CITY, DEFAULT_STATE, DEFAULT_COUNTRY } from '../../config/cities';

// Events change rarely; cache the read so repeat page loads don't pay the
// ~3s DB round-trip on every request. Invalidate on create/update.
const EVENTS_CACHE_TTL_MS = 60_000;
let eventsCache = { at: 0, data: null };

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';

    const cached = eventsCache.data && Date.now() - eventsCache.at < EVENTS_CACHE_TTL_MS
      ? eventsCache.data
      : null;
    if (cached) {
      return NextResponse.json({ success: true, events: cached, cached: true });
    }

    const whereClause = {
      city: { in: ACTIVE_CITIES }
    };

    if (!includeArchived) {
      whereClause.archived = false;
      whereClause.status = 'Active';
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
        organizer: {
          select: {
            id: true,
            name: true,
            fullName: true,
            image: true,
            role: true,
          },
        },
        _count: {
          select: { registrations: true }
        }
      }
    });

    eventsCache = { at: Date.now(), data: events };

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
    let organizerId = data.organizerId;

    // Require an authenticated session; the organizer is the caller.
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!token.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email address before creating events.' }, { status: 403 });
    }
    if (!organizerId) {
      organizerId = token.email;
    }

    if (organizerId && organizerId.includes('@')) {
      const user = await prisma.user.findUnique({ where: { email: organizerId } });
      if (user) {
        organizerId = user.id;
      }
    } else if (!organizerId && data.hostEmail) {
      const user = await prisma.user.findUnique({ where: { email: data.hostEmail } });
      if (user) {
        organizerId = user.id;
      } else {
        organizerId = data.hostEmail;
      }
    }

    // Input validation
    if (!data.title || data.title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters long.' }, { status: 400 });
    }
    if (!data.location || data.location.trim().length < 3 || data.location.toLowerCase().includes('no address')) {
      return NextResponse.json({ error: 'Please provide a valid event location.' }, { status: 400 });
    }
    if (!data.description || data.description.trim().length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters long.' }, { status: 400 });
    }

    const eventId = data.id && !data.id.startsWith('hosted-ev-')
      ? data.id
      : `ev-${crypto.randomUUID()}`;

    const newEvent = await prisma.event.create({
      data: {
        id: eventId,
        title: data.title.trim(),
        type: data.type || 'Other',
        date: data.date && !isNaN(new Date(data.date).getTime()) ? new Date(data.date) : new Date(),
        location: data.location.trim(),
        zone: data.zone || null,
        city: data.city || DEFAULT_CITY,
        state: data.state || DEFAULT_STATE,
        country: data.country || DEFAULT_COUNTRY,
        description: data.description.trim(),
        bannerUrl: data.bannerUrl,
        googleMapsUrl: data.googleMapsUrl,
        ticketType: data.ticketType || "Free",
        price: data.price ? parseFloat(data.price) : 0,
        capacity: data.capacity ? parseInt(data.capacity) : 100,
        waitlistEnabled: data.waitlistEnabled ?? true,
        organizerId: organizerId || null,
      },
    });

    eventsCache = { at: 0, data: null };

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Events POST API error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}