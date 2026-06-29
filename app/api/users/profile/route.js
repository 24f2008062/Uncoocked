import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
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
    const body = await request.json();
    const { email, interests, department, portfolioUrl, fullName, dob } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const updateData = {};
    if (interests !== undefined) updateData.interests = JSON.stringify(interests);
    if (department !== undefined) updateData.department = department;
    if (portfolioUrl !== undefined) updateData.portfolioUrl = portfolioUrl;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (dob !== undefined) updateData.dob = dob;

    const user = await prisma.user.update({
      where: { email },
      data: updateData,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
