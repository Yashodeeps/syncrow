"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@solana/wallet-adapter-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, BadgeX, CopyIcon, Share } from "lucide-react";

const Page = () => {
  const [email, setEmail] = useState<String | null>();
  const [user, setUser] = useState<User | null>(null);
  const { user_id } = useParams();

  if (!user_id) {
    alert("UserId required");
  }

  useEffect(() => {
    fetchUserProfile();
  }, []);

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

  interface User {
    id: string;
    address: string;
    name: string;
    professional_title: string;
    account: string;
    reviews: Review[];
  }

  async function fetchUserProfile() {
    console.log("User id", user_id);
    try {
      const response = await axios.get(`/api/getuser?user_id=${user_id}`);
      if (!response) {
        return new Error("User not found");
      }

      setUser(response.data.user);
    } catch (error) {
      console.log(error);
    }
  }

  console.log("User", user);

  if (user === null)
    return (
      <div className="flex justify-center items-center h-screen text-xl font-bold">
        {" "}
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4 flex justify-center items-center gap-2 h-full">
      <div className=" flex flex-col gap-3 w-2/3    30 h-full rounded-lg shadow-lg p-4">
        <div className="p-4 flex justify-between items-center rounded-lg my-2 bg-gray-900 bg-opacity-80 border border-gray-800">
          <div className="">
            <div className="flex gap-3 items-center">
              <Avatar>
                <AvatarImage src="/rsync.png" alt="@shadcn" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div className="">
                <h1 className="text-2xl font-semibold">{user.name}</h1>
              </div>
            </div>
            <div>{user.professional_title}</div>
          </div>{" "}
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

        <div className="p-4 rounded-lg bg-gray-900 bg-opacity-80 border border-gray-800">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold p-2 rounded-lg w-full text-center bg-gray-950">
              Reviews
            </h1>
          </div>

          {/* <div className="flex justify-center items-center">
            No Tokens request a review
          </div> */}

          <div className="my-4 grid grid-cols-2">
            {user.reviews &&
              user.reviews.map((review) => {
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
                      <span className="font-bold text-purple-600">Time: </span>{" "}
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
                            <BadgeCheck size={24} className="text-green-900" />
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
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
