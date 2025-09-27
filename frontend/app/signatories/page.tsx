'use client'
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import SignatoriesTable from "@/component/TableSignatories";
import Link from "next/link";
import { useParams } from "next/navigation";

// type Props = {
//   account: string;
// };

export default function signatoriesDashboard() {
    const params = useParams(); 
    const account = params.account as string; // 👈 dynamic segment
  return (
    <div className="flex flex-col min-h-screen px-[12rem] bg-black text-white">
      {/* Search */}
<div className="flex items-center justify-between mt-20 ">
  {/* Left - Back button */}
        
          <Button onClick={() => window.history.back()} color="danger">Back</Button>
        

  {/* Center - Title */}
  <h1 className="text-xl font-semibold text-center flex-1">
    Approvers Dashboard
  </h1>

  {/* Right - placeholder (to balance flex) */}
</div>
      <SignatoriesTable/>
    </div>
  );
}
