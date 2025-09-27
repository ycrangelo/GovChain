"use client";

import { useState, useEffect, Suspense } from "react";
import { ethers } from "ethers";
import { Button } from "@heroui/button";
import { useSearchParams } from "next/navigation";

// --- CONTRACTS --- //
const PROJECT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROJECT_CONTRACT_ADDRESS!;
const PROJECT_CONTRACT_ABI = [
  "function getProject(uint256 _id) view returns (uint256,string,string,uint256,address[],string,string,uint8,string)",
];

// Inner component that uses useSearchParams
function RejectedProjectContent() {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const provider = new ethers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_INFUR_LINK
        );
        const contract = new ethers.Contract(
          PROJECT_CONTRACT_ADDRESS,
          PROJECT_CONTRACT_ABI,
          provider
        );

        const p = await contract.getProject(id);

        setProject({
          projectId: Number(p[0]),
          projectName: p[1],
          location: p[2],
          budgetPeso: Number(p[3]),
          signatories: p[4],
          timelineStart: p[5],
          timelineEnd: p[6],
          status: Number(p[7]),
          proposalLink: p[8],
        });
      } catch (err) {
        console.error("❌ Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-300">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        Project not found.
      </div>
    );
  }

  return (
    <div className="relative mt-10 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-4xl flex justify-end mb-6">
        <Button
          color="danger"
          className="text-gray-300 hover:text-gray-100 border border-gray-700"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      {/* Project Details Card */}
      <div className="rounded-2xl border border-gray-700 p-8 w-full max-w-4xl bg-black/40 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">
          {project.projectName}
        </h1>

        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">🪪 Project ID:</span>{" "}
          {project.projectId}
        </p>

        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">📍 Location:</span>{" "}
          {project.location || "N/A"}
        </p>

        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">💰 Budget:</span>{" "}
          {project.budgetPeso?.toLocaleString()} PHP
        </p>

        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">⏳ Timeline:</span>{" "}
          {project.timelineStart || "—"} → {project.timelineEnd || "—"}
        </p>

        <p className="text-gray-400 mb-2">
          <span className="font-semibold text-white">📌 Status:</span>{" "}
          {project.status === 1
            ? "Rejected"
            : project.status === 0
            ? "Pending"
            : project.status === 2
            ? "Approved"
            : project.status === 3
            ? "Ongoing"
            : "Completed"}
        </p>

        <div className="mb-4">
          <span className="font-semibold text-white">🖊 Signatories:</span>
          <ul className="list-disc list-inside text-gray-400">
            {project.signatories.length > 0 ? (
              project.signatories.map((addr: string, idx: number) => (
                <li key={idx} className="break-words">
                  {addr}
                </li>
              ))
            ) : (
              <li>No signatories</li>
            )}
          </ul>
        </div>

        <p className="text-gray-400">
          <span className="font-semibold text-white">📄 Proposal:</span>{" "}
          <a
            href={project.proposalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            {project.proposalLink}
          </a>
        </p>
      </div>
    </div>
  );
}

// Main component that wraps the content in Suspense
export default function RejectedProjectView() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-gray-300">
        Loading...
      </div>
    }>
      <RejectedProjectContent />
    </Suspense>
  );
}