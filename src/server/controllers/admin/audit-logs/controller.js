import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

// GET: Fetch Paginated & Filtered Audit Logs
export async function GET(request) {
  try {
    await requireSuperAdmin(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const actionFilter = searchParams.get("action") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const skip = (page - 1) * limit;

    const where = {
      ...(actionFilter && actionFilter !== "ALL" ? { action: actionFilter } : {}),
      ...(search
        ? {
            OR: [
              { reason: { contains: search, mode: "insensitive" } },
              { action: { contains: search, mode: "insensitive" } },
              { previousStatus: { contains: search, mode: "insensitive" } },
              { newStatus: { contains: search, mode: "insensitive" } },
              { application: { organizationName: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: "desc" },
        include: {
          application: { select: { id: true, organizationName: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("GET Audit Logs Error:", error);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}

// POST: Create a New Custom Audit Log Entry (e.g. Document Access)
export async function POST(request) {
  try {
    const admin = await requireSuperAdmin(request);
    const { action, applicationId, details } = await request.json();

    const log = await prisma.auditLog.create({
      data: {
        action,
        applicationId,
        adminId: admin.id,
        reason: details || "Document accessed by Super Admin",
      },
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 });
  }
}
