"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";

const CONTRACT_ADDRESS = "0xF6B2A9c1b3Cbd44C49EF45A22a821B93205c684a";
const CONTRACT_ABI = [
  "function getProject(uint256 _id) view returns (uint256,string,string,uint256,address[],string,string,uint8,string)"
];

export default function ProjectsApprover() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // 1. Get count from Mongo API
        const countRes = await fetch("/api/project/get");
        const { count } = await countRes.json();

        // 2. Connect to Sepolia
        const provider = new ethers.JsonRpcProvider(
          "https://sepolia.infura.io/v3/93ba4b7f4c7244d69db1f6d62490894b"
        );
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        // 3. Loop fetch projects
        const tempProjects = [];
        for (let id = 1; id <= count; id++) {
          const p = await contract.getProject(id);
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
        setProjects(tempProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const imageProject = process.env.NEXT_PUBLIC_NFT_IMAGE_URL;

  return (
    <div className="relative mt-10">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <span className="animate-pulse text-gray-300">Loading projects...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.projectId}
            className="rounded-2xl overflow-hidden flex flex-col border border-gray-700 p-4 bg-transparent"
          >
            {/* Project Image */}
            {/* <Image
              alt="Project Image"
              src={imageProject}
              width={400}
              height={250}
              className="object-cover w-full h-48 rounded-xl"
            /> */}

            {/* Project Info */}
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2 text-white">
                {proj.projectName || "Unnamed Project"}
              </h2>

              <p className="text-gray-400 mb-1">📍 {proj.location || "No location"}</p>

              <p className="text-gray-400 mb-1">
                ⏳ {proj.timelineStart || "—"} → {proj.timelineEnd || "—"}
              </p>

              <p className="text-gray-400 mb-1">
                💰 Budget:{" "}
                <span className="text-white font-semibold">
                  {proj.budgetPeso?.toLocaleString() || 0} PHP
                </span>
              </p>

              {/* Spacer to push buttons down */}
              <div className="flex-1" />

              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-gray-100 border border-gray-700"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-gray-100 border border-gray-700"
                >
                  Vote
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
