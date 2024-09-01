"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { LampContainer } from "@/components/ui/lamp";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();

  async function freelancerAuth() {
    router.push("/auth/freelancer");
  }

  async function clientAuth() {
    router.push("/auth/client");
  }

  const words = [
    {
      text: "Centralized",
    },
    {
      text: "all",
    },
    {
      text: "your",
    },
    {
      text: "Reviews",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];
  return (
    <div className="h-screen">
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
          <div className="flex flex-col items-center justify-center  ">
            <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
              The{" "}
              <span className="text-purple-800 font-bold">Decentralized</span>{" "}
              way to
            </p>
            <TypewriterEffectSmooth words={words} />
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
              <button
                onClick={freelancerAuth}
                className="w-40 h-10 rounded-xl bg-white text-black border dark:border-white border-transparent  text-sm"
              >
                Join Now
              </button>
            </div>
          </div>
        </motion.h1>
      </LampContainer>{" "}
    </div>
  );
}
