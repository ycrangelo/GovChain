'use client';
import { Button } from "@heroui/button";
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { Switch } from "@heroui/switch";
import { Image } from "@heroui/image";
import ModalCreate from '../../../../component/ModalCreate'
import Link from "next/link";
import ProjectsApprover from "@/component/ProjectsApprover";
import PblcProjectsApprover from "@/component/PblcProjects";


export default function Dashboard() {
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const [view, setView] = useState<string>('Approved');

  useEffect(() => {
    setView(isSelected ? "Approved" : "Proposed");
  }, [isSelected]);

  return (
    <div className="flex justify-center bg-black text-white min-h-screen py-10 px-4">
      <div className="flex flex-col w-full max-w-[1200px] rounded-3xl p-6">
        {/* Header */}
        <h1 className="text-lg font-semibold">Status</h1>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Switch
              size="md"
              color="success"
              isSelected={isSelected}
              onValueChange={setIsSelected}
            />
            <span className="text-md">{view}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Goverment Projects</h1>
          </div>
          <div className="flex gap-4">
            <Link href={`/signatories`}>
              <Button>
                Approvers
              </Button>
            </Link>
          <Link href={`/rejected`}>
            <Button color="danger" className="">
              Rejected
            </Button>
          </Link>
          </div>
        </div>

        {/* Project Grid */}
          <PblcProjectsApprover  view={view}/> 
      </div>
    </div>
  );
}
