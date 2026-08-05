import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/guards";
import { getTickets, createTicket } from "@/server/services/supportTicketService";
import { withAdminRateLimit } from "@/server/middleware/rateLimit";

export async function GET(request) {
  try {
    await requirePermission(request, "SUPPORT_VIEW");
    const { searchParams } = request.nextUrl;
    const filters = {
      status: searchParams.get("status") || undefined,
      category: searchParams.get("category") || undefined,
      priority: searchParams.get("priority") || undefined,
    };
    const tickets = await getTickets(filters);
    return NextResponse.json({ tickets });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: SUPPORT_VIEW permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch support tickets" }, { status: 500 });
  }
}

export const POST = withAdminRateLimit(async function POST(request) {
  try {
    const admin = await requirePermission(request, "SUPPORT_MANAGE");
    const body = await request.json();
    const ticket = await createTicket(body, admin.id);
    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: SUPPORT_MANAGE permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
});
