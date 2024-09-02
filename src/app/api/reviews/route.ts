import { dbconnect } from "@/lib/prisma";
import { clusterApiUrl, Connection, Transaction } from "@solana/web3.js";
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

export async function PUT(req: NextRequest) {
  const prisma = await dbconnect();
  const { publicKey, feedback, rating, serializedTransaction } =
    await req.json();
  const reviewId = new URL(req.url).searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json(
      { error: "Review ID is required" },
      { status: 400 }
    );
  }
  if (!publicKey || !feedback || !rating) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    //get review

    const review = await prisma.reviews.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const updatedReview = await prisma.reviews.update({
      where: { id: review.id },
      data: {
        reviewer_address: publicKey,
        feedback: feedback,
        rating,
      },
    });

    if (!updatedReview) {
      return NextResponse.json(
        { error: "Error updating review" },
        { status: 500 }
      );
    }

    // // Connect to Solana
    // const connection = new Connection(
    //   "https://api.devnet.solana.com",
    //   "confirmed"
    // );

    // // Deserialize the transaction from the client
    // const transaction = Transaction.from(
    //   Buffer.from(serializedTransaction, "base64")
    // );

    // console.log("Transaction:");

    // // Send the transaction to the blockchain
    // const transactionSignature = await connection.sendRawTransaction(
    //   transaction.serialize()
    // );

    // console.log("Transaction Signature:", transactionSignature);

    // const confirmationStrategy = {
    //   signature: transactionSignature,
    //   blockhash: transaction.recentBlockhash!,
    //   lastValidBlockHeight: (await connection.getBlockHeight()) + 100, // Or use a specific block height strategy
    // };

    // await connection.confirmTransaction(confirmationStrategy);

    // const finalReviewUpdate = await prisma.reviews.update({
    //   where: { id: review.id },
    //   data: {
    //     transactionSignature: transactionSignature,
    //   },
    // });

    // if (!finalReviewUpdate) {
    //   return NextResponse.json(
    //     { error: "Error updating review" },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({
      review: updatedReview,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to SUBMIT A REVIEW" },
      { status: 500 }
    );
  }
}
