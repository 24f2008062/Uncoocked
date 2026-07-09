import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

const prisma = new PrismaClient({});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const email = searchParams.get('email');

    const requesterEmail = searchParams.get('requesterEmail');

    let whereClause = {};

    if (eventId) {
      if (!requesterEmail) {
        return NextResponse.json({ error: 'Unauthorized: missing requester' }, { status: 401 });
      }
      
      // Verify requester owns or manages the event
      const event = await prisma.event.findUnique({
        where: { id: eventId },
        include: { organizer: true, managers: { include: { user: true } } }
      });
      
      if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      
      const isOwner = event.organizer?.email === requesterEmail || event.organizerId === requesterEmail;
      const isManager = event.managers?.some(m => m.user.email === requesterEmail);
      
      if (!isOwner && !isManager) {
        return NextResponse.json({ error: 'Unauthorized: You do not own this event' }, { status: 403 });
      }

      whereClause.eventId = eventId;
    } else if (email) {
      whereClause.user = { email };
    }

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        user: true,
        event: {
          include: {
            organizer: true
          }
        },
        ticketTier: true,
        coupon: true,
      },
      orderBy: {
        registeredAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, registrations });
  } catch (error) {
    console.error('Failed to fetch registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { eventId, name, track, teamName, status, paymentStatus } = data;
    const email = data.email || token.email;

    if (!eventId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if event exists, if not, see if it's a mock event and seed it
    let event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      const { mockEvents } = await import('@/lib/mockData');
      const mockEvent = mockEvents.find(e => e.id === eventId);
      
      if (mockEvent) {
        let dateStr = mockEvent.date;
        if (dateStr.includes('-')) {
          dateStr = dateStr.split('-')[0] + ', ' + dateStr.split(', ')[1];
        }
        
        event = await prisma.event.create({
          data: {
            id: mockEvent.id,
            title: mockEvent.title,
            type: mockEvent.type,
            category: mockEvent.category,
            date: new Date(dateStr) || new Date(),
            location: mockEvent.location,
            description: mockEvent.description,
            schedule: mockEvent.schedule,
            prizePool: mockEvent.prizePool,
            bannerUrl: mockEvent.bannerUrl,
            ticketType: mockEvent.ticketType,
            price: mockEvent.price || 0,
            capacity: mockEvent.capacity || 100,
            waitlistEnabled: mockEvent.waitlistEnabled || false,
            status: "Active",
          }
        });
      } else {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          fullName: name || email.split('@')[0],
          department: track,
          clubAssociation: teamName,
        },
      });
    }

    // Check if registration exists to prevent duplicates (although DB will also block)
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId,
        }
      }
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'User is already registered for this event' }, { status: 409 });
    }

    // Create registration and update analytics atomically
    const [registration] = await prisma.$transaction([
      prisma.registration.create({
        data: {
          userId: user.id,
          eventId,
          status: status || 'Pending',
          track,
          teamName,
        },
        include: {
          user: true,
          event: true,
        },
      }),
      // Upsert analytics to increment registration count
      prisma.eventAnalytic.upsert({
        where: { id: `analytic-${eventId}` }, // Simplification for demo
        create: {
          id: `analytic-${eventId}`,
          eventId: eventId,
          registrations: 1
        },
        update: {
          registrations: { increment: 1 }
        }
      })
    ]);

    return NextResponse.json({ success: true, registration });
  } catch (error) {
    console.error('Failed to create registration:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'User is already registered for this event' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create registration' }, { status: 500 });
  }
}
