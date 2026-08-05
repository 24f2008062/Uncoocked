import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/guards";
import { getAllSystemSettings, setSystemSetting } from "@/server/services/systemSettingsService";
import { withAdminRateLimit } from "@/server/middleware/rateLimit";

export async function GET(request) {
  try {
    await requirePermission(request, "SYSTEM_CONFIG");
    const settings = await getAllSystemSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: SYSTEM_CONFIG permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export const POST = withAdminRateLimit(async function POST(request) {
  try {
    const admin = await requirePermission(request, "SYSTEM_CONFIG");
    const { key, value, type, description } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Setting key is required" }, { status: 400 });
    }

    const updated = await setSystemSetting(key, value, admin.id, type, description);
    return NextResponse.json({ success: true, setting: updated });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: SYSTEM_CONFIG permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Failed to update setting" }, { status: 400 });
  }
});
