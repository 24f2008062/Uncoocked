import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request) {
  try {
    await requireSuperAdmin(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const roleFilter = searchParams.get("role") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where = {
      ...(roleFilter !== "ALL"
        ? {
            role: roleFilter === "USER" ? { in: ["User", "USER"] } : roleFilter,
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { fullName: { contains: search } },
              { email: { contains: search } },
              { clubAssociation: { contains: search } },
              { department: { contains: search } },
            ],
          }
        : {}),
    };

    let orderBy = { createdAt: "desc" };
    if (sortBy === "createdAt_asc") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "name_asc") {
      orderBy = { name: "asc" };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          fullName: true,
          email: true,
          role: true,
          image: true,
          emailVerified: true,
          lockedUntil: true,
          createdAt: true,
          department: true,
          clubAssociation: true,
          hostApplication: {
            select: { id: true, status: true, organizationName: true },
          },
          _count: {
            select: { organizedEvents: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    console.error("GET Admin Users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
