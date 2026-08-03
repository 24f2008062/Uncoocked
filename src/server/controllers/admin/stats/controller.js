import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request) {
  try {
    await requireSuperAdmin(request);

    const now = new Date();

    const [
      totalApplications,
      pendingCount,
      underReviewCount,
      approvedCount,
      rejectedCount,
      needsInfoCount,
      suspendedCount,
      totalUsers,
      totalOrganizers,
      activeEvents,
      upcomingEvents,
      completedEvents,
      recentActivity,
      pendingWorkItems,
    ] = await Promise.all([
      prisma.hostApplication.count(),
      prisma.hostApplication.count({ where: { status: "PENDING" } }),
      prisma.hostApplication.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.hostApplication.count({ where: { status: "APPROVED" } }),
      prisma.hostApplication.count({ where: { status: "REJECTED" } }),
      prisma.hostApplication.count({ where: { status: "NEEDS_MORE_INFORMATION" } }),
      prisma.hostApplication.count({ where: { status: "SUSPENDED" } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: { in: ["ORGANIZER", "SUPER_ADMIN"] } } }),
      prisma.event.count({ where: { status: "Active", archived: false } }),
      prisma.event.count({ where: { date: { gte: now }, archived: false } }),
      prisma.event.count({ where: { OR: [{ status: "Completed" }, { date: { lt: now } }] } }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { timestamp: "desc" },
        include: {
          application: {
            select: {
              organizationName: true,
              user: { select: { name: true, email: true } },
            },
          },
        },
      }),
      prisma.hostApplication.findMany({
        where: {
          status: { in: ["PENDING", "UNDER_REVIEW", "NEEDS_MORE_INFORMATION", "SUSPENDED"] },
        },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { id: true, name: true, fullName: true, email: true } },
        },
      }),
    ]);

    const approvalRate = totalApplications > 0 ? ((approvedCount / totalApplications) * 100).toFixed(1) : "0.0";
    const rejectionRate = totalApplications > 0 ? ((rejectedCount / totalApplications) * 100).toFixed(1) : "0.0";
    const verificationQueueSize = pendingCount + underReviewCount + needsInfoCount;

    return NextResponse.json({
      success: true,
      stats: {
        totalApplications,
        pendingCount,
        underReviewCount,
        approvedCount,
        rejectedCount,
        needsInfoCount,
        suspendedCount,
        totalUsers,
        totalOrganizers,
        activeEvents,
        upcomingEvents,
        completedEvents,
        approvalRate,
        rejectionRate,
        verificationQueueSize,
      },
      recentActivity,
      pendingWorkItems,
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("Super Admin Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
