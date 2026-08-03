import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/server/auth/guards";
import { processReviewAction } from "@/server/services/hostVerificationService";

export async function POST(request, { params }) {
  try {
    const admin = await requireSuperAdmin(request);

    const resolvedParams = await params;
    const applicationId = resolvedParams?.id;

    if (!applicationId) {
      return NextResponse.json({ error: "Missing application ID" }, { status: 400 });
    }

    const body = await request.json();
    const { action, notes } = body;

    const updatedApp = await processReviewAction(applicationId, admin.id, action, notes);

    return NextResponse.json({ success: true, action, status: updatedApp.status });
  } catch (error) {
    console.error("POST Review Action Error:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Forbidden: Super Admin access required" }, { status: 403 });
    }
    const isNotFound = error.message?.includes("not found");
    return NextResponse.json(
      { error: error.message || "Failed to process application action" },
      { status: isNotFound ? 404 : 400 }
    );
  }
}
