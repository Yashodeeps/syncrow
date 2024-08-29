import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { cookies } from "next/headers";
import { use } from "react";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();

  const { publicKey, signature } = await req.json();

  const signedString = `Signing into gig chain, your decentralized review platform`;
  const message = new TextEncoder().encode(signedString);

  // Ensure the signature is a Uint8Array of the correct size
  const signatureArray = new Uint8Array(Object.values(signature));
  if (signatureArray.length !== 64) {
    return NextResponse.json(
      { error: "Invalid signature size" },
      { status: 400 }
    );
  }

  const result = nacl.sign.detached.verify(
    message,
    signatureArray,
    new PublicKey(publicKey).toBytes()
  );

  if (!result) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Continue with your existing logic
  try {
    const existingUser = await prisma.user.findUnique({
      where: { address: publicKey },
    });

    if (existingUser) {
      const token = jwt.sign(
        {
          userId: existingUser.id,
        },
        process.env.JWT_SECRET || "",
        { expiresIn: "7d" }
      );

      cookies().set("jwt", token);
      return NextResponse.json({ token: token, user: existingUser });
    } else {
      return NextResponse.json(
        { error: "No existing account." },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "error in your onboarding" },
      { status: 500 }
    );
  }
  //  else {
  //   const user = await prisma.user.create({
  //     data: { address: publicKey },
  //   });

  //   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "", {
  //     expiresIn: "7d",
  //   });

  //   cookies().set("jwt", token);
  //   return NextResponse.json({ token });
  // }
}
