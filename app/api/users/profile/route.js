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

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (token.email !== email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, interests, department, portfolioUrl, fullName, dob } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (token.email !== email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData = {};
    if (interests !== undefined) updateData.interests = JSON.stringify(interests);
    if (department !== undefined) updateData.department = department;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (dob !== undefined) updateData.dob = dob;

    const user = await prisma.user.upsert({
      where: { email },
      update: updateData,
      create: {
        email,
        passwordHash: 'dummy',
        fullName: fullName || 'New User',
        ...updateData,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
