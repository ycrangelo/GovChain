import { NextResponse } from "next/server";
import prisma from "../../../../utils/connect";

// creating a proposal project
export async function POST(req: Request) {
  try {
    const { projectName, location, startDate, endDate, budget, proposal, signatories } = await req.json();

    // ✅ Check if all required fields are filled
    if (
      !projectName ||
      !location ||
      !startDate ||
      !endDate ||
      !budget ||
      !proposal ||
      !signatories ||
      !Array.isArray(signatories) ||
      signatories.length === 0
    ) {
      return NextResponse.json(
        { error: "All fields are required and signatories must not be empty." },
        { status: 400 }
      );
    }

    // Count existing projects to assign next projectId
    const count = await prisma.projects.count();
    const projectid = count + 1; // auto-increment style

    const newProject = await prisma.projects.create({
      data: {
        nftId: projectid,
        projectName,
        location,
        budgetPeso: Number(budget),
        signatories,
        timelineStart: startDate,
        timelineEnd: endDate,
        status: 0, // default kapag kaka-create
        proposalLink: proposal,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
