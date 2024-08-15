import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();

  const { publicKey, signature } = await req.json();

  const signedString = `Sign into the escrow chain one of the services of cosync labs`;
  const message = new TextEncoder().encode(signedString);

  const result = nacl.sign.detached.verify(
    message,
    new Uint8Array(signature.data),
    new PublicKey(publicKey).toBytes()
  );

  if (!result) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      address: publicKey,
    },
  });

  if (existingUser) {
    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );

    cookies().set("jwt", token);

    return NextResponse.json({ token });
  } else {
    const user = await prisma.user.create({
      data: {
        address: publicKey,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    cookies().set("jwt", token);

    return NextResponse.json({ token });
  }
}
