"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import axios from "axios";

const Verifytxn = (review: any) => {
  const { reviewer_address, id } = review.review;
  console.log("reviewer_address", review);
  const [txnSignature, setTxnSignature] = useState<String | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<String | null>(
    null
  );
  const wallet = useWallet();
  const [isVerified, setIsVerified] = useState(false);

  const verifyTransaction = async (review: any) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

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
          //@ts-ignore
          txInfo.transaction.message.accountKeys[1]
        );

        console.log("payer", payer.toString(), "receiver", receiver.toString());
        // Example verification logic
        if (
          receiver.toString() === wallet.publicKey?.toString() &&
          payer.toString() === reviewer_address
        ) {
          setVerificationStatus("Transaction verified successfully");
          console.log("id", id);
          const response = await axios.put(`/api/updatereview?reviewId=${id}`);
          if (!response) {
            setVerificationStatus("DB error to update verification status");
          }
          setIsVerified(true);
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
    <div className=" mt-4 bg-gray-900 shadow-lg flex flex-col  justify-center gap-3 p-4 rounded-lg font-semibold  relative z-20 text-md">
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
      <Button variant={"outline"} onClick={verifyTransaction}>
        Verify
      </Button>
      {verificationStatus && (
        <p className="text-purple-600 border border-gray-400 p-4 rounded-lg">
          {verificationStatus}
        </p>
      )}
    </div>
  );
};

export default Verifytxn;
