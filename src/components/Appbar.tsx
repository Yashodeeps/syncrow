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
  return (
    <div className="p-4 border-b flex justify-between">
      <div className="px-2 text-xl font-semibold">RSync</div>
      <div></div>
    </div>
  );
};

export default Appbar;
