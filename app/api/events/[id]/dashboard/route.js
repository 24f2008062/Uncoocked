import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthToken, requireEventManager } from "@/lib/auth/guards";

export async function GET(request, { params }) {
  const { id } = await params;

  const token = await getAuthToken(request);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await requireEventManager(id, token))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Note: In production, verify auth and event manager roles here
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: true,
        analytics: {
          orderBy: { date: 'desc' },
          take: 1
        },
        activityLogs: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Aggregate stats
    const totalRegistrations = event.registrations.length;
    const capacityUtil = Math.round((totalRegistrations / event.capacity) * 100) || 0;
    const latestAnalytics = event.analytics[0] || { views: 0, revenue: 0 };

    return NextResponse.json({
      stats: {
        views: latestAnalytics.views,
        registrations: totalRegistrations,
        revenue: latestAnalytics.revenue,
        capacityUtil: Math.min(capacityUtil, 100),
        capacity: event.capacity
      },
      activities: event.activityLogs,
      status: "Published" // Mock status based on visibility
    }, { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
