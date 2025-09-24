"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Copy, Check } from "lucide-react";
import { addToast } from "@heroui/toast";

interface Signatory {
  id: string;
  name: string;
  position: string;
  contractAddress: string;
  status: number;
}

export default function AdminTableSignatories() {
  const [signatories, setSignatories] = useState<Signatory[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchSignatories(true);

    const interval = setInterval(() => {
      fetchSignatories(false);
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

  const handleCopy = async (id: string, address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedId(id);
      setTimeout(
        () => setCopiedId((prev) => (prev === id ? null : prev)),
        1500
      );
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleChangeStatus = async (id: string) => {
    try {
      const res = await fetch("/api/approver/status/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updatedApprover: Signatory = await res.json();

      setSignatories((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: updatedApprover.status } : s
        )
      );

      addToast({
        title: "Status Updated",
        description: `Status for ${updatedApprover.name} is now ${
          updatedApprover.status === 1 ? "Active" : "Inactive"
        }.`,
        color: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "Failed to update status.",
        color: "danger",
      });
    }
  };

  return (
 <div className="mt-7 relative">
  {initialLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
      <span className="animate-pulse text-gray-300">
        Loading signatories...
      </span>
    </div>
  )}

  {/* Grid instead of flex-col */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full p-4">
  {signatories.map((item) => (
    <div
      key={item.id}
      className="relative flex flex-col border border-gray-700 rounded-2xl px-6 py-5 shadow-lg bg-transparent"
    >
      {/* Copy button - top right */}
      <button
        onClick={() => handleCopy(item.id, item.contractAddress)}
        className="absolute top-3 right-3 p-1 rounded-md hover:bg-gray-800"
      >
        {copiedId === item.id ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Details */}
      <div className="flex flex-col gap-1 pr-16"> 
        <h3 className="text-xl font-bold text-white">{item.name || "—"}</h3>
        <p className="text-sm text-gray-300">{item.position || "—"}</p>
        <p className="font-mono text-sm text-gray-400 break-all">
          {item.contractAddress || "—"}
        </p>
        <span
          className={`mt-1 text-sm font-semibold ${
            item.status === 1 ? "text-green-400" : "text-red-400"
          }`}
        >
          {item.status === 1 ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="bg-transparent border border-white text-white hover:bg-white hover:text-black"
          onClick={() => handleChangeStatus(item.id)}
        >
          {item.status === 1 ? "Deactivate" : "Activate"}
        </Button>
      </div>
    </div>
  ))}
</div>
</div>
  );
}
