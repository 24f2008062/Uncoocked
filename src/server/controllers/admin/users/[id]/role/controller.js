import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";
import { createNotification } from "@/server/services/notificationService";

export async function POST(request, { params }) {
  try {
    const admin = await requireSuperAdmin(request);
    const { id } = await params;
    const { newRole, reason } = await request.json();

    const VALID_ROLES = ["USER", "User", "ORGANIZER", "SUPER_ADMIN"];
    if (!newRole || !VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { hostApplication: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === admin.id && newRole !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Self-demotion is forbidden. Super Admins cannot revoke their own role." }, { status: 400 });
    }

    if (targetUser.role === "SUPER_ADMIN" && targetUser.id !== admin.id) {
      return NextResponse.json({ error: "Forbidden: Cannot modify another Super Admin's role" }, { status: 403 });
    }

    const previousRole = targetUser.role;

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { role: newRole },
      });

      await tx.auditLog.create({
        data: {
          adminId: admin.id,
          applicationId: targetUser.hostApplication?.id || null,
          action: "USER_ROLE_UPDATED",
          previousStatus: previousRole,
          newStatus: newRole,
          reason: reason || `User role updated from ${previousRole} to ${newRole}`,
        },
      });

      return user;
    });

    // Automatic Notification Trigger
    await createNotification({
      userId: id,
      title: "Account Role Updated",
      message: `Your account role has been updated from ${previousRole} to ${newRole}.`,
      type: "GOVERNANCE",
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("POST User Role Update Error:", error);
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
