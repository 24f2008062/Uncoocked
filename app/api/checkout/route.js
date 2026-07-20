import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Razorpay from "razorpay";

// Initialize the production Razorpay instance using environment variables
// Make sure this matches exactly what is in your .env file
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req) {
  try {
    // 1. Parse and validate incoming payload data safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { eventId, userId } = body;
    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing required fields: eventId or userId" }, { status: 400 });
    }

    // 2. Resolve database userId if an email string was provided by the client session context
    let resolvedUserId = userId;
    if (userId.includes("@")) {
      const dbUser = await prisma.user.findUnique({ where: { email: userId } });
      if (!dbUser) {
        return NextResponse.json({ error: "Authenticated user record not found" }, { status: 404 });
      }
      resolvedUserId = dbUser.id;
    }

    // 3. Execute isolated database verification checks inside a secure transaction block
    const transactionResult = await prisma.$transaction(async (tx) => {
      // Find the explicit event targeted by the user
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: { registrations: { where: { status: "Confirmed" } } }
          }
        }
      });

      if (!event) {
        throw new Error("EVENT_NOT_FOUND");
      }

      // Safeguard against overlapping event registrations
      const existingReg = await tx.registration.findUnique({
        where: {
          userId_eventId: {
            userId: resolvedUserId,
            eventId: event.id
          }
        }
      });

      if (existingReg && existingReg.status === "Confirmed") {
        throw new Error("ALREADY_REGISTERED");
      }

      // Production capacity gate validation
      if (event.capacity && event._count.registrations >= event.capacity) {
        throw new Error("EVENT_FULL");
      }

      return event;
    });

    const event = transactionResult;

    // 4. Handle Free vs Paid registration flows cleanly
    if (event.ticketType === "Free" || event.price === 0) {
      // Direct write registration for free tickets bypassing payment infrastructure
      const registration = await prisma.registration.create({
        data: {
          userId: resolvedUserId,
          eventId: event.id,
          status: "Confirmed",
        }
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        message: "Successfully registered for free event",
        registrationId: registration.id
      }, { status: 201 });
    }

    // 5. Generate a legitimate, verifiable Razorpay order object
    const amountInPaise = Math.round(event.price * 100); 
    
    const razorpayOrderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_ev_${event.id.substring(0, 10)}_${Date.now().toString().slice(-6)}`,
      notes: {
        eventId: event.id,
        userId: resolvedUserId
      }
    };

    const order = await razorpay.orders.create(razorpayOrderOptions);

    // 6. Return standard client execution context
    return NextResponse.json({
      success: true,
      isFree: false,
      orderId: order.id,       // Transmit the real order.id from Razorpay API servers
      amount: order.amount,
      currency: order.currency,
      eventId: event.id
    }, { status: 200 });

  } catch (error) {
    // Intercept expected transaction validation faults to send clear status codes
    if (error.message === "EVENT_NOT_FOUND") {
      return NextResponse.json({ error: "The requested event does not exist" }, { status: 404 });
    }
    if (error.message === "ALREADY_REGISTERED") {
      return NextResponse.json({ error: "You are already registered for this event" }, { status: 400 });
    }
    if (error.message === "EVENT_FULL") {
      return NextResponse.json({ error: "Registration failed. Event capacity is fully booked" }, { status: 409 });
    }

    // Capture unhandled anomalies cleanly without exposing backend paths
    console.error("[CRITICAL] Production Checkout Error Log:", error);
    return NextResponse.json({ error: "An unexpected payment error occurred" }, { status: 500 });
  }
}