// app/page.tsx
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";

export default function Login() {
  const [account, setAccount] = useState<string | null>(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Error connecting to MetaMask:", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="p-8  text-center flex flex-col items-center">
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
