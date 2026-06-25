import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function GET(request) {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
