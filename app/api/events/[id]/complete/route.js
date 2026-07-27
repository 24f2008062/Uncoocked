import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthToken, requireEventManager } from "@/lib/auth/guards";

const prisma = new PrismaClient({});

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    const token = await getAuthToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await requireEventManager(id, token))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: { status: 'Completed' }
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Mark completed error:', error);
    return NextResponse.json({ error: 'Failed to complete event' }, { status: 500 });
  }
}
