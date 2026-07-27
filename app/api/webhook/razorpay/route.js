import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    
    // Secure webhook secret you define in your Razorpay Dashboard
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET; 

    // 1. Verify the request genuinely came from Razorpay (Security Validation)
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const eventData = JSON.parse(rawBody);

    // 2. Listen specifically for successful captures
    if (eventData.event === "payment.captured") {
      const payment = eventData.payload.payment.entity;
      
      // Extract the notes we attached during the checkout order creation step
      const { eventId, userId } = payment.notes;

      if (eventId && userId) {
        // 3. Upsert or update the user's event registration status securely in the DB
        await prisma.registration.upsert({
          where: {
            userId_eventId: { userId, eventId }
          },
          update: {
            status: "Confirmed",
          },
          create: {
            userId,
            eventId,
            status: "Confirmed",
          }
        });
        
        console.log(`[WEBHOOK SUCCESS] Confirmed seat for User: ${userId} at Event: ${eventId}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("[WEBHOOK ERROR]:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}