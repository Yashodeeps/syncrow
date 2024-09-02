"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { selectUser } from "@/utils/userSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
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
    review: string;
    job: string;
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
      <div className=" flex flex-col gap-3 w-2/3  bg-gray-900 bg-opacity-80 border border-gray-800  30 h-full rounded-lg shadow-lg p-4">
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar> */}
        <div className="flex justify-between items-center">
          <div className="">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <div>{user.professional_title}</div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Drop a Review</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Send Request</DialogTitle>
                <DialogDescription>
                  *Be responsible & only send requests to those who you have
                  worked with.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="">
                    email
                  </Label>
                  <Input
                    id="email"
                    value={email?.toString()}
                    className="col-span-4 w-full"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>{" "}
        </div>

        <Separator className="bg-slate-300" />
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Reviews</h1>
          </div>

          {/* <div className="flex justify-center items-center">
            No Tokens request a review
          </div> */}

          <div className="my-4 ">
            {user.reviews &&
              user.reviews.map((review) => {
                return (
                  <CardSpotlight key={review.id} className="h-96 w-96">
                    <p className="text-xl font-bold relative z-20 mt-2 text-white">
                      <div className="font-bold text-xl">{review.name}</div>
                      <div className="break-all text-sm font-normal">
                        {" "}
                        {review.reviewer_address}
                      </div>
                    </p>
                    <div className="text-neutral-200 mt-4 relative z-20">
                      <div>Project: {review.job}</div>
                    </div>
                    <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                      Review: {review.review}
                    </div>

                    <div className="text-neutral-300 mt-4 relative z-20 text-sm">
                      <ul>
                        <li>On Chain hash </li>
                        <li>Payment verified</li>
                      </ul>{" "}
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
