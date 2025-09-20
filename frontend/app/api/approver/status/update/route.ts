import { NextResponse } from "next/server";
import prisma from "../../../../../utils/connect";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Field 'id' is required." },
        { status: 400 }
      );
    }
    const approver = await prisma.approvers.findUnique({
      where: { id },
    });

    if (!approver) {
      return NextResponse.json(
        { error: "Approver not found." },
        { status: 404 }
      );
    }
    const newStatus = approver.status === 1 ? 0 : 1; 
    const updatedApprover = await prisma.approvers.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json(updatedApprover, { status: 200 });
  } catch (error: any) {
    console.error("Error updating approver status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
