import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthToken } from "@/lib/auth/guards";

const prisma = new PrismaClient({});

export async function GET(request) {
  try {
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = token.email;

    const whereClause = { user: { email } };

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
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { eventId, name, track, teamName, status, paymentStatus } = data;

    const email = token.email;

    if (!eventId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
