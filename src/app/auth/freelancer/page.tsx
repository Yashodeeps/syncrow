"use client";
import React, { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { useWallet } from "@solana/wallet-adapter-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/utils/userSlice";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { set } from "@metaplex-foundation/umi/serializers";
import { LoaderCircle } from "lucide-react";
import { Enum } from "@solana/web3.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@radix-ui/react-separator";

function Page() {
  const { publicKey, signMessage } = useWallet();
  const [existingAccount, setExistingAccount] = useState<Boolean | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [account, setAccount] = useState<accountType>("FREELANCER");

  console.log("account", account);

  type accountType = "FREELANCER" | "CLIENT";

  const router = useRouter();
  const dispatch = useDispatch();

  const signIn = useCallback(async () => {
    if (!publicKey || !signMessage) return;

    setIsOnboarding(true);

    try {
      const message = new TextEncoder().encode(
        "Signing into gig chain, your decentralized review platform"
      );
      const signature = await signMessage(message);

      const response = await axios.post("/api/signin", {
        signature,
        publicKey: publicKey.toString(),
      });

      setIsLoading(true);
      console.log("Signin successful:", response.data);
      dispatch(setUser(response.data.user));

      response.data.user.account === "FREELANCER"
        ? router.push("/f/dashboard")
        : router.push("/f/clientboard");

      setExistingAccount(true);
    } catch (error) {
      setExistingAccount(false);
      console.error("Signin error:", error);
    } finally {
      setIsLoading(false);
      setIsOnboarding(false);
    }
  }, [publicKey, signMessage]);

  const handleOnboard = useCallback(async () => {
    if (!name || !title || !skills) {
      setError("All fields are required");

      return;
    }

    setIsOnboarding(true);

    try {
      const response = await axios.post("/api/signup", {
        publicKey: publicKey?.toString(),
        name,
        title,
        skills: skills.split(",").map((skill) => skill.trim()),
        account,
      });
      setIsLoading(true);

      console.log("Onboarding successful:", response.data);
      dispatch(setUser(response.data.user));

      response.data.user.account === "FREELANCER"
        ? router.push("/f/dashboard")
        : router.push("/f/clientboard");
      setExistingAccount(true);
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
      setIsOnboarding(false);
    }
  }, [publicKey, name, title, skills]);

  if (isLoading === true) {
    return (
      <BackgroundBeamsWithCollision>
        <div className="flex flex-col justify-center gap-3 items-center">
          Logging you in!!!
          <LoaderCircle className="animate-spin" size={50} />
        </div>
      </BackgroundBeamsWithCollision>
    );
  }

  return (
    <BackgroundBeamsWithCollision>
      <div
        className={
          isLoading
            ? "flex flex-col justify-center items-center blur-md"
            : "flex flex-col justify-center items-center"
        }
      >
        <div className="flex flex-col items-center justify-center">
          <div className="text-3xl font-semibold ">
            {" "}
            Join us to level up your freelancing game
          </div>
          <div className="mt-10 flex   justify-center items-center gap-10">
            <div className="flex flex-col gap-4">
              <p>Connect your wallet:</p>
              <WalletMultiButton />
              <Button onClick={signIn}>
                {isOnboarding ? "Signing in..." : "Sign in"}
              </Button>
            </div>
            <Separator orientation="vertical" className="bg-gray-500" />
            {existingAccount === false && (
              <div className="w-full">
                <p className="font-semibold text-purple-600 py-1  rounded-lg bg-opacity-50 px-4">
                  No existing account.
                </p>
                <RadioGroup
                  defaultValue="FREELANCER"
                  onValueChange={(value: accountType) => setAccount(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FREELANCER" id="r1" />
                    <Label htmlFor="r1">Freelancer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CLIENT" id="r2" />
                    <Label htmlFor="r2">Client</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>
          {existingAccount === false && (
            <div className="flex  items-center  justify-center gap-4 mt-4  w-full ">
              <div className="w-full flex flex-col justify-center items-center gap-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="name">
                    <span className="text-red-500">*</span>Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Jon Snow"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="title">
                    <span className="text-red-500">*</span>Professional Title
                  </Label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Lord commander of nights watch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="skills">
                    <span className="text-red-500">*</span>
                    {`Skills: separated by [ , ]`}
                  </Label>
                  <Input
                    type="text"
                    id="skills"
                    placeholder="sword fighting, leadership, brooding"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm font-semibold">{error}</p>
                )}
                <div className="flex gap-4 items-center justify-center">
                  <Button variant={"default"} onClick={handleOnboard}>
                    {isOnboarding ? "Onboarding..." : "Onboard"}
                  </Button>
                  OR
                  <Button variant={"outline"} onClick={signIn}>
                    {isOnboarding ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export default Page;
