import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, registrationId } = await req.json();

    // Verify cryptographic signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature verification failed" }, { status: 400 });
    }

    // Update the pending registration to Confirmed
    const updatedRegistration = await prisma.registration.update({
      where: { id: registrationId },
      data: { status: "Confirmed" },
      include: { ticketTier: true, coupon: true }
    });

    // Increment coupon uses if applied
    if (updatedRegistration.couponId) {
      await prisma.coupon.update({
        where: { id: updatedRegistration.couponId },
        data: { currentUses: { increment: 1 } }
      });
    }

    // Increment sold count for the selected ticket tier
    if (updatedRegistration.ticketTierId) {
      await prisma.ticketTier.update({
        where: { id: updatedRegistration.ticketTierId },
        data: { soldCount: { increment: 1 } }
      });
    }

    return NextResponse.json({ success: true, message: "Payment verified and registration complete!" });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Verification processing failed" }, { status: 500 });
  }
}