import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuthToken } from "@/lib/auth/guards";

const prisma = new PrismaClient();

// 1. GET: Fetch all student reviews to display
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

// 2. POST: Submit a new review
export async function POST(req) {
  try {
    const token = await getAuthToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userName, rating, comment } = await req.json();

    if (!userName || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userEmail = token.email;

    const newReview = await prisma.review.create({
      data: {
        userName,
        userEmail,
        rating: parseInt(rating),
        comment,
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Post Review Error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}