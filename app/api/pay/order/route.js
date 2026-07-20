import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { eventId, userId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing required details" }, { status: 400 });
    }

    // 1. Fetch the event directly from your SQLite database (No price-tampering possible!)
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // 2. Razorpay expects the amount in paisa (1 Rupee = 100 Paisa)
    const amountInPaisa = Math.round(event.price * 100);

    // 3. Create Razorpay order options
    const options = {
      amount: amountInPaisa,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      metadata: {
        userId,
        eventId,
      },
    };

    const order = await razorpay.orders.create(options);

    // 4. Record a "Pending" registration state in your database
    await prisma.registration.upsert({
      where: {
        userId_eventId: { userId, eventId },
      },
      update: { status: "Pending" },
      create: {
        userId,
        eventId,
        status: "Pending",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json({ error: "Could not initiate payment order" }, { status: 500 });
  }
}