import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest, res: NextResponse) {
  const prisma = await dbconnect();
  const walletAdress = "5XZYZjbVGF7r3MhE2hhmcfQkBnqFzbFtqoQHdHtcAq2j";

  const existingUser = await prisma.user.findUnique({
    where: {
      address: walletAdress,
    },
  });

  if (existingUser) {
    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET || "",
      { expiresIn: "7d" }
    );
    return NextResponse.json({ token });
  } else {
    const user = await prisma.user.create({
      data: {
        address: walletAdress,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    return NextResponse.json({ token });
  }
}
