import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [studentsCount, activeEventsCount, registrationsCount, clubsGroup] = await Promise.all([
      prisma.user.count(),
      prisma.event.count({ where: { status: "Active", archived: false } }),
      prisma.registration.count(),
      prisma.user.groupBy({
        by: ["clubAssociation"],
        where: { clubAssociation: { not: null } },
      }),
    ]);

    const clubsCount = clubsGroup.filter((g) => g.clubAssociation?.trim()).length;

    return NextResponse.json({
      success: true,
      stats: {
        students: studentsCount,
        activeEvents: activeEventsCount,
        registrations: registrationsCount,
        clubs: clubsCount,
      },
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch stats",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
