import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const reviewId = new URL(req.url).searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json(
      { error: "Review ID is required" },
      { status: 400 }
    );
  }

  try {
    const review = await prisma.reviews.update({
      where: { id: reviewId },
      data: {
        paymentVerified: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ verified: true, review: review });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}
