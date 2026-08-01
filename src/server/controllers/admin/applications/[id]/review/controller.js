import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function POST(request, { params }) {
  try {
    const admin = await requireSuperAdmin(request);

    // Safely unwrap params
    const resolvedParams = await params;
    const applicationId = resolvedParams?.id;

    if (!applicationId) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const body = await request.json();
    const { action, notes } = body;

    const existingApp = await prisma.hostApplication.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true, userId: true, organizationName: true },
    });

    if (!existingApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    let nextStatus = existingApp.status;
    let targetUserRole = null;
    let notificationTitle = "";
    let notificationMessage = "";

    switch (action) {
      case "APPROVE":
        nextStatus = "APPROVED";
        targetUserRole = "ORGANIZER";
        notificationTitle = "Host Application Approved! 🎉";
        notificationMessage = `Congratulations! Your application for "${existingApp.organizationName || "your organization"}" has been approved. You can now host events.`;
        break;
      case "REJECT":
        nextStatus = "REJECTED";
        notificationTitle = "Host Application Update";
        notificationMessage = `Your host application for "${existingApp.organizationName || "your organization"}" was not approved.${notes ? ` Reason: ${notes}` : ""}`;
        break;
      case "REQUEST_INFO":
        nextStatus = "NEEDS_MORE_INFORMATION";
        notificationTitle = "Action Required: Additional Info Needed";
        notificationMessage = `We need more details regarding your host application for "${existingApp.organizationName || "your organization"}".${notes ? ` Details: ${notes}` : ""}`;
        break;
      case "SUSPEND":
        nextStatus = "SUSPENDED";
        targetUserRole = "USER";
        notificationTitle = "Host Account Suspended";
        notificationMessage = `Your host status for "${existingApp.organizationName || "your organization"}" has been suspended.${notes ? ` Reason: ${notes}` : ""}`;
        break;
      case "REINSTATE":
        nextStatus = "APPROVED";
        targetUserRole = "ORGANIZER";
        notificationTitle = "Host Account Reinstated";
        notificationMessage = `Your host status for "${existingApp.organizationName || "your organization"}" has been reinstated. You may now create and host events again.`;
        break;
      default:
        return NextResponse.json({ error: "Invalid review action" }, { status: 400 });
    }

    // 1. Update Application
    await prisma.hostApplication.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        ...(action === "REJECT" && { rejectionReason: notes }),
        ...(action === "REQUEST_INFO" && { infoRequestedReason: notes }),
      },
    });

    // 2. Update User Role
    if (targetUserRole) {
      await prisma.user.update({
        where: { id: existingApp.userId },
        data: { role: targetUserRole },
      });
    }

    // 3. Save Admin Note
    if (notes) {
      await prisma.adminNote.create({
        data: {
          applicationId,
          adminId: admin.id,
          note: notes,
        },
      });
    }

    // 4. Log Audit Entry
    await prisma.auditLog.create({
      data: {
        action: `APPLICATION_${action}`,
        applicationId,
        adminId: admin.id,
        previousStatus: existingApp.status,
        newStatus: nextStatus,
        reason: notes || null,
      },
    });

    // 5. Safe Notification Creation (Non-blocking catch)
    if (notificationTitle && notificationMessage) {
      try {
        await prisma.notification.create({
          data: {
            userId: existingApp.userId,
            title: notificationTitle,
            message: notificationMessage,
          },
        });
      } catch (notifErr) {
        console.error("Failed to create notification record:", notifErr);
      }
    }

    return NextResponse.json({ success: true, action, status: nextStatus });
  } catch (error) {
    console.error("POST Review Action Error:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to process application action" },
      { status: 500 }
    );
  }
}
