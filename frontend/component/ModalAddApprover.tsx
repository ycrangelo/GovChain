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

export default function ModalAddApprover() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // form states
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
        throw new Error(error.error || "Failed to save approver");
      }

      const data = await res.json();
      console.log("✅ Approver saved:", data);

      // Show success toast OUTSIDE modal
      addToast({
        title: "Approver Added",
        description: `${name} has been successfully added.`,
        color: "success",
      });

      // clear inputs after success
      setName("");
      setPosition("");
      setContractAddress("");

      onClose();
    } catch (err: any) {
      console.error("❌ Error saving approver:", err.message);
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
        <Button color="success" onPress={onOpen}>Add Approver</Button>
      </div>
      <Modal
        isOpen={isOpen}
        size="lg"
        onClose={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
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
