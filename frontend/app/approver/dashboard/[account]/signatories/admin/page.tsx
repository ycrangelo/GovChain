'use client'
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminTableSignatories from "@/component/AdminTableSignatories";
import ModalAddApprover from "@/component/ModalAddApprover";

// type Props = {
//   account: string;
// };

export default function AdminSignatoriesDashboard() {
    const params = useParams(); 
    const account = params.account as string; // 👈 dynamic segment
  return (
    <div className="flex flex-col min-h-screen px-[12rem] bg-black text-white">
      {/* Search */}
<div className="flex items-center justify-between mt-20">
  {/* Left - Back button */}
        <Link href={`/approver/dashboard/${account}`}>
          <Button color="danger">Back</Button>
        </Link>

  {/* Center - Title */}
  <h1 className="text-xl font-semibold text-center flex-1">
    Manage Approvers Dashboard
  </h1>

  {/* Right - placeholder (to balance flex) */}
       <ModalAddApprover/>
</div>
      <AdminTableSignatories/>
    </div>
  );
}
