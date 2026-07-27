import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// Returns the decoded NextAuth JWT for a request, or null if unauthenticated.
export async function getAuthToken(request) {
  return getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
}

// True if the authenticated user owns/manages the given event
// (event organizer OR an EventManager row for that event).
export async function requireEventManager(eventId, token) {
  if (!token?.sub) return false;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { organizerId: true },
  });
  if (!event) return false;
  if (event.organizerId === token.sub) return true;
  const mgr = await prisma.eventManager.findUnique({
    where: { eventId_userId: { eventId, userId: token.sub } },
  });
  return Boolean(mgr);
}
