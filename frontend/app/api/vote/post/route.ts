
import { NextResponse } from "next/server";
import prisma from "../../../../utils/connect";

// creating a proposal project
export async function POST(req: Request) {
  try {
    const { nftId, contractAddress } = await req.json();

    // ✅ Check if all required fields are filled
    if (!contractAddress || !nftId) {
      return NextResponse.json(
        { error: "All fields (contractAddress, nftId) are required." },
        { status: 400 }
      );
    }
    const newVote = await prisma.voted.create({
      data: {
        contractAddress,
        nftId
      },
    });

    return NextResponse.json(newVote, { status: 201 });
  } catch (error: any) {
    console.error("Error creating approver:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
