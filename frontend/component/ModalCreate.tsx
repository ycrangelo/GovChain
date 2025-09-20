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
import { parseDate } from "@internationalized/date";

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
  const [fileName, setFileName] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [selectModalOpen, setSelectModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeSignatory = (id: string) => {
    setSignatories((prev) => prev.filter((s) => s.id !== id));
  };

  const openFileDialog = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFileName(e.target.files[0].name);
  };

  // Convert DateValue to string for API
  const dateValueToString = (dateValue: any): string => {
    if (!dateValue) return "";
    
    // If it's already a string, return it
    if (typeof dateValue === 'string') return dateValue;
    
    // If it has a toString method, use it
    if (dateValue.toString && typeof dateValue.toString === 'function') {
      return dateValue.toString();
    }
    
    // If it's a Date object, format it
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // For other cases, try to get the date string
    try {
      return String(dateValue);
    } catch {
      return "";
    }
  };

  const handleSave = async () => {
    try {
      // Convert dates to strings for API
      const startDateStr = dateValueToString(startDate);
      const endDateStr = dateValueToString(endDate);

      if (
        !projectName ||
        !location ||
        !startDateStr ||
        !endDateStr ||
        !budget ||
        !fileName ||
        signatories.length === 0
      ) {
        alert("Please fill all fields and add at least one signatory.");
        return;
      }

      const payload = {
        projectName,
        location,
        startDate: startDateStr,
        endDate: endDateStr,
        budget,
        proposal: fileName,
        signatories: signatories.map((s) => s.contractAddress), // only addresses
      };

      const res = await fetch("/api/project/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();
      console.log("Project created:", data);
      onClose();
      // Reset form
      setProjectName("");
      setLocation("");
      setStartDate(null);
      setEndDate(null);
      setBudget(0);
      setFileName("");
      setSignatories([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create project. Check console for details.");
    }
  };

  return (
    <>
      <Button color="success" onPress={onOpen}>
        Add Project
      </Button>

      <Modal
        isOpen={isOpen}
        size="lg"
        onClose={onClose}
        isDismissable={false}
        isKeyboardDismissDisabled
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add Proposed Project</ModalHeader>
              <ModalBody className="space-y-4">
                <Input
                  label="Project Name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                  label="Location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <DatePicker
                  showMonthAndYearPickers
                  className="w-full"
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                />
                <DatePicker
                  showMonthAndYearPickers
                  className="w-full"
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                />
                <NumberInput
                  label="Budget"
                  placeholder="Enter the Budget"
                  value={budget}
                  onValueChange={(v) => setBudget(v)}
                />

                {/* File Upload */}
                <div className="flex flex-col gap-2">
                  {fileName && <span className="text-sm text-gray-600">Selected: {fileName}</span>}
                  <Button onPress={openFileDialog}>Upload Proposal File</Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Signatories Section */}
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {signatories.map((s) => (
                    <div key={s.id} className="flex justify-between items-center p-2">
                      <div>
                        {s.name} ({s.position})
                        <div className="text-sm font-mono text-gray-500">{s.contractAddress}</div>
                      </div>
                      <Button color="danger" size="sm" onPress={() => removeSignatory(s.id)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button color="primary" onPress={() => setSelectModalOpen(true)}>
                    Add Signatory
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSave}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Child Modal */}
      <SelectSignatoryModal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onSelect={(selected) => setSignatories((prev) => [...prev, ...selected])}
        existingIds={signatories.map((s) => s.id)}
      />
    </>
  );
}