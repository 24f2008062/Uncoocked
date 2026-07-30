import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { logHostVerificationAudit } from '@/lib/audit';
import { sendEmail, escapeHtml } from '@/lib/email';

export async function PATCH(request, context) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if requester is admin / authorized
    const adminUser = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { role: true, email: true },
    });

    // Accept Admin role or developer mode override
    if (adminUser?.role !== 'Admin' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const params = await context.params;
    const verificationId = params.id;
    const { status: newStatus, notes } = await request.json();

    const VALID_STATUSES = [
      'NOT_APPLIED',
      'PENDING',
      'UNDER_REVIEW',
      'NEEDS_MORE_INFORMATION',
      'APPROVED',
      'REJECTED',
      'SUSPENDED',
    ];

    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid host verification status value' }, { status: 400 });
    }

    const existing = await prisma.hostVerification.findUnique({
      where: { id: verificationId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Host verification application not found' }, { status: 404 });
    }

    const updated = await prisma.hostVerification.update({
      where: { id: verificationId },
      data: {
        status: newStatus,
        notes: notes !== undefined ? notes : existing.notes,
        reviewedAt: new Date(),
      },
    });

    // Audit Logging
    await logHostVerificationAudit({
      hostVerificationId: existing.id,
      oldStatus: existing.status,
      newStatus,
      changedBy: token.sub,
      reason: notes || `Admin updated status to ${newStatus}`,
    });

    // Task 14: Send Email Notification to the applicant
    const applicant = await prisma.user.findUnique({
      where: { id: existing.userId },
      select: { email: true, name: true, fullName: true },
    });

    if (applicant?.email) {
      try {
        const recipientName = applicant.fullName || applicant.name || applicant.email;
        let subject = `Host Verification Update: ${newStatus}`;
        let statusMessage = `Your host verification status is now <strong>${newStatus}</strong>.`;

        if (newStatus === 'APPROVED') {
          subject = `🎉 Congratulations! Your Host Verification is Approved!`;
          statusMessage = `You are now an approved event host on Uncooked! You can create and publish campus events directly from your dashboard.`;
        } else if (newStatus === 'NEEDS_MORE_INFORMATION') {
          subject = `Action Required: Host Verification Application`;
          statusMessage = `Our review team needs additional information before finalizing your application.`;
        } else if (newStatus === 'REJECTED') {
          subject = `Update regarding your Host Verification Application`;
          statusMessage = `Your host verification application was not approved at this time.`;
        }

        const html = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #000; color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #222;">
            <h2 style="color: #A855F7; margin-top: 0;">Uncooked Portal</h2>
            <p>Hello ${escapeHtml(recipientName)},</p>
            <p>${statusMessage}</p>
            ${notes ? `<div style="background: #111; padding: 12px; border-left: 4px solid #A855F7; margin: 16px 0; border-radius: 4px;"><strong>Admin Feedback:</strong><br/>${escapeHtml(notes)}</div>` : ''}
            <p style="margin-top: 24px;"><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/host-verification/status" style="background-color: #A855F7; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">View Application Status</a></p>
          </div>
        `;

        await sendEmail({
          subject,
          html,
        });
      } catch (emailErr) {
        console.error('Failed to send host verification email notification:', emailErr);
      }
    }

    return NextResponse.json({ success: true, verification: updated });
  } catch (error) {
    console.error('Admin host verification update error:', error);
    return NextResponse.json({ error: 'Failed to update host verification status' }, { status: 500 });
  }
}
