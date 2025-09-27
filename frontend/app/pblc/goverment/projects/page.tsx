'use client';
import { Button } from "@heroui/button";
import { useState, useEffect } from "react";
import { Switch } from "@heroui/switch";
import Link from "next/link";
import PblcProjectsApprover from "@/component/PblcProjects";

export default function Dashboard() {
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const [view, setView] = useState<string>('Approved');

  useEffect(() => {
    setView(isSelected ? "Approved" : "Proposed");
  }, [isSelected]);

  return (
    <div className="flex justify-center bg-black text-white min-h-screen py-6 px-3 sm:py-10 sm:px-4">
      <div className="flex flex-col w-full max-w-[1200px] rounded-3xl p-4 sm:p-6">
        {/* Header */}
        <h1 className="text-md sm:text-lg font-semibold mb-3 sm:mb-0">Status</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6">
          {/* Switch + Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Switch
              size="sm"
              color="success"
              isSelected={isSelected}
              onValueChange={setIsSelected}
            />
            <span className="text-sm sm:text-md">{view}</span>
          </div>

          {/* Title */}
          <div className="w-full sm:w-auto text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Government Projects
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <Link href={`/signatories`}>
              <Button size="sm" className="w-full sm:w-auto">
                Approvers
              </Button>
            </Link>
            <Link href={`/rejected`}>
              <Button size="sm" color="danger" className="w-full sm:w-auto">
                Rejected
              </Button>
            </Link>
          </div>
        </div>

        {/* Project Grid */}
        <PblcProjectsApprover view={view} />
      </div>
    </div>
  );
}
