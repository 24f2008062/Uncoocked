import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/server/auth/guards";
import { processReviewAction } from "@/server/services/hostVerificationService";

export async function POST(request) {
  try {
    const admin = await requireSuperAdmin(request);
    const { applicationIds, action, notes } = await request.json();

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid applicationIds array" }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({ error: "Missing review action" }, { status: 400 });
    }

    const results = [];
    const errors = [];

    for (const id of applicationIds) {
      try {
        const updated = await processReviewAction(id, admin.id, action, notes);
        results.push({ id, status: updated.status, success: true });
      } catch (err) {
        errors.push({ id, error: err.message });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      processed: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || "Batch review action failed" }, { status: 500 });
  }
}
