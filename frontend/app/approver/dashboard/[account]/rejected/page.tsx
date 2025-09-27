"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';

// --- CONTRACTS --- //
const PROJECT_CONTRACT_ADDRESS = "0xF6B2A9c1b3Cbd44C49EF45A22a821B93205c684a";
const PROJECT_CONTRACT_ABI = [
  "function getProject(uint256 _id) view returns (uint256,string,string,uint256,address[],string,string,uint8,string)",
];

export default function RejectedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams<{ account: string }>();
  const account = params.account; // dynamic segment [account]

  useEffect(() => {
    const fetchRejected = async () => {
      try {
        setLoading(true);

        // 1. Get project count from backend
        const countRes = await fetch("/api/project/get");
        const { count } = await countRes.json();

        // 2. Connect to Sepolia RPC
        const provider = new ethers.JsonRpcProvider(
          "https://sepolia.infura.io/v3/93ba4b7f4c7244d69db1f6d62490894b"
        );
        const contract = new ethers.Contract(
          PROJECT_CONTRACT_ADDRESS,
          PROJECT_CONTRACT_ABI,
          provider
        );

        // 3. Fetch projects and filter rejected
        const tempProjects = [];
        for (let id = 1; id <= count; id++) {
          const p = await contract.getProject(id);
          // only rejected projects (status === 1)
          if (Number(p[7]) === 2) {
            tempProjects.push({
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
          }
        }

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
    <div className="relative mt-10 flex flex-col items-center">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <span className="animate-pulse text-gray-300">
            Loading rejected projects...
          </span>
        </div>
      )}

      {/* Back Button (top right) */}
      <div className="w-full max-w-6xl flex justify-end mb-6">
        <Button
          color="danger"
          // variant="ghost"
          className="text-gray-300 hover:text-gray-100 border border-gray-700"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      {/* Projects Grid (centered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mx-auto">
        {projects.map((proj) => (
          <div
            key={proj.projectId}
            className="rounded-2xl overflow-hidden flex flex-col border border-gray-700 p-4 bg-transparent"
          >
            {/* Project Info */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2 text-red-400">
                {proj.projectName || "Unnamed Project"}
              </h2>

              <p className="text-gray-400 mb-1">
                📍 {proj.location || "No location"}
              </p>

              <p className="text-gray-400 mb-1">
                ⏳ {proj.timelineStart || "—"} → {proj.timelineEnd || "—"}
              </p>

              <p className="text-gray-400 mb-1">
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
                  onClick={() =>
                    router.push(
                      `/view?id=${proj.projectId}`
                    )
                  }
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
