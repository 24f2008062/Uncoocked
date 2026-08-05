import { NextResponse } from "next/server";
import { requirePermission } from "@/server/auth/guards";
import { getAllFeatureFlags, setFeatureFlag } from "@/server/services/featureFlagService";
import { withAdminRateLimit } from "@/server/middleware/rateLimit";

export async function GET(request) {
  try {
    await requirePermission(request, "SYSTEM_CONFIG");
    const flags = await getAllFeatureFlags();
    return NextResponse.json({ flags });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: SYSTEM_CONFIG permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch feature flags" }, { status: 500 });
  }
}

export const POST = withAdminRateLimit(async function POST(request) {
  try {
    const admin = await requirePermission(request, "SYSTEM_CONFIG");
    const { key, enabled, description } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Feature flag key is required" }, { status: 400 });
    }

    const updated = await setFeatureFlag(key, enabled, admin.id, description);
    return NextResponse.json({ success: true, flag: updated });
  } catch (error) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN_PERMISSION") {
      return NextResponse.json({ error: "Forbidden: SYSTEM_CONFIG permission required" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to update feature flag" }, { status: 500 });
  }
});
