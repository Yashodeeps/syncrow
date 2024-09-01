"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/lib/store";
import { sendReviewRequest } from "@/utils/sendReviewRequest";
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

import Rsync from "../../public/RSync.png";

import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  createMint,
  createMintToInstruction,
  getOrCreateAssociatedTokenAccount,
  MintLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createV1, fetchAssetV1, mplCore } from "@metaplex-foundation/mpl-core";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { sign } from "crypto";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const Page = () => {
  const user = useSelector(selectUser);
  const [email, setEmail] = useState<String | null>();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const wallet = useWallet();
  const [isCreating, setIsCreating] = useState(false);

  interface Review {
    id: string;
    reviewer_address: string;
    name: string;
    job: string;
    review: string;
  }

  async function fetchReviews() {
    const response = await axios.get(`/api/reviews?user_id=${user.id}`);
    setReviews(response.data.reviews);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  const sendRequest = async () => {
    if (!user || !email) {
      return;
    }
    const response = await axios.post("/api/request", {
      user,
      email,
    });
    console.log("Response:", response.data);
  };

  const createTokenWithMetadata = async ({
    name,
    job,
    review,
    reviewer_address,
  }: any) => {
    const connection = new Connection(
      "https://solana-devnet.g.alchemy.com/v2/jblqSWWJUw0HLACQTavTfXtwP1Gj8vRy"
    );
    if (!wallet.publicKey || !wallet.signTransaction) {
      console.log("Wallet not connected");
      return;
    }

    console.log("Creating token with metadata...", {
      name,
      job,
      review,
      reviewer_address,
    });

    setIsCreating(true);

    try {
      // Initialize Metaplex
      const metaplex = Metaplex.make(connection).use(
        walletAdapterIdentity(wallet)
      );

      const imageBuffer = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==",
        "base64"
      );
      const file = toMetaplexFile(imageBuffer, "image.png");

      // Prepare the metadata
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: "My NFT",
        description: "This is my first NFT!",
        image: file, // Replace with your image URL
      });

      // Create the NFT
      const { nft } = await metaplex.nfts().create({
        uri: uri,
        name: "My NFT",
        sellerFeeBasisPoints: 500, // 5% royalty
      });

      console.log("Token created successfully with metadata.");
      console.log("Mint address:", nft.address.toString());
      console.log("Metadata address:", nft.metadataAddress.toString());
      console.log("Metadata URI:", uri);
    } catch (error) {
      console.error("Error creating token with metadata:", error);
    }
  };

  const mintNFT = async ({ review }: any) => {
    const connection = new Connection("https://api.devnet.solana.com");
    if (!wallet.publicKey || !wallet.signTransaction) {
      console.log("Wallet not connected");
      return;
    }

    try {
      // Create mint account
      const mintAccount = Keypair.generate();

      // Get the minimum balance for rent exemption
      const mintRent = await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      );

      // Create transaction for token creation
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintAccount.publicKey,
          space: MintLayout.span,
          lamports: mintRent,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintAccount.publicKey,
          0,
          wallet.publicKey,
          wallet.publicKey,
          TOKEN_PROGRAM_ID
        )
      );

      // Sign and send the transaction
      transaction.feePayer = wallet.publicKey;
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      const signedTx = await wallet.signTransaction(transaction);

      signedTx.partialSign(mintAccount);

      const txid = await connection.sendRawTransaction(signedTx.serialize());
      const confirmationStrategy = {
        signature: txid,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
      };
      const confirmation = await connection.confirmTransaction(
        confirmationStrategy
      );
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }
      console.log(
        "Token created successfully. Mint address:",
        mintAccount.publicKey.toBase58()
      );
    } catch (error) {
      console.error("Error creating token:", error);
    }
  };

  //

  const CreateNFT = async ({ review }: any) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      alert("Wallet not connected");
    }

    const umi = createUmi("https://api.devnet.solana.com")
      .use(mplCore())
      .use(irysUploader());
    umi.use(walletAdapterIdentity(wallet));

    const signer = generateSigner(umi);
    umi.use(signerIdentity(signer));

    console.log("signer", signer);
    //@ts-ignore
    console.log("Wallet balance:", await umi.rpc.getBalance(wallet.publicKey));

    const imageResponse = await fetch("/rsync.png");
    const imageBlob = await imageResponse.blob();

    // Create a generic file from the blob
    const umiImageFile = createGenericFile(
      new Uint8Array(await imageBlob.arrayBuffer()),
      "image.png",
      { contentType: "image/png" }
    );

    setIsCreating(true);

    console.log("Uploading Image...");
    const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
      throw new Error(`Failed to upload image: ${err.message}`);
    });

    console.log("imageUri:", imageUri[0]);

    const metadata = {
      name: "RSync NFT",
      description: "Review Bound NFT",
      image: "localhost:3000/rsync.png",
      attributes: [
        {
          trait_type: "address",
          value: review.reviewer_address,
        },
        {
          trait_type: "name",
          value: review.name,
        },
        {
          trait_type: "job",
          value: review.job,
        },
        {
          trait_type: "review",
          value: review.review,
        },
      ],
      properties: {
        files: [
          {
            uri: imageUri[0],
            type: "image/jpeg",
          },
        ],
        category: "image",
      },
    };

    console.log("Uploading Metadata...");
    const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
      throw new Error(err);
    });

    const nftSigner = generateSigner(umi);

    const result = createV1(umi, {
      asset: nftSigner,
      name: "RSync",
      uri: metadataUri,
    }).sendAndConfirm(umi);

    console.log("NFT created:", result);
    setIsCreating(false);
  };

  return (
    <div className="p-4 flex justify-center items-center gap-2 h-full">
      <div className=" flex flex-col gap-3 w-1/2 bg-zinc-800 h-full rounded-lg shadow-lg p-4">
        {/* <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>RS</AvatarFallback>
        </Avatar> */}
        <div>
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <Button variant={"outline"}>Edit</Button>
          </div>
          <div>{user.professional_title}</div>
        </div>
        <Separator className="bg-slate-300" />
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Tokens</h1>
            {/* <Button onClick={sendRequest}>Request Review</Button> */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">Request Review</Button>
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
                  <Button type="submit" onClick={sendRequest}>
                    Send
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-center items-center">
            No Tokens request a review
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-1/5 bg-zinc-800 min-h-44  rounded-lg shadow-lg p-4">
        <h1 className="font-semibold">New Reviews</h1>
        <p className="cursor-pointer text-sm" onClick={fetchReviews}>
          Refresh
        </p>

        <div className="my-4">
          {reviews &&
            reviews.map((review) => {
              return (
                <div
                  key={review.id}
                  className="border-[0.5px] bg-zinc-900  border-gray-500 rounded-lg p-4 = "
                >
                  {/* <div className="text-wrap">{review.reviewer_address}</div> */}
                  <div className="font-bold text-xl">{review.name}</div>
                  <div>Job: {review.job}</div>
                  <Separator className="bg-slate-300" />
                  <div>{review.review}</div>
                  {/* 
                  <Button variant="outline" className="my-2" onClick={mintNFT}>
                    Mint NFT
                  </Button> */}
                  <Button
                    variant="outline"
                    className="my-2"
                    onClick={() => CreateNFT(review)}
                  >
                    {isCreating ? "Creating..." : "mint Token with Metadata"}
                  </Button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Page;
