'use client';
import {Button, ButtonGroup} from "@heroui/button";
import { useParams } from 'next/navigation';
import { useState ,useEffect} from "react";
import {Switch} from "@heroui/switch";

export default function Dashboard() {
  const params = useParams();
  const account = params.account; // dynamic segment [account]
  const [isMain,setIsMain] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(true);
  const [view, setView] = useState<string>('Approvers')

    useEffect(() => {
    if (account === process.env.NEXT_PUBLIC_MAIN) {
        setIsMain(true);
    }else{
         console.log("hello")
    }
    }, [account]);

    useEffect(() => {
    if (isSelected) {
        setView("Approvers")
    }else{
        setView("Projects")
    }
    }, [isSelected]);

    console.log(isMain)

  return (
        <div className="flex h-auto justify-center bg-black text-white">
        <div className="flex flex-col mt-[4rem] rounded-2xl border border-white w-[85%] p-4">
            <div className="flex items-center justify-between w-full p-2">
            {/* Left side */}
            <div className="">
                <Switch  size="sm" color="default" isSelected={isSelected} onValueChange={setIsSelected}>
                    {`View ${view}`}
                </Switch>
            </div>

            {/* Right side */}
            {isMain && (
                <div className="">
                <Button variant="ghost" className="text-white">
                    Add Project
                </Button>
                </div>
            )}
            </div>
            <div className="flex p-2">
            </div>
        </div>
        </div>
  );
}
