import React, { useState, useRef } from "react";
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

export default function ModalCreate() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [signatories, setSignatories] = useState<string[]>([""]);
  const [budget, setBudget] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignatoryChange = (index: number, value: string) => {
    const updated = [...signatories];
    updated[index] = value;
    setSignatories(updated);
  };

  const addSignatoryField = () => setSignatories([...signatories, ""]);
  const removeSignatoryField = (index: number) => {
    const updated = signatories.filter((_, i) => i !== index);
    setSignatories(updated);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onPress={onOpen}>Add Project</Button>
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
                Add Proposed Project
              </ModalHeader>
              <ModalBody className="space-y-4">
                {/* Disclaimer Section */}
                <h1 className="text-red-500 border-y border-red-200 py-2 text-sm font-medium">
                  Note: Please ensure your proposal is accurate and related to public service. Submissions with false or irrelevant details may not be approved.
                </h1>

                <div className="flex flex-col gap-4">
                  <Input label="Project Name" type="text" />
                  <Input label="Location" type="text" />
                  <DatePicker showMonthAndYearPickers className="w-full" label="Start Date" />
                  <DatePicker showMonthAndYearPickers className="w-full" label="End Date" />
                  <NumberInput
                    label="Budget"
                    placeholder="Enter the Budget"
                    value={budget}
                    onValueChange={(v: number) => setBudget(v)}
                  />

                  {/* File Upload Section */}
                  <div className="flex flex-col gap-2">
                    <Button onPress={openFileDialog}>Upload Proposal File</Button>
                    {fileName && (
                      <span className="text-sm text-gray-600">Selected: {fileName}</span>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Scrollable Signatories Section */}
                  <div className="flex flex-col max-h-64 overflow-y-auto w-full">
                    <div className="flex flex-col gap-2">
                      {signatories.map((addr, index) => (
                        <div key={index} className="flex gap-2 items-center w-full">
                          <Input
                            placeholder="0x1234..."
                            value={addr}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleSignatoryChange(index, e.target.value)
                            }
                          />
                          <Button color="danger" onPress={() => removeSignatoryField(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Sticky Add Signatory Button */}
                    <div className="mt-auto w-full pt-2">
                      <Button color="primary" onPress={addSignatoryField} className="w-full">
                        Add Signatory
                      </Button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
