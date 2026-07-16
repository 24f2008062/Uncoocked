import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthToken } from "@/lib/auth/guards";

const prisma = new PrismaClient({});

export async function POST(request) {
  try {
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, interests } = body;

    if (!email || !interests) {
      return NextResponse.json({ error: 'Email and interests are required' }, { status: 400 });
    }

    if (token.email !== email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Upsert user if they don't exist, otherwise update their interests
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        interests: JSON.stringify(interests),
        onboardingCompleted: true,
      },
      create: {
        email,
        passwordHash: 'dummy',
        fullName: 'New User',
        interests: JSON.stringify(interests),
        onboardingCompleted: true,
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}
