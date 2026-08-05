import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request) {
  try {
    // Verify Super Admin access
    await requireSuperAdmin(request);

    // Group application counts by status in a single query
    const statusCounts = await prisma.hostApplication.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const stats = {
      PENDING: 0,
      UNDER_REVIEW: 0,
      NEEDS_MORE_INFORMATION: 0,
      APPROVED: 0,
      REJECTED: 0,
      SUSPENDED: 0,
    };

    statusCounts.forEach((item) => {
      stats[item.status] = item._count._all;
    });

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
