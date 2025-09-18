'use client';
import { Button } from "@heroui/button";
import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { Switch } from "@heroui/switch";
import { Image } from "@heroui/image";
import ModalCreate from '../../../../component/ModalCreate'
import Link from "next/link";


export default function Dashboard() {
  const params = useParams();
  const account = params.account; // dynamic segment [account]
  const [isMain, setIsMain] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const [view, setView] = useState<string>('Approved');

  useEffect(() => {
    if (account === process.env.NEXT_PUBLIC_MAIN) {
      setIsMain(true);
    }
  }, [account]);

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
            <Link href={`/approver/dashboard/${account}/signatories`}>
              <Button>
                Approvers
              </Button>
            </Link>
          <Button color="danger" className="">
            Rejected
          </Button>
          {isMain && (
            <>
          <Button color="warning" className="">
            Manage Approvers
          </Button>
            <ModalCreate/>
            </>
          )}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(7)].map((_, idx) => (
            <div
              key={idx}
              className=" rounded-2xl overflow-hidden flex flex-col"
            >
              <Image
                alt="Project Image"
                src="https://heroui.com/images/hero-card-complete.jpeg"
                width={400}
                height={250}
                className="object-cover w-full h-52"
              />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <h2 className="text-2xl font-bold mb-2 text-center text-white">Project Title</h2>
                <div className="flex justify-center gap-4 mt-4">
                  <Button variant="ghost" className="text-gray-300 hover:text-gray-100 border">
                    View
                  </Button>
                  <Button variant="ghost" className="text-gray-300 hover:text-gray-100 border">
                    Vote
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
