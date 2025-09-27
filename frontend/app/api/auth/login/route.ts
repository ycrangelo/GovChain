import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    // Diretso gawa JWT kahit ano pa laman
    const token = jwt.sign(
      { walletAddress: walletAddress?.toLowerCase() },
      JWT_SECRET,
      { expiresIn: "1h" } // 1 hour expiry
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
