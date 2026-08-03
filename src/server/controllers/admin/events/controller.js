import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request) {
  try {
    await requireSuperAdmin(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const statusFilter = searchParams.get("status") || "ALL";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where = {
      ...(statusFilter === "SUSPENDED"
        ? { status: "Suspended" }
        : statusFilter === "ARCHIVED"
        ? { archived: true }
        : statusFilter === "ACTIVE"
        ? { status: "Active", archived: false }
        : statusFilter === "COMPLETED"
        ? { status: "Completed" }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
              { organizer: { name: { contains: search, mode: "insensitive" } } },
              { organizer: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    let orderBy = { createdAt: "desc" };
    if (sortBy === "createdAt_asc") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "date_asc") {
      orderBy = { date: "asc" };
    } else if (sortBy === "popularity_desc") {
      orderBy = { popularityScore: "desc" };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: { id: true, name: true, fullName: true, email: true, image: true },
          },
          _count: {
            select: { registrations: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: events,
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
    console.error("GET Admin Events Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
