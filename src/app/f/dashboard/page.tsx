"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/store";
import { sendReviewRequest } from "@/utils/sendReviewRequest";
import { selectUser } from "@/utils/userSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BadgeX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { verify } from "tweetnacl";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import Verifytxn from "@/components/Verifytxn";

const Page = () => {
  const user = useSelector(selectUser);
  const [email, setEmail] = useState<String | null>();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [projectDescription, setProjectDescription] = useState<String | null>(
    null
  );
  const [projectTime, setProjectTime] = useState<String | null>("");
  const [payout, setPayout] = useState<Number | null>(null);
  const [txnSignature, setTxnSignature] = useState<String | null>(null);
  const [name, setName] = useState<String | null>(null);
  const [isReviewRequestSent, setIsReviewRequestSent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<String | null>(
    null
  );

  console.log("txn s", txnSignature);

  interface Review {
    id: string;
    reviewer_address: string;
    name: string;
    projectDescription: string;
    feedback: string;
    projectBudget: string;
    updatedAt: string;
    projectTime: string;
    onChainHash: string;
    transactionSignature: string;
    paymentVerified: Boolean;
  }

  async function fetchReviews() {
    const response = await axios.get(`/api/reviews?user_id=${user.id}`);
    setReviews(response.data.reviews);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const sendRequest = async () => {
    if (
      !user ||
      !email ||
      !projectDescription ||
      !projectTime ||
      !payout ||
      !name
    ) {
      return alert("Please fill in all fields.");
    }
    console.log("Sending request...", {
      name,
      user,
      email,
      projectDescription,
      projectTime,
      payout,
      txnSignature,
    });

    try {
      const response = await axios.post("/api/request", {
        name,
        user,
        email,
        projectDescription,
        projectTime,
        payout,
        txnSignature,
      });
      console.log("Response:", response.data);
      setIsReviewRequestSent(true);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Error sending request");
      setIsReviewRequestSent(false);
    }
  };

  const unverifiedReviews = reviews?.filter(
    (review) => !review.paymentVerified
  );

  console.log("unverified", unverifiedReviews);

  const verifyTransaction = async (review: any) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const { reviewer_address } = review;
    console.log("Verifying transaction...");
    console.log("sender:", reviewer_address);

    if (!txnSignature || !wallet) {
      setVerificationStatus("Transaction ID or wallet not available");
      return;
    }

    try {
      const txInfo = await connection.getTransaction(txnSignature as string, {
        maxSupportedTransactionVersion: 1,
      });
      if (txInfo) {
        const { meta } = txInfo;
        if (meta?.err) {
          setVerificationStatus("Transaction failed");
          return;
        }
        console.log("Transaction:", txInfo);

        // Check if the transaction has the expected details
        //@ts-ignore
        const payer = new PublicKey(txInfo.transaction.message.accountKeys[0]);
        //@ts-ignore
        const receiver = new PublicKey(
          txInfo.transaction.message.accountKeys[1]
        );

        console.log("payer", payer.toString(), "receiver", receiver.toString());
        // Example verification logic
        if (
          receiver.toString() === wallet.publicKey?.toString() &&
          payer.toString() === reviewer_address
        ) {
          setVerificationStatus("Transaction verified successfully");
        } else {
          setVerificationStatus("Transaction verification failed");
        }
      } else {
        setVerificationStatus("Transaction not found");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setVerificationStatus("Error verifying transaction");
    }
  };

  return (
    <div className="p-4 flex justify-center  gap-2 h-full">
      <div className=" flex flex-col gap-3 w-2/3  ">
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar> */}
        <div className="bg-gray-900 bg-opacity-80 border border-gray-800  rounded-lg shadow-lg p-4">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <Button onClick={fetchReviews} variant={"outline"}>
              Refresh
            </Button>
          </div>
          <div>{user.professional_title}</div>{" "}
        </div>

        <Tabs defaultValue="reviews" className="w-full text-white ">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="request">Request review</TabsTrigger>
            <TabsTrigger value="verify">Verify reviews</TabsTrigger>
          </TabsList>
          <div className="bg-gray-900 bg-opacity-80 border border-gray-800  my-4  rounded-lg shadow-lg p-4">
            {" "}
            <TabsContent value="reviews">
              <div className="my-4 grid grid-cols-2 mx-auto">
                {reviews ? (
                  reviews.map((review) => {
                    return (
                      <CardSpotlight key={review.id} className=" w-96">
                        <div className=" relative z-20 mt-2 text-white flex flex-col gap-1">
                          <p className="text-xs">Reviewed by:</p>
                          <div className=" text-xl font-bold text-purple-600">
                            {" "}
                            {review.name}
                          </div>
                          <div className="break-all text-sm font-normal">
                            {review.reviewer_address}
                          </div>
                        </div>
                        <div className="text-neutral-200 mt-4 relative z-20">
                          <div>
                            {" "}
                            <span className="font-bold text-purple-600">
                              Description:{" "}
                            </span>{" "}
                            {review.projectDescription}
                          </div>
                        </div>
                        <div className="text-neutral-300  relative z-20 text-sm">
                          <span className="font-bold text-purple-600">
                            Time:{" "}
                          </span>{" "}
                          {review.projectTime}
                        </div>
                        <div className="text-neutral-300  relative z-20 text-sm">
                          <span className="font-bold text-purple-600">
                            Payout:{" "}
                          </span>{" "}
                          {review.projectBudget} SOL
                        </div>

                        <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                          <span className="font-bold text-purple-600">
                            Review:{" "}
                          </span>{" "}
                          {review.feedback}
                        </div>

                        <div className=" mt-4 bg-purple-500 text-black p-4 rounded-lg font-semibold  relative z-20 text-md">
                          <ul>
                            <li className="flex gap-2 py-2 items-center">
                              {" "}
                              <BadgeX size={16} />
                              On Chain hash{" "}
                            </li>
                            <li className="flex gap-2 items-center">
                              {" "}
                              <BadgeX size={16} />
                              Payment verified
                            </li>
                          </ul>{" "}
                        </div>

                        <div className="text-neutral-300 mt-4 relative z-20 text-xs text-end w-full">
                          {review.updatedAt}
                        </div>
                      </CardSpotlight>
                    );
                  })
                ) : (
                  <div>
                    <div>OOps No reviews</div>
                    <Button variant={"outline"}>Request review</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="request" className="w-1/2 ">
              <div className="w-full flex flex-col items-center justify-center">
                <div>
                  <div>
                    *Be responsible & only send requests to those who you have
                    worked with.
                  </div>

                  <div className="grid gap-4 py-4">
                    {" "}
                    <div className="flex justify-between gap-3">
                      {" "}
                      {/* mail */}
                      <div className="flex flex-col  gap-4">
                        <Label htmlFor="email" className="">
                          Client email
                        </Label>
                        <Input
                          id="email"
                          value={email?.toString()}
                          className="col-span-4 w-full"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {/* name */}
                      <div className="flex flex-col  gap-4">
                        <Label htmlFor="name" className="">
                          Client name
                        </Label>
                        <Input
                          id="name"
                          value={name?.toString()}
                          className="col-span-4 w-full"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>
                    {/* detail */}
                    <div className="flex flex-col gap-4">
                      <Label htmlFor="description" className="">
                        Project Description
                      </Label>
                      <Textarea
                        id="description"
                        value={projectDescription?.toString()}
                        placeholder="..."
                        className="col-span-4 w-full"
                        onChange={(e) => setProjectDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between gap-2">
                      {" "}
                      {/* time */}
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="time" className="">
                          Project Time
                        </Label>
                        <div></div>
                        <Input
                          id="time"
                          value={projectTime?.toString()}
                          className="col-span-4 w-full"
                          placeholder="2 days"
                          onChange={(e) => setProjectTime(e.target.value)}
                        />{" "}
                      </div>
                      {/* payout */}
                      <div className="flex flex-col  gap-4">
                        <Label htmlFor="payout" className="">
                          Payout
                        </Label>
                        <Input
                          id="payout"
                          value={payout?.toString()}
                          placeholder="2"
                          className="col-span-4 w-full"
                          type="number"
                          onChange={(e) => setPayout(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Button type="submit" onClick={sendRequest}>
                      Send
                    </Button>
                  </div>
                </div>
                <div>
                  {isReviewRequestSent && (
                    <div className="text-green-500">Request sent</div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="verify">
              <div className="flex gap-4">
                {unverifiedReviews ? (
                  unverifiedReviews.map((review) => (
                    <CardSpotlight key={review.id} className=" w-96">
                      <div className=" relative z-20 mt-2 text-white flex flex-col gap-1">
                        <p className="text-xs">Reviewed by:</p>
                        <div className=" text-xl font-bold text-purple-600">
                          {" "}
                          {review.name}
                        </div>
                        <div className="break-all text-sm font-normal">
                          {review.reviewer_address}
                        </div>
                      </div>
                      <div className="text-neutral-200 mt-4 relative z-20">
                        <div>
                          {" "}
                          <span className="font-bold text-purple-600">
                            Description:{" "}
                          </span>{" "}
                          {review.projectDescription}
                        </div>
                      </div>
                      <div className="text-neutral-300  relative z-20 text-sm">
                        <span className="font-bold text-purple-600">
                          Time:{" "}
                        </span>{" "}
                        {review.projectTime}
                      </div>
                      <div className="text-neutral-300  relative z-20 text-sm">
                        <span className="font-bold text-purple-600">
                          Payout:{" "}
                        </span>{" "}
                        {review.projectBudget} SOL
                      </div>

                      <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                        <span className="font-bold text-purple-600">
                          Review:{" "}
                        </span>{" "}
                        {review.feedback}
                      </div>

                      {/* <div className=" mt-4 bg-gray-500 flex flex-col  justify-center gap-3 p-4 rounded-lg font-semibold  relative z-20 text-md">
                        <div>
                          <Label htmlFor="hash">Transaction Signature</Label>
                          <Input
                            id="hash"
                            placeholder="..."
                            onChange={(e) => {
                              setTxnSignature(e.target.value);
                            }}
                          />
                        </div>
                        <Button
                          variant={"outline"}
                          onClick={() => verifyTransaction(review)}
                        >
                          Verify
                        </Button>
                        <p className="text-purple-950">{verificationStatus}</p>
                      </div> */}
                      <Verifytxn review={review} />

                      <div className="text-neutral-300 mt-4 relative z-20 text-xs text-end w-full">
                        {review.updatedAt}
                      </div>
                    </CardSpotlight>
                  ))
                ) : (
                  <div>No reviews to verify</div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div></div>
      </div>
    </div>
  );
};

export default Page;
