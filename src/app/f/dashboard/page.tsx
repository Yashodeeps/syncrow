"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { selectUser } from "@/utils/userSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useWallet } from "@solana/wallet-adapter-react";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import { BadgeCheck, BadgeX, RefreshCcw, Share } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import Verifytxn from "@/components/Verifytxn";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  return (
    <div className="p-4 flex justify-center  gap-2 h-full">
      <div className=" flex flex-col gap-3 w-2/3  ">
        <div className="bg-gray-900 bg-opacity-80 border border-gray-800  rounded-lg shadow-lg p-4">
          <div className="flex justify-between ">
            <div className="flex items-center gap-5">
              <Avatar className="">
                <AvatarImage src="/rsync.png" alt="@shadcn" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-semibold">{user.name}</h1>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={fetchReviews}
                variant={"outline"}
                className="flex items-center gap-2 text-purple-500"
              >
                <RefreshCcw />
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger>
                  <Button variant={"ghost"}>
                    {" "}
                    <Share className="text-purple-500" />
                  </Button>{" "}
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                      Anyone who has this link will be able to view this.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Link
                      </Label>
                      <Input
                        id="link"
                        defaultValue={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/f/profile/${user.id}`}
                        readOnly
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>{user.professional_title}</div>{" "}
        </div>

        <Tabs defaultValue="reviews" className="w-full h-full text-white ">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="request">Request review</TabsTrigger>
            <TabsTrigger value="verify">Verify reviews</TabsTrigger>
          </TabsList>
          <div className="bg-gray-900 bg-opacity-80 border border-gray-800  my-4  rounded-lg shadow-lg p-4">
            {" "}
            <TabsContent value="reviews">
              <div className="my-4 grid grid-cols-2 gap-3 mx-auto">
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
                          <div className="break-all text-xs font-normal">
                            {review.reviewer_address}
                          </div>
                        </div>
                        <div className="text-neutral-200 mt-4 relative z-20 text-sm">
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
                            {review.paymentVerified ? (
                              <li className="flex gap-2 items-center">
                                <BadgeCheck
                                  size={24}
                                  className="text-green-900"
                                />
                                Payment verified
                              </li>
                            ) : (
                              <li className="flex gap-2 items-center">
                                {" "}
                                <BadgeX size={24} className="text-red-800" />
                                Payment Not verified
                              </li>
                            )}
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
            <TabsContent value="request" className=" ">
              <div className="w-full flex gap-6 items-center  text-gray-200 justify-center">
                <div className="bg-gray-950 p-4 rounded-lg">
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
                <div className="flex justify-center items-center h-full w-full">
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
