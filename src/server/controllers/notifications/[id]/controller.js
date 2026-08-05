import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { deleteNotification } from "@/server/services/notificationService";

export async function DELETE(request, { params }) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteNotification(id, token.sub);

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("DELETE Notification Error:", error);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
