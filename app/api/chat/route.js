import { NextResponse } from "next/server";
import Pusher from "pusher";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

// 1. POST route to save and send a message
export async function POST(req) {
  try {
    const { eventId, userName, userEmail, message } = await req.json();

    if (!message || !eventId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save message to database via Prisma
    const newMessage = await prisma.chatMessage.create({
      data: { eventId, userName, userEmail, message },
    });

    // Trigger real-time update over Pusher channel specific to this event ID
    await pusher.trigger(`event-chat-${eventId}`, "new-message", newMessage);

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. GET route to load old chat history when they open the page
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Event ID required" }, { status: 400 });
    }

    const history = await prisma.chatMessage.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server error" }, { status: 500 });
  }
}