"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { addToast } from "@heroui/toast";

export default function Login() {
  const [account, setAccount] = useState<string>("");
  const router = useRouter();

  const connectWallet = async () => {
    if (!window.ethereum) {
      addToast({
        title: "MetaMask is not installed!",
        description: "Please install MetaMask to continue.",
        color: "danger",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const userAccount = accounts[0].toLowerCase();

      // Fetch all approvers
      const res = await fetch("/api/approver/get");
      const approvers = await res.json();

      // Check kung existing yung wallet sa approvers list
      const isApprover = approvers.some(
        (a: any) => a.contractAddress.toLowerCase() === userAccount
      );

      if (!isApprover) {
        addToast({
          title: "Access Denied",
          description: "❌ This wallet is not registered as an approver.",
          color: "danger",
        });
        return;
      }

      setAccount(userAccount);
        
      const ress = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: userAccount }),
      });

      const data = await ress.json();

// store token sa localStorage (or cookies kung mas secure)
localStorage.setItem("token", data.token);
      console.log("Connected account:", userAccount);

      addToast({
        title: "Wallet Connected",
        description: "✅ Successfully connected!",
        color: "success",
      });

      // Redirect kung valid
      router.push(`/approver/dashboard/${userAccount}`);
    } catch (err) {
      console.error(err);
      addToast({
        title: "Connection Failed",
        description: "Something went wrong while connecting wallet.",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="p-8 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Login with MetaMask</h1>

        {account ? (
          <div>
            <p className="mb-4">✅ Connected</p>
            <p className="break-words text-sm text-gray-300">{account}</p>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-500 transition"
          >
            <Image
              src="https://images.ctfassets.net/clixtyxoaeas/4rnpEzy1ATWRKVBOLxZ1Fm/a74dc1eed36d23d7ea6030383a4d5163/MetaMask-icon-fox.svg"
              alt="MetaMask"
              width={24}
              height={24}
            />
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
