import { dbconnect } from "@/lib/prisma";
import { UUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const prisma = await dbconnect();
  const user_id = new URL(req.url).searchParams.get("user_id");
  console.log("User ID:", user_id);

  try {
    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    const reviews = await prisma.reviews.findMany({
      where: { user_id },
    });
    if (!reviews) {
      return NextResponse.json({ reviews: [] });
    }

    return NextResponse.json({ reviews: reviews });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
