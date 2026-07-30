import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const record = await prisma.hostVerification.findUnique({
      where: { userId: token.sub },
      select: {
        id: true,
        status: true,
        orgName: true,
        clubName: true,
        applicantRole: true,
        eventDescription: true,
        portfolioUrl: true,
        documents: true,
        notes: true,
        submittedAt: true,
        reviewedAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      status: record?.status ?? 'NOT_APPLIED',
      notes: record?.notes ?? null,
      submittedAt: record?.submittedAt ?? null,
      reviewedAt: record?.reviewedAt ?? null,
      record: record ?? null,
    });
  } catch (error) {
    console.error('Host Verification status error:', error);
    return NextResponse.json({ error: 'Failed to fetch host verification status' }, { status: 500 });
  }
}
