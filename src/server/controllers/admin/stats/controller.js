import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request) {
  try {
    await requireSuperAdmin(request);

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
    ] = await Promise.all([
      prisma.hostApplication.count(),
      prisma.hostApplication.count({ where: { status: "PENDING" } }),
      prisma.hostApplication.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.hostApplication.count({ where: { status: "APPROVED" } }),
      prisma.hostApplication.count({ where: { status: "REJECTED" } }),
      prisma.hostApplication.count({ where: { status: "NEEDS_MORE_INFORMATION" } }),
      prisma.hostApplication.count({ where: { status: "SUSPENDED" } }),
      prisma.user.count(),
      prisma.user.count({ where: { role: "ORGANIZER" } }),
    ]);

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
      },
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
