import { dbconnect } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const prisma = await dbconnect();

  try {
    const allFreelancers = await prisma.user.findMany({
      where: {
        account: "FREELANCER",
      },
    });

    if (!allFreelancers) {
      return NextResponse.json(
        { message: "No freelancers found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ freelancers: allFreelancers });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
