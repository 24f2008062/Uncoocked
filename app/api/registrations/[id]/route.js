import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function DELETE(request, context) {
  try {
    const params = await context.params;
    const id = params.id;

    // We need to fetch the registration first to know which event it belongs to
    const registration = await prisma.registration.findUnique({
      where: { id }
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const eventId = registration.eventId;

    await prisma.$transaction([
      prisma.registration.delete({
        where: { id },
      }),
      // Decrement the registration count in analytics
      prisma.eventAnalytic.update({
        where: { id: `analytic-${eventId}` },
        data: {
          registrations: { decrement: 1 }
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete registration:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
