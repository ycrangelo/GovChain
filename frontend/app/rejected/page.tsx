"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

// --- CONTRACTS --- //
const PROJECT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROJECT_CONTRACT_ADDRESS!;
const PROJECT_CONTRACT_ABI = [
  "function getProject(uint256 _id) view returns (uint256,string,string,uint256,address[],string,string,uint8,string)",
];

export default function RejectedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        setLoading(true);

        // 1. Get project count
        const countRes = await fetch("/api/project/get");
        const { count } = await countRes.json();

        // 2. Connect to Sepolia RPC
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFUR_LINK);
        const contract = new ethers.Contract(
          PROJECT_CONTRACT_ADDRESS,
          PROJECT_CONTRACT_ABI,
          provider
        );

        // 3. Fetch projects in parallel
        const projectsArray = await Promise.all(
          Array.from({ length: count }, (_, i) => contract.getProject(i + 1))
        );

        // 4. Filter rejected
        const tempProjects = projectsArray
          .map((p: any) => ({
            projectId: Number(p[0]),
            projectName: p[1],
            location: p[2],
            budgetPeso: Number(p[3]),
            signatories: p[4],
            timelineStart: p[5],
            timelineEnd: p[6],
            status: Number(p[7]),
            proposalLink: p[8],
          }))
          .filter((proj) => proj.status === 1);

        setProjects(tempProjects);
      } catch (err) {
        console.error("❌ Error fetching rejected projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejected();
  }, []);

  return (
    <div className="relative mt-6 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <span className="animate-pulse text-gray-300">
            Loading rejected projects...
          </span>
        </div>
      )}

      {/* Back Button */}
      <div className="w-full max-w-6xl flex justify-end mb-4 sm:mb-6">
        <Button
          color="danger"
          className="text-gray-300 hover:text-gray-100 border border-gray-700"
          onClick={() => window.history.back()}
          size="sm"
        >
          Back
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl w-full">
        {projects.map((proj) => (
          <div
            key={proj.projectId}
            className="rounded-2xl overflow-hidden flex flex-col border border-gray-700 p-4 bg-transparent"
          >
            <div className="p-2 sm:p-4 flex flex-col flex-1">
              <h2 className="text-lg sm:text-xl font-bold mb-2 text-red-400 truncate">
                {proj.projectName || "Unnamed Project"}
              </h2>

              <p className="text-gray-400 mb-1 text-sm sm:text-base">
                📍 {proj.location || "No location"}
              </p>

              <p className="text-gray-400 mb-1 text-sm sm:text-base">
                ⏳ {proj.timelineStart || "—"} → {proj.timelineEnd || "—"}
              </p>

              <p className="text-gray-400 mb-1 text-sm sm:text-base">
                💰 Budget:{" "}
                <span className="text-white font-semibold">
                  {proj.budgetPeso?.toLocaleString() || 0} PHP
                </span>
              </p>

              <div className="flex-1" />

              {/* Action Button */}
              <div className="flex justify-end mt-4">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-gray-100 border border-gray-700"
                  size="sm"
                  onClick={() =>
                    router.push(`/view?id=${proj.projectId}`)
                  }
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && !loading && (
        <div className="text-gray-400 text-center mt-10 text-sm sm:text-base">
          No rejected projects found.
        </div>
      )}
    </div>
  );
}
