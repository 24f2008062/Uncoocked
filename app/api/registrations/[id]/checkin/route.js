import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function PUT(request, context) {
  try {
    const params = await context.params;
    const id = params.id;
    const data = await request.json();

    const registration = await prisma.registration.findUnique({
      where: { id }
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const eventId = registration.eventId;

    const [updated] = await prisma.$transaction([
      prisma.registration.update({
        where: { id },
        data: {
          checkInStatus: data.checkedIn !== undefined ? data.checkedIn : true,
        },
      }),
      prisma.eventAnalytic.update({
        where: { id: `analytic-${eventId}` },
        data: {
          attendance: { increment: data.checkedIn ? 1 : -1 }
        }
      })
    ]);

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    console.error('Failed to update registration status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
