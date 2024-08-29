"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();

  async function handleJoin() {
    router.push("/auth");
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
    <div className="max-h-screen">
      <BackgroundBeamsWithCollision>
        <div className="flex flex-col items-center justify-center h-[40rem] ">
          <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
            The <span className="text-purple-500 font-bold">Decentralized</span>{" "}
            way to
          </p>
          <TypewriterEffectSmooth words={words} />
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
            <button
              onClick={handleJoin}
              className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm"
            >
              Join now
            </button>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}
