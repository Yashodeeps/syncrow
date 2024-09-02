"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import axios from "axios";
import { sign } from "crypto";
import { Loader2Icon, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const [feedback, setFeedback] = useState<String | null>();
  const [rating, setRating] = useState<Number | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewProject, setReviewProject] = useState<any>(null);

  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const { user_id, reviewId } = useParams();

  useEffect(() => {
    getReview();
  }, []);

  const handleRating = (value: any) => {
    setRating(value);
  };

  console.log("rating", rating);

  async function getReview() {
    try {
      const response = await axios.get(`/api/getreview?reviewId=${reviewId}`);
      if (!response) {
        setError("NO Valid Review");
      }

      setReviewProject(response.data.review);
    } catch (error) {}
  }

  if (!reviewProject)
    return (
      <div className="h-screen fles justify-center items-center animate-spin">
        <Loader2Icon />
      </div>
    );

  async function sendReview() {
    if (!publicKey) {
      setError("Please connect your wallet");
      return;
    }
    if (!feedback || !rating) {
      setError("Please fill all the fields");
      return;
    }

    const serializedTransaction = await signTxn();

    const response = await axios.put(`/api/reviews?reviewId=${reviewId}`, {
      publicKey,
      feedback,
      rating,
      serializedTransaction,
    });

    if (!response) {
      setError("Error creating review");
    }

    console.log("review res", response);
    setReviewSent(true);
  }

  async function signTxn() {
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("finalized");

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(publicKey || ""),
        toPubkey: new PublicKey(publicKey || ""),
        lamports: 0,
      })
    );

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(publicKey || "");

    if (!signTransaction) {
      throw new Error(
        "Transaction signing is not supported by the connected wallet"
      );
    }
    const signedTransaction = await signTransaction(transaction);

    const serializedTransaction = signedTransaction
      .serialize()
      .toString("base64");

    return serializedTransaction;
  }

  return (
    <div className="max-h-screen">
      <BackgroundBeamsWithCollision>
        {!reviewSent ? (
          <div className="flex flex-col items-center justify-center h-[40rem] gap-4 w-screen">
            <p className="text-neutral-600 dark:text-neutral-200 text-xl   ">
              Hello{" "}
              <span className="text-purple-500 font-bold">
                {reviewProject.name}
              </span>
              , You have been requested to review the follwoing project
            </p>
            <div className="flex gap-8 justify-center items-center w-full">
              <div className="w-1/3">
                <CardSpotlight className="w-full">
                  <p className="font-bold relative z-20 mt-2 text-white">
                    <div className="">
                      Project Description:{" "}
                      <span className="text- font-normal">
                        {reviewProject.projectDescription}
                      </span>
                    </div>
                  </p>
                  <div className="text-neutral-200 mt-4 relative z-20">
                    <div>
                      <span className="font-bold">Project Time:</span>{" "}
                      {reviewProject.projectTime}
                    </div>
                  </div>
                  <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                    <span className="font-bold">Payout:</span>{" "}
                    {reviewProject?.projectBudget} SOL
                  </div>
                  <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                    <span className="font-bold">Transaction:</span>{" "}
                    {reviewProject?.transactionSignature}
                  </div>
                </CardSpotlight>
              </div>
              <div className="flex flex-col gap-5 w-1/3">
                <WalletMultiButton />
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="review">
                    <span className="text-red-500">*</span> Review
                  </Label>
                  <Textarea
                    id="review"
                    placeholder="..."
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="rating">
                    <span className="text-red-500">*</span> Rating
                  </Label>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`cursor-pointer ${
                            value <= (rating as number)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleRating(value)}
                        />
                      ))}
                    </div>
                    <Button onClick={sendReview}>Send</Button>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs sm:text-sm">{error}</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[40rem] gap-4 ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xl   ">
              Review sent
            </p>
          </div>
        )}
      </BackgroundBeamsWithCollision>
    </div>
  );
}
