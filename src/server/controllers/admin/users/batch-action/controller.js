import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function POST(request) {
  try {
    const admin = await requireSuperAdmin(request);
    const { userIds, action, reason } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "Missing or empty userIds array" }, { status: 400 });
    }

    if (!["SUSPEND", "REACTIVATE", "SET_ROLE_USER", "SET_ROLE_ORGANIZER"].includes(action)) {
      return NextResponse.json({ error: "Invalid batch action" }, { status: 400 });
    }

    const processed = [];
    const errors = [];

    for (const userId of userIds) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { hostApplication: true },
        });

        if (!user) continue;

        if (action === "SUSPEND" || action === "REACTIVATE") {
          const isSuspending = action === "SUSPEND";
          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: {
                lockedUntil: isSuspending ? new Date("2099-12-31T23:59:59Z") : null,
                role: isSuspending && user.role === "ORGANIZER" ? "USER" : user.role,
              },
            }),
            prisma.auditLog.create({
              data: {
                adminId: admin.id,
                applicationId: user.hostApplication?.id || null,
                action: isSuspending ? "USER_BULK_SUSPENDED" : "USER_BULK_REACTIVATED",
                previousStatus: user.lockedUntil ? "SUSPENDED" : "ACTIVE",
                newStatus: isSuspending ? "SUSPENDED" : "ACTIVE",
                reason: reason || `Bulk ${action.toLowerCase()} action.`,
              },
            }),
          ]);
        } else if (action === "SET_ROLE_USER" || action === "SET_ROLE_ORGANIZER") {
          const newRole = action === "SET_ROLE_ORGANIZER" ? "ORGANIZER" : "USER";
          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: { role: newRole },
            }),
            prisma.auditLog.create({
              data: {
                adminId: admin.id,
                applicationId: user.hostApplication?.id || null,
                action: "USER_BULK_ROLE_UPDATED",
                previousStatus: user.role,
                newStatus: newRole,
                reason: reason || `Bulk role update to ${newRole}.`,
              },
            }),
          ]);
        }

        processed.push(userId);
      } catch (err) {
        errors.push({ userId, error: err.message });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      processedCount: processed.length,
      failedCount: errors.length,
      processed,
      errors,
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("POST Batch User Action Error:", error);
    return NextResponse.json({ error: "Batch user action failed" }, { status: 500 });
  }
}
