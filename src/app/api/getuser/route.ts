import { dbconnect } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const prisma = await dbconnect();

  const user_id = new URL(req.url).searchParams.get("user_id");

  if (user_id === null) {
    throw new Error("user_id is null");
  }

  console.log("User ID:", user_id);

  if (user_id === null) {
    throw new Error("user_id is null");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        reviews: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
