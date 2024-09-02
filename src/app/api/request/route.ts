import { dbconnect } from "@/lib/prisma";
import { sendReviewRequest } from "@/utils/sendReviewRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const {
    user,
    email,
    projectDescription,
    projectTime,
    payout,
    txnSignature,
    name,
  } = await req.json();
  const reviewLink = `${process.env.DOMAIN_URL}/review/${user.id}`;
  console.log("Review link:", reviewLink);

  if (
    !user ||
    !email ||
    !projectDescription ||
    !projectTime ||
    !payout ||
    !name
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newReview = await prisma.reviews.create({
      data: {
        user_id: user.id,
        projectDescription,
        projectTime,
        projectBudget: payout,
        transactionSignature: txnSignature,
        name,
      },
    });

    if (!newReview) {
      return NextResponse.json(
        { error: "Error creating new review" },
        { status: 500 }
      );
    }

    const emailResponse = await sendReviewRequest(
      email,
      user.name,
      `${process.env.DOMAIN_URL}/review/${user.id}/${newReview.id}`
    );
    console.log("Email response:", emailResponse);
    if (!emailResponse.success) {
      return NextResponse.json(
        { error: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      Review: newReview,
      message: "Review request sent",
    });
  } catch (error) {
    console.error("Error sending review request:", error);
    return NextResponse.json(
      { error: "Error sending review request" },
      { status: 500 }
    );
  }
}
