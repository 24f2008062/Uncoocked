import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthToken, requireEventManager } from "@/lib/auth/guards";

const prisma = new PrismaClient({});

export async function POST(request, { params }) {
  try {
    const data = await request.json();
    const eventId = params.id;

    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await requireEventManager(eventId, token))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  
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
