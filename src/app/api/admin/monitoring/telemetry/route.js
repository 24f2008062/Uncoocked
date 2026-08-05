import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/guards";
import { getSystemHealthStatus, getRecentTelemetrySnapshots, captureTelemetrySnapshot } from "@/server/services/systemMonitoringService";

export async function GET(request) {
  try {
    await requirePermission(request, "MONITORING_VIEW");
    const health = await getSystemHealthStatus();
    const snapshots = await getRecentTelemetrySnapshots(24);
    return NextResponse.json({ health, snapshots });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: MONITORING_VIEW permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch monitoring telemetry" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await requirePermission(request, "MONITORING_VIEW");
    const snapshot = await captureTelemetrySnapshot();
    return NextResponse.json({ success: true, snapshot });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: MONITORING_VIEW permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to capture snapshot" }, { status: 500 });
  }
}
