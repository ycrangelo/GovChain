import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; 

export async function GET() {
  try {
    // Fetch all projects
    const projects = await prisma.projects.findMany();

    // Count NFTs (projects)
    const count = await prisma.projects.count();

    return NextResponse.json({ count, projects }, { status: 200 });
  } catch (error: any) {
    console.error("Error getting projects:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
