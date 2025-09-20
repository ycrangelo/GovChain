import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export async function GET(){

    try {
    const newApprover = await prisma.approvers.findMany();

    return NextResponse.json(newApprover, { status: 200});
  } catch (error: any) {
    console.error("Error getting approver:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}