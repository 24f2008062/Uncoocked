import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const analyticsLogs = await prisma.eventAnalytic.findMany({
      where: { eventId: id },
      orderBy: { date: 'asc' }
    });

    // If no logs, return mock data layout for recharts
    if (analyticsLogs.length === 0) {
      return NextResponse.json({
        timelineData: [
          { date: "Day 1", views: 0, registrations: 0, revenue: 0 }
        ],
        funnelData: [
          { name: "Impressions", value: 0 },
          { name: "Page Visits", value: 0 },
          { name: "Checkout", value: 0 },
          { name: "Registered", value: 0 },
        ],
        trafficData: [],
        deviceData: []
      });
    }

    const timelineData = analyticsLogs.map(log => ({
      date: log.date.toISOString().split('T')[0],
      views: log.views,
      registrations: log.registrations,
      revenue: log.revenue
    }));

    return NextResponse.json({
      timelineData,
      // Aggregates can be calculated here
      funnelData: [],
      trafficData: [],
      deviceData: []
    }, { status: 200 });

  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
