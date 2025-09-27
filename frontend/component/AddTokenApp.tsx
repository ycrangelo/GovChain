"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS!; 
const CONTRACT_ABI = [
  "function distributeToken() public",
];

export default function DistributeTokenButton() {
  const [loading, setLoading] = useState(false);

  const handleDistribute = async () => {
    setLoading(true);
    try {
      // ✅ Check MetaMask
      if (!(window as any).ethereum) {
        alert("MetaMask is not installed!");
        setLoading(false);
        return;
      }

      // ✅ Switch to Sepolia (chainId: 0xaa36a7)
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });

      // ✅ Ethers provider + signer
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // ✅ Init contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // ✅ Call distributeToken
      const tx = await contract.distributeToken();

      addToast({
        title: "Transaction Sent",
        description: "Distributing tokens on-chain...",
        color: "warning",
      });

      await tx.wait();

      addToast({
        title: "Success",
        description: "🎉 Tokens successfully distributed to all approvers!",
        color: "success",
      });
    } catch (err: any) {
      console.error("❌ Error:", err.message);
      addToast({
        title: "Error",
        description: err.message || "Something went wrong.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        color="primary" 
        onPress={handleDistribute} 
        isDisabled={loading}
      >
        {loading ? "Distributing..." : "Distribute Tokens"}
      </Button>
    </div>
  );
}
