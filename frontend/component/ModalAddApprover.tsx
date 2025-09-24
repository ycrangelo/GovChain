"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x6e4A757459c24059A237434f36a610A96f7146EA"; 
const CONTRACT_ABI = [
  "function addApprovers(address[] _approverAddress) public",
];

export default function ModalAddApprover() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !position || !contractAddress) {
      addToast({
        title: "Missing fields",
        description: "⚠️ Please fill in all fields.",
        color: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      // ✅ Check kung may MetaMask
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

      // ✅ Send tx to blockchain
      const tx = await contract.addApprovers([contractAddress]);

      addToast({
        title: "Transaction Sent",
        description: "Waiting for confirmation on-chain...",
        color: "warning",
      });

      await tx.wait();

      // ✅ Save approver to DB after chain success
      const res = await fetch("/api/approver/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          position,
          contractAddress,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save approver in DB");
      }

      const data = await res.json();
      console.log("✅ Approver saved in DB:", data);

      addToast({
        title: "Approver Added",
        description: `${name} has been successfully added.`,
        color: "success",
      });

      // Clear inputs
      setName("");
      setPosition("");
      setContractAddress("");

      onClose();
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
    <>
      <div className="flex flex-wrap gap-3">
        <Button color="success" onPress={onOpen}>
          Add Approver
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        size="lg"
        onClose={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Approver
              </ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                />
                <Input
                  label="Contract Address"
                  placeholder="0x1234..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={handleSave}
                  isDisabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
