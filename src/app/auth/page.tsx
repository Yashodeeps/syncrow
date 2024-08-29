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

function Page() {
  const { publicKey, signMessage } = useWallet();
  const [existingAccount, setExistingAccount] = useState<Boolean | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const signIn = useCallback(async () => {
    if (!publicKey || !signMessage) return;

    try {
      const message = new TextEncoder().encode(
        "Signing into gig chain, your decentralized review platform"
      );
      const signature = await signMessage(message);

      const response = await axios.post("http://localhost:3000/api/signin", {
        signature,
        publicKey: publicKey.toString(),
      });

      console.log("Signin successful:", response.data);
      dispatch(setUser(response.data.user));
      router.push("/dashboard");

      setExistingAccount(true);
    } catch (error) {
      setExistingAccount(false);
      console.error("Signin error:", error);
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    if (publicKey) {
      signIn();
    }
  }, [publicKey, signIn]);

  const handleOnboard = useCallback(async () => {
    if (!name || !title || !skills) {
      setError("All fields are required");

      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        publicKey: publicKey?.toString(),
        name,
        title,
        skills: skills.split(",").map((skill) => skill.trim()),
      });

      console.log("Onboarding successful:", response.data);
      dispatch(setUser(response.data.user));

      router.push("/dashboard");
      setExistingAccount(true);
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  }, [publicKey, name, title, skills]);

  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-4xl"
      >
        Join us to level up your freelancing game
        <div className="mt-10">
          <WalletMultiButton />
        </div>
      </motion.h1>
      {existingAccount === false && (
        <div className="flex flex-col items-center justify-center gap-4 mt-4 w-full h-screen ">
          <p className="font-semibold text-black py-1 bg-red-500 rounded-lg bg-opacity-50 px-4">
            No existing account.
          </p>
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
          <Button variant={"default"} onClick={handleOnboard}>
            On Board
          </Button>
        </div>
      )}
    </LampContainer>
  );
}

export default Page;
