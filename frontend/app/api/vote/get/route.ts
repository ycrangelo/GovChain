import { NextResponse } from "next/server";
import prisma from "../../../../utils/connect";

// GET /api/voted?address=0x123...
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required." },
        { status: 400 }
      );
    }

    // ✅ Find all votes with this contractAddress
    const votes = await prisma.voted.findMany({
      where: {
        contractAddress: address,
      },
    });

    return NextResponse.json(votes, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching votes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
