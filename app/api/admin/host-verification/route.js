import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: token.sub },
      select: { role: true, email: true },
    });

    if (adminUser?.role !== 'Admin' && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const whereClause = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    const applications = await prisma.hostVerification.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 10,
        },
      },
    });

    // Fetch user details for each application
    const userIds = Array.from(new Set(applications.map((app) => app.userId)));
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, fullName: true, email: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedApplications = applications.map((app) => ({
      ...app,
      applicantUser: userMap.get(app.userId) || { name: 'Unknown User', email: app.userId },
      documentsParsed: app.documents ? JSON.parse(app.documents) : [],
    }));

    return NextResponse.json({
      success: true,
      applications: enrichedApplications,
      total: enrichedApplications.length,
    });
  } catch (error) {
    console.error('Admin list host verifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch host verifications' }, { status: 500 });
  }
}
