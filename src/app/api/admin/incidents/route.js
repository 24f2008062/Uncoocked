import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/guards";
import { declareIncident, getActiveIncidents, updateIncidentStatus } from "@/server/services/platformIncidentService";
import { withAdminRateLimit } from "@/server/middleware/rateLimit";

export async function GET(request) {
  try {
    await requirePermission(request, "INCIDENT_MANAGE");
    const data = await getActiveIncidents();
    return NextResponse.json(data);
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: INCIDENT_MANAGE permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 });
  }
}

export const POST = withAdminRateLimit(async function POST(request) {
  try {
    const admin = await requirePermission(request, "INCIDENT_MANAGE");
    const body = await request.json();

    if (body.action === "UPDATE_STATUS") {
      const updated = await updateIncidentStatus(body.incidentId, body.status, body.summary, admin.id);
      return NextResponse.json({ success: true, incident: updated });
    }

    const incident = await declareIncident(body, admin.id);
    return NextResponse.json({ success: true, incident });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: INCIDENT_MANAGE permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to process incident request" }, { status: 500 });
  }
});
