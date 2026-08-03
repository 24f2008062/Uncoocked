import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { requireSuperAdmin } from "@/server/auth/guards";

export async function GET(request) {
  try {
    await requireSuperAdmin(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt_desc";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where = {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { organizationName: { contains: search, mode: "insensitive" } },
              { user: { name: { contains: search, mode: "insensitive" } } },
              { user: { fullName: { contains: search, mode: "insensitive" } } },
              { user: { email: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    let orderBy = { createdAt: "desc" };
    if (sortBy === "createdAt_asc") {
      orderBy = { createdAt: "asc" };
    } else if (sortBy === "orgName_asc") {
      orderBy = { organizationName: "asc" };
    }

    const [applications, total] = await Promise.all([
      prisma.hostApplication.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, fullName: true, email: true, image: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.hostApplication.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: applications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
