"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { sign } from "crypto";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const [reviewSent, setReviewSent] = useState(false);

  const { publicKey } = useWallet();

  const { id } = useParams();
  if (!id) return null;

  async function getUser() {
    return null;
  }

  async function sendReview() {
    if (!name || !job || !review || !publicKey) {
      setError("Please fill all the fields");
      return;
    }

    const response = await axios.post("/api/send-review", {
      publicKey,
      name,
      job,
      review,
      id,
    });

    if (!response) {
      setError("Error creating review");
    }
    console.log("review res", response);
    setReviewSent(true);
  }

  return (
    <div className="max-h-screen">
      <BackgroundBeamsWithCollision>
        {!reviewSent ? (
          <div className="flex flex-col items-center justify-center h-[40rem] gap-4 ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xl   ">
              Drop a <span className="text-purple-500 font-bold">Review</span>
            </p>
            <WalletMultiButton />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">
                {" "}
                <span className="text-red-500">*</span> Name
              </Label>
              <Input
                type="text"
                id="name"
                placeholder="Daemon Targerian"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="job">
                {" "}
                <span className="text-red-500">*</span> Job title of the
                freelancer{" "}
              </Label>
              <Input
                type="text"
                id="job"
                placeholder="A solana DAPP"
                onChange={(e) => setJob(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="review">
                {" "}
                <span className="text-red-500">*</span> Review
              </Label>
              <Textarea
                id="review"
                placeholder="..."
                onChange={(e) => setReview(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs sm:text-sm">{error}</p>
            )}

            <Button onClick={sendReview}>Send</Button>
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
