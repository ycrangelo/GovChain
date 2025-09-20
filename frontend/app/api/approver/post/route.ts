import { Approvers } from './../../../../node_modules/.prisma/client/index.d';
import { NextResponse } from "next/server";
import prisma from "../../../../utils/connect";

// creating a proposal project
export async function POST(req: Request) {
  try {
    const { name, position, contractAddress } = await req.json();

    // ✅ Check if all required fields are filled
    if (
      !name ||
      !position ||
      !contractAddress) {
      return NextResponse.json(
        { error: "All fields (name, position, contractAddress) are required." },
        { status: 400 }
      );
    }
    const newApprover = await prisma.approvers.create({
      data: {
        name,
        position,
        contractAddress,
      },
    });

    return NextResponse.json(newApprover, { status: 201 });
  } catch (error: any) {
    console.error("Error creating approver:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
