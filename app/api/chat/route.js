import { NextResponse } from "next/server";
import Pusher from "pusher";
import { prisma } from "@/lib/prisma";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});

// 1. POST route: Save and broadcast a message (Security: Check Organizer Scam Guard)
export async function POST(req) {
  try {
    const { eventId, userName, userEmail, message } = await req.json();

    if (!message || !eventId || !userEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Anti-Scam Guard Check: Look up the event to find who hosts it
    const targetEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (targetEvent) {
      const isHost = 
        targetEvent.organizerId === userEmail || 
        targetEvent.organizer?.email === userEmail;

      if (isHost) {
        return NextResponse.json({ error: "Hosts are restricted from participating in attendee chat groups." }, { status: 403 });
      }
    }

    // Verify structural attendance entry
    const registration = await prisma.registration.findFirst({
      where: {
        eventId: eventId,
        user: { email: userEmail }
      }
    });

    if (!registration) {
      return NextResponse.json({ error: "Access Denied: Registration Required" }, { status: 403 });
    }

    const newMessage = await prisma.chatMessage.create({
      data: { eventId, userName, userEmail, message },
    });

    await pusher.trigger(`event-chat-${eventId}`, "new-message", newMessage);

    return NextResponse.json(newMessage, { status: 200 });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 2. GET route: Load message feeds (Security: Check Organizer Lock)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userEmail = searchParams.get("userEmail");

    if (!eventId || !userEmail) {
      return NextResponse.json({ error: "Event ID and User Email tracking required" }, { status: 400 });
    }

    // Anti-Scam Guard Check: Deny host access to history logs
    const targetEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true }
    });

    if (targetEvent) {
      const isHost = 
        targetEvent.organizerId === userEmail || 
        targetEvent.organizer?.email === userEmail;

      if (isHost) {
        return NextResponse.json({ error: "Access Denied: Hosts must use organizer dashboards." }, { status: 403 });
      }
    }

    const registration = await prisma.registration.findFirst({
      where: {
        eventId: eventId,
        user: { email: userEmail }
      }
    });

    if (!registration) {
      return NextResponse.json({ error: "Access Denied: Not Registered" }, { status: 403 });
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

// 3. DELETE route: Unsend a specific chat message
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const userEmail = searchParams.get("userEmail");

    if (!messageId || !userEmail) {
      return NextResponse.json({ error: "Missing required tracking parameters" }, { status: 400 });
    }

    const existingMessage = await prisma.chatMessage.findUnique({
      where: { id: messageId }
    });

    if (!existingMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (existingMessage.userEmail !== userEmail) {
      return NextResponse.json({ error: "Unauthorized to unsend this message" }, { status: 403 });
    }

    await prisma.chatMessage.delete({
      where: { id: messageId }
    });

    await pusher.trigger(`event-chat-${existingMessage.eventId}`, "message-deleted", { id: messageId });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}