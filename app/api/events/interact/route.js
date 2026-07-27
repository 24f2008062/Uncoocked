import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthToken } from "@/lib/auth/guards";

const prisma = new PrismaClient({});

export async function POST(request) {
  try {
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, interactionType } = body; // VIEW, SAVE, REGISTER
    const email = token.email;

    if (!email || !eventId || !interactionType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
       return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Record activity
    const activity = await prisma.userActivity.create({
      data: {
        userId: user.id,
        eventId,
        interactionType,
      }
    });

    // If it's a register interaction, also create a registration
    if (interactionType === 'REGISTER') {
      await prisma.registration.create({
        data: {
          userId: user.id,
          eventId,
          status: 'Confirmed'
        }
      });
    }

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Interaction API error:', error);
    return NextResponse.json({ error: 'Failed to record interaction' }, { status: 500 });
  }
}
