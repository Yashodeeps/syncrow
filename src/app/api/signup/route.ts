import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();

  const { publicKey, name, title, skills } = await req.json();
  if (!publicKey || !name || !title || !skills) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { address: publicKey },
    });

    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET || "",
        { expiresIn: "7d" }
      );

      cookies().set("jwt", token);
      return NextResponse.json({ token: token });
    } else {
      const user = await prisma.user.create({
        data: {
          address: publicKey,
          name,
          professional_title: title,
          skills: skills,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: "error in your onboarding" },
          { status: 500 }
        );
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || "",
        {
          expiresIn: "7d",
        }
      );

      cookies().set("jwt", token);
      return NextResponse.json({ token: token, user: user });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "error in your onboarding" },
      { status: 500 }
    );
  }
}
