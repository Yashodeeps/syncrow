import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const prisma = await dbconnect();
  const reviewId = new URL(req.url).searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json(
      { error: "Review ID is required" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.reviews.findUnique({
      where: { id: reviewId, reviewer_address: undefined },
    });

    if (!review) {
      return NextResponse.json({ review: {} });
    }

    return NextResponse.json({ review: review });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}
