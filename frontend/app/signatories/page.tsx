'use client'
import { Button } from "@heroui/button";
import SignatoriesTable from "@/component/TableSignatories";
import { useParams } from "next/navigation";

export default function SignatoriesDashboard() {
  const params = useParams(); 
  const account = params.account as string; // 👈 dynamic segment

  return (
    <div className="flex flex-col min-h-screen bg-black text-white px-4 sm:px-8 lg:px-20 xl:px-48">
      {/* Header */}
      <div className="flex items-center justify-between mt-10 sm:mt-16 mb-6">
        {/* Left - Back button */}
        <Button
          onClick={() => window.history.back()}
          color="danger"
          size="sm"
          className="sm:size-md"
        >
          Back
        </Button>

        {/* Center - Title */}
        <h1 className="text-lg sm:text-xl font-semibold text-center flex-1">
          Approvers Dashboard
        </h1>

        {/* Right - Placeholder (keeps title centered) */}
        <div className="w-[64px] sm:w-[80px]" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <SignatoriesTable />
      </div>
    </div>
  );
}
