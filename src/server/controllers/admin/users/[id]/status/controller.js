import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";
import { createNotification } from "@/server/services/notificationService";

export async function POST(request, { params }) {
  try {
    const admin = await requireSuperAdmin(request);
    const { id } = await params;
    const { action, reason } = await request.json();

    if (!["SUSPEND", "REACTIVATE"].includes(action)) {
      return NextResponse.json({ error: "Invalid status action specified" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { hostApplication: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSuspending = action === "SUSPEND";

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          lockedUntil: isSuspending ? new Date("2099-12-31T23:59:59Z") : null,
          role: isSuspending && targetUser.role === "ORGANIZER" ? "USER" : targetUser.role,
        },
      });

      if (targetUser.hostApplication) {
        await tx.hostApplication.update({
          where: { id: targetUser.hostApplication.id },
          data: { status: isSuspending ? "SUSPENDED" : "APPROVED" },
        });
      }

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          applicationId: targetUser.hostApplication?.id || null,
          action: isSuspending ? "USER_ACCOUNT_SUSPENDED" : "USER_ACCOUNT_REACTIVATED",
          previousStatus: targetUser.lockedUntil ? "SUSPENDED" : "ACTIVE",
          newStatus: isSuspending ? "SUSPENDED" : "ACTIVE",
          reason: reason || `User account ${action.toLowerCase()}d by admin.`,
        },
      });

      return user;
    });

    // Automatic Notification Trigger
    await createNotification({
      userId: id,
      title: isSuspending ? "Account Suspended" : "Account Reactivated",
      message: isSuspending
        ? "Your account access has been suspended by an administrator. Please contact support for appeals."
        : "Your account access has been restored.",
      type: "SECURITY",
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("POST User Status Error:", error);
    return NextResponse.json({ error: "Failed to update user account status" }, { status: 500 });
  }
}
