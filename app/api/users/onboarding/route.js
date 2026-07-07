import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, interests, fullName, dob } = body;

    if (!email || !interests) {
      return NextResponse.json({ error: 'Email and interests are required' }, { status: 400 });
    }

    // Upsert user if they don't exist, otherwise update their interests
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        interests: JSON.stringify(interests),
        onboardingCompleted: true,
        ...(fullName && { fullName }),
        ...(dob && { dob }),
      },
      create: {
        email,
        passwordHash: 'dummy',
        fullName: fullName || 'New User',
        dob: dob || null,
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
