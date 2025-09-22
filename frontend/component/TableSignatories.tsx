"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Copy, Check } from "lucide-react"; 
import { addToast } from "@heroui/toast"; 

interface Signatory {
  id: string;
  name: string;
  position: string;
  contractAddress: string;
  status: number;
}

export default function SignatoriesTable() {
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true); // only for first load

  useEffect(() => {
    fetchSignatories(true); // first fetch → show loader

    const interval = setInterval(() => {
      fetchSignatories(false); // silent fetch (no loader)
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const fetchSignatories = async (showLoading = true) => {
    if (showLoading) setInitialLoading(true);

    try {
      const res = await fetch("/api/approver/get", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch signatories");
      const data: Signatory[] = await res.json();
      setSignatories(data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setInitialLoading(false);
    }
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return addr.length > 10 ? `${addr.slice(0, 10)}....${addr.slice(-4)}` : addr;
  };

  const handleCopy = async (id: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedId(id);
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="mt-7 overflow-x-auto relative">
      {initialLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <span className="animate-pulse text-gray-500">Loading signatories...</span>
        </div>
      )}

      <Table aria-label="Signatories table" className="min-w-full">
        <TableHeader>
          <TableColumn className="text-left">NAME</TableColumn>
          <TableColumn className="text-left">POSITION</TableColumn>
          <TableColumn className="text-left">ADDRESS</TableColumn>
          <TableColumn className="text-center">STATUS</TableColumn>
        </TableHeader>

        <TableBody>
          {signatories.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-left font-medium">{item.name}</TableCell>
              <TableCell className="text-left">{item.position}</TableCell>
              <TableCell className="text-left">
                <div className="flex items-center gap-2 font-mono">
                  <span title={item.contractAddress} className="truncate max-w-[180px]">
                    {truncateAddress(item.contractAddress)}
                  </span>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => handleCopy(item.id, item.contractAddress)}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold">
                {item.status === 1 ? "Active" : "Inactive"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
