import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request, { params }) {
  try {
    await requireSuperAdmin(request);
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, fullName: true, email: true, image: true, role: true },
        },
        registrations: {
          take: 5,
          orderBy: { registeredAt: "desc" },
          include: { user: { select: { name: true, email: true } } },
        },
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Fetch audit logs associated with this event or organizer
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { reason: { contains: event.id } },
          { reason: { contains: event.title } },
        ],
      },
      take: 10,
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({ success: true, data: event, auditLogs });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("GET Admin Event Detail Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
