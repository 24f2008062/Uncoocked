import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({});

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const eventId = params.id;

    const newBulletin = await prisma.bulletinUpdate.create({
      data: {
        eventId,
        title: data.title,
        content: data.content,
      },
    });

    return NextResponse.json({
      success: true,
      bulletin: newBulletin,
    });
  } catch (error) {
    console.error('Bulletins POST API error:', error);
    return NextResponse.json({ error: 'Failed to create bulletin' }, { status: 500 });
  }
}
