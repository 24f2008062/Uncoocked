import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { logHostVerificationAudit } from '@/lib/audit';
import { verifyHostKYC } from '@/lib/kyc';

export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orgName, clubName, applicantRole, eventDescription, portfolioUrl, documents } = body;

    if (!orgName || !applicantRole || !eventDescription) {
      return NextResponse.json(
        { error: 'orgName, applicantRole, and eventDescription are required.' },
        { status: 400 }
      );
    }

    // Check existing verification record
    const existing = await prisma.hostVerification.findUnique({
      where: { userId: token.sub },
    });

    // Task 13: Prevent duplicate submission if application is currently PENDING, UNDER_REVIEW, or APPROVED
    if (existing && ['PENDING', 'UNDER_REVIEW', 'APPROVED'].includes(existing.status)) {
      return NextResponse.json(
        {
          error: `You already have an active host verification application with status: ${existing.status}.`,
          status: existing.status,
        },
        { status: 409 }
      );
    }

    const docString = documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null;
    const oldStatus = existing?.status ?? 'NOT_APPLIED';

    // Optional KYC pre-screen check
    const kycResult = await verifyHostKYC({
      userId: token.sub,
      orgName,
      applicantRole,
      documents: documents || [],
    });

    // Upsert record to PENDING
    const record = await prisma.hostVerification.upsert({
      where: { userId: token.sub },
      create: {
        userId: token.sub,
        status: 'PENDING',
        orgName: orgName.trim(),
        clubName: clubName ? clubName.trim() : null,
        applicantRole: applicantRole.trim(),
        eventDescription: eventDescription.trim(),
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
        documents: docString,
        notes: null,
        submittedAt: new Date(),
      },
      update: {
        status: 'PENDING',
        orgName: orgName.trim(),
        clubName: clubName ? clubName.trim() : null,
        applicantRole: applicantRole.trim(),
        eventDescription: eventDescription.trim(),
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
        documents: docString,
        notes: null, // Reset previous admin feedback notes on re-application
        submittedAt: new Date(),
      },
    });

    // Task 15: Log audit entry
    await logHostVerificationAudit({
      hostVerificationId: record.id,
      oldStatus,
      newStatus: 'PENDING',
      changedBy: token.sub,
      reason: 'User submitted host verification application',
    });

    return NextResponse.json({
      success: true,
      status: record.status,
      kycScreening: kycResult,
    });
  } catch (error) {
    console.error('Host Verification apply error:', error);
    return NextResponse.json({ error: 'Failed to submit host verification application' }, { status: 500 });
  }
}
