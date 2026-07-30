import { prisma } from "@/lib/prisma";

export async function logHostVerificationAudit({
  hostVerificationId,
  oldStatus,
  newStatus,
  changedBy,
  reason,
}) {
  try {
    return await prisma.hostVerificationAuditLog.create({
      data: {
        hostVerificationId,
        oldStatus: oldStatus ?? null,
        newStatus,
        changedBy: changedBy ?? "system",
        reason: reason ?? null,
      },
    });
  } catch (error) {
    console.error("Failed to create host verification audit log:", error);
    return null;
  }
}
