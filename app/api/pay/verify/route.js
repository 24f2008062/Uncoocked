import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, userId, eventId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Verification signatures missing" }, { status: 400 });
    }

    // 1. Re-verify payload authenticity using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      return NextResponse.json({ error: "Tampered payment signature detected!" }, { status: 400 });
    }

    // 2. Safely confirm the registration inside your database
    await prisma.registration.update({
      where: {
        userId_eventId: { userId, eventId },
      },
      data: {
        status: "Confirmed",
        checkInStatus: false,
      },
    });

    return NextResponse.json({ success: true, message: "Registration Confirmed!" });
  } catch (error) {
    console.error("Payment Verification Failed:", error);
    return NextResponse.json({ error: "Internal Server Verification Error" }, { status: 500 });
  }
}