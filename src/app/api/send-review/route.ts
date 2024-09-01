import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const { publicKey, name, job, review, id } = await req.json();
  if (!publicKey || !name || !job || !review) {
    return NextResponse.json(
      { error: "Please fill all the fields" },
      { status: 400 }
    );
  }

  try {
    const newReview = await prisma.reviews.create({
      data: {
        reviewer_address: publicKey,
        name,
        job,
        review,
        user_id: id,
        nft: "",
      },
    });
    if (!newReview) {
      return NextResponse.json(
        { error: "Error creating new review" },
        { status: 500 }
      );
    }
    return NextResponse.json({ Review: newReview });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating review" },
      { status: 500 }
    );
  }
}
