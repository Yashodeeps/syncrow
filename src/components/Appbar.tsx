"use client";

import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import axios from "axios";
import { NodeErrorOptions } from "postcss";
import { ErrorProps } from "next/error";

const Appbar = () => {
  const { publicKey, signMessage } = useWallet();

  const signAndSend = async () => {
    if (!publicKey) return;
    const message = new TextEncoder().encode(
      "Sign into the escrow chain one of the services of cosync labs"
    );
    const signature = await signMessage?.(message);
    console.log(signature);
    try {
      const response = await axios.post("http://localhost:3000/api/signin", {
        signature,
        publicKey: publicKey?.toString(),
      });
    } catch (error: any) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    signAndSend();
  }, [publicKey]);

  return (
    <div className="p-4 border-b flex justify-between">
      <div className="px-2 text-xl font-semibold">Excrow Chain</div>
      {publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}
    </div>
  );
};

export default Appbar;
