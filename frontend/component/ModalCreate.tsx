"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { NumberInput } from "@heroui/number-input";
import { DatePicker } from "@heroui/date-picker";
import { CheckboxGroup, Checkbox } from "@heroui/checkbox";
import { addToast } from "@heroui/toast";
import { pinata } from "@/utils/config";

// --- Types ---
interface Signatory {
  id: string;
  name: string;
  position: string;
  contractAddress: string;
}

interface SelectSignatoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selected: Signatory[]) => void;
  existingIds?: string[];
}

// --- Child Modal: SelectSignatoryModal ---
function SelectSignatoryModal({
  isOpen,
  onClose,
  onSelect,
  existingIds = [],
}: SelectSignatoryModalProps) {
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSignatories() {
      try {
        const res = await fetch("/api/approver/get");
        const data: Signatory[] = await res.json();
        setSignatories(data.filter((s) => !existingIds.includes(s.id)));
      } catch (err) {
        console.error(err);
      }
    }
    fetchSignatories();
  }, [existingIds]);

  const handleOk = () => {
    const selected = signatories.filter((s) => selectedIds.includes(s.id));
    onSelect(selected);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-semibold">
              Select Signatories
            </ModalHeader>
            <ModalBody className="space-y-2 max-h-64 overflow-y-auto">
              {signatories.length === 0 ? (
                <p className="text-gray-500 text-sm text-center">
                  No available signatories to select.
                </p>
              ) : (
                <CheckboxGroup
                  value={selectedIds}
                  onValueChange={setSelectedIds}
                  className="flex flex-col gap-4"
                >
                  {signatories.map((s) => (
                    <Checkbox key={s.id} value={s.id}>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-sm text-gray-500">{s.position}</span>
                        <span className="text-xs font-mono text-gray-400 truncate max-w-[200px]">
                          {s.contractAddress}
                        </span>
                      </div>
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-end gap-2">
              <Button variant="light" color="danger" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleOk}>
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// --- Main Modal: ModalCreate ---
export default function ModalCreate() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Projects contract
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PROJECT_CONTRACT_ADDRESS!;
  const CONTRACT_ABI = [
    "function createProjectNft(string _name,string _location,uint256 _budget,address[] _signatories,string _timelineStart,string _timelineEnd,string _proposalLink,string _image) external",
  ];

  // Voting contract
  const VOTING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS!;
  const VOTING_CONTRACT_ABI = [
    "function createVoteSession(uint256 _projectId, address[] calldata _eligibleVoters) external", 
  ];

  const NFT_IMAGE_URL =
    "https://cyan-additional-crab-497.mypinata.cloud/ipfs/bafkreigehgu5ijanavgtfswcedcpablrv3kqjf575zdqsn467qps3puq6a";

  const removeSignatory = (id: string) => {
    setSignatories((prev) => prev.filter((s) => s.id !== id));
  };

  const openFileDialog = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const dateToString = (dateValue: any) => {
    if (!dateValue) return "";
    if (typeof dateValue === "string") return dateValue;
    if (dateValue instanceof Date) return dateValue.toISOString().split("T")[0];
    try {
      return String(dateValue);
    } catch {
      return "";
    }
  };

  const uploadFileToPinata = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    try {
      setUploading(true);

      const urlRequest = await fetch("/api/url");
      const urlResponse = await urlRequest.json();

      const upload = await pinata.upload.public.file(file).url(urlResponse.url);
      const cid = upload.cid;

      return `https://gateway.pinata.cloud/ipfs/${cid}`;
    } catch (e) {
      console.error(e);
      alert("Trouble uploading file");
    } finally {
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);

      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        setUploading(false);
        return;
      }

      const { ethers } = await import("ethers");

      // Switch to Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (
        !projectName ||
        !location ||
        !startDate ||
        !endDate ||
        !budget ||
        !file ||
        signatories.length === 0
      ) {
        alert("Please fill all fields and add at least one signatory.");
        setUploading(false);
        return;
      }

      // Upload file
      const proposalUrl = await uploadFileToPinata();

      // Mint NFT
      const projectContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await projectContract.createProjectNft(
        projectName,
        location,
        budget,
        signatories.map((s) => s.contractAddress),
        dateToString(startDate),
        dateToString(endDate),
        proposalUrl,
        NFT_IMAGE_URL
      );
      await tx.wait();

      // Save project in MongoDB
      const payload = {
        projectName,
        location,
        startDate: dateToString(startDate),
        endDate: dateToString(endDate),
        budget,
        proposal: proposalUrl,
        signatories: signatories.map((s) => s.contractAddress),
        image: NFT_IMAGE_URL,
      };

      const res = await fetch("/api/project/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save project in database");

      // Get count from MongoDB → determine projectId
      const countRes = await fetch("/api/project/get");
      const { count } = await countRes.json();
      const projectId = count; // new projectId

      // Call Voting contract to create vote session
      const votingContract = new ethers.Contract(
        VOTING_CONTRACT_ADDRESS,
        VOTING_CONTRACT_ABI,
        signer
      );

      const voteTx = await votingContract.createVoteSession(
        projectId,
        signatories.map((s) => s.contractAddress)
      );
      await voteTx.wait();

      addToast({
        title: "Project Added, NFT Minted & Voting Session Created!",
        description: "Transaction successful!",
        color: "success",
      });

      // Reset
      setProjectName("");
      setLocation("");
      setStartDate(null);
      setEndDate(null);
      setBudget(0);
      setFile(null);
      setFileName("");
      setSignatories([]);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert("Error creating project: " + (err.message || ""));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button color="success" onPress={onOpen}>
        Add Project
      </Button>

      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Proposed Project</ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                />
                <NumberInput
                  label="Budget"
                  value={budget}
                  onValueChange={(v) => setBudget(v)}
                />

                <div className="flex flex-col gap-2">
                  {fileName && (
                    <span className="text-sm text-gray-600">
                      Selected: {fileName}
                    </span>
                  )}
                  <Button
                    onPress={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Proposal File"}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {signatories.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center p-2"
                    >
                      <div>
                        {s.name} ({s.position})
                        <div className="text-sm font-mono text-gray-500">
                          {s.contractAddress}
                        </div>
                      </div>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={() => removeSignatory(s.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    color="primary"
                    onPress={() => setSelectModalOpen(true)}
                  >
                    Add Signatory
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleSave}
                  disabled={uploading}
                >
                  {uploading ? "Processing..." : "Save"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <SelectSignatoryModal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onSelect={(selected) =>
          setSignatories((prev) => [...prev, ...selected])
        }
        existingIds={signatories.map((s) => s.id)}
      />
    </>
  );
}
