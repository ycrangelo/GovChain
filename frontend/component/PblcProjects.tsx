"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

// --- CONTRACTS --- //
const PROJECT_CONTRACT_ADDRESS = "0xF6B2A9c1b3Cbd44C49EF45A22a821B93205c684a";
const PROJECT_CONTRACT_ABI = [
  "function getProject(uint256 _id) view returns (uint256,string,string,uint256,address[],string,string,uint8,string)",
];

interface Props {
  view: string;
}

export default function PblcProjectsApprover({ view }: Props) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

  // for voting modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // 1. Get count from API (Mongo or backend)
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

        // 4. Fetch projects one by one
        const tempProjects = [];
        for (let id = 1; id <= count; id++) {
          const p = await contract.getProject(id);
          const project = {
            projectId: Number(p[0]),
            projectName: p[1],
            location: p[2],
            budgetPeso: Number(p[3]),
            signatories: p[4],
            timelineStart: p[5],
            timelineEnd: p[6],
            status: Number(p[7]),
            proposalLink: p[8],
          };

          tempProjects.push(project);
        }

        //  filter based on `view`
        const filtered = tempProjects.filter((proj) => {
          if (view === "Approved") return proj.status === 2;
          if (view === "Proposed") return proj.status === 0;
          return true; // default = show all
        });

        setProjects(filtered);
      } catch (err) {
        console.error("❌ Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [view]);

  return (
    <div className="relative mt-10">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <span className="animate-pulse text-gray-300">Loading projects...</span>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.projectId}
            className="rounded-2xl overflow-hidden flex flex-col border border-gray-700 p-4 bg-transparent"
          >
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

              <div className="flex-1" />

              {/* Action Buttons */}
              <div className="flex gap-4 mt-4">
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
