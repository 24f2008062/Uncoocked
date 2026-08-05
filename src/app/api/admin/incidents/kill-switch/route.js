import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/guards";
import { getOperationalStatus, toggleKillSwitch } from "@/server/services/incidentService";
import { withAdminRateLimit } from "@/server/middleware/rateLimit";

export async function GET(request) {
  try {
    await requirePermission(request, "INCIDENT_MANAGE");
    const status = await getOperationalStatus();
    return NextResponse.json({ status });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: INCIDENT_MANAGE permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch operational status" }, { status: 500 });
  }
}

export const POST = withAdminRateLimit(async function POST(request) {
  try {
    const admin = await requirePermission(request, "INCIDENT_MANAGE");
    const { key, enabled, reason } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Kill switch key is required" }, { status: 400 });
    }

    const updated = await toggleKillSwitch(key, enabled, admin.id, reason);
    return NextResponse.json({ success: true, switch: updated });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: INCIDENT_MANAGE permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to toggle kill switch" }, { status: 500 });
  }
});
