import { sendReviewRequest } from "@/utils/sendReviewRequest";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { user, email } = await req.json();
  const reviewLink = `${process.env.DOMAIN_URL}/review/${user.id}`;
  console.log("Review link:", reviewLink);

  if (!user || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  try {
    const emailResponse = await sendReviewRequest(email, user.name, reviewLink);
    console.log("Email response:", emailResponse);
    if (!emailResponse.success) {
      return NextResponse.json(
        { error: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Review request sent" });
  } catch (error) {
    console.error("Error sending review request:", error);
    return NextResponse.json(
      { error: "Error sending review request" },
      { status: 500 }
    );
  }
}
