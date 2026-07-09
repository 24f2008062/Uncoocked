import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, interests, fullName, dob } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const interestsToSave = Array.isArray(interests) ? interests : [];

    // Upsert user if they don't exist, otherwise update their interests
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        interests: JSON.stringify(interestsToSave),
        onboardingCompleted: true,
        ...(fullName && { fullName }),
        ...(dob && { dob }),
      },
      create: {
        email,
        fullName: fullName || 'New User',
        dob: dob || null,
        interests: JSON.stringify(interestsToSave),
        onboardingCompleted: true,
      }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
