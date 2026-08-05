import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request, { params }) {
  try {
    await requireSuperAdmin(request);
    const { id } = await params;

    const application = await prisma.hostApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            fullName: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
        auditLogs: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
