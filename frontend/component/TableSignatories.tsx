"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Copy, Check } from "lucide-react"; // ✅ icon import

export default function SignatoriesTable() {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const signatories = [
    { id: 1, name: "Tony Reichert", role: "CEO", status: "Active", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    { id: 2, name: "Zoey Lang", role: "Technical Lead", status: "Not Active", address: "0x4E9ce36E442e55EcD9025B9a6E0D88485d628A67" },
    { id: 3, name: "Jane Fisher", role: "Senior Developer", status: "Active", address: "0x281055afc982d96FAB65b3a49c7BB7a0bC07b2b9" },
    { id: 4, name: "William Howard", role: "Community Manager", status: "Not acitve", address: "0x53d284357ec70cE289D6D64134DfAc8E511c8a3D" },
  ];

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 4 ? `${addr.slice(0, 10)}....${addr.slice(-4)}` : addr;
  };

  const handleCopy = async (id: number, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="mt-7">
      <Table aria-label="Signatories table">
        <TableHeader>
          <TableColumn key="name">NAME</TableColumn>
          <TableColumn key="role">ROLE</TableColumn>
          <TableColumn key="address">ADDRESS</TableColumn>
          <TableColumn key="status">STATUS</TableColumn>
        </TableHeader>

        <TableBody>
          {signatories.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.role}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2 font-mono">
                  <span title={item.address}>{truncateAddress(item.address)}</span>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => handleCopy(item.id, item.address)}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
