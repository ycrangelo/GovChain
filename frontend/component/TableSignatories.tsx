"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Copy, Check } from "lucide-react";

interface Signatory {
  id: string;
  name: string;
  position: string;
  contractAddress: string;
  status: number;
}

export default function SignatoriesGrid() {
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
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="mt-7 relative">
      {initialLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <span className="animate-pulse text-gray-300">Loading signatories...</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {signatories.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl border border-gray-700 flex flex-col gap-3 bg-transparent"
          >
            {/* Name */}
            <div>
              <p className="text-xs text-gray-400">Name</p>
              <h3 className="text-lg font-bold text-white">{item.name || "—"}</h3>
            </div>

            {/* Position */}
            <div>
              <p className="text-xs text-gray-400">Position</p>
              <p className="text-sm text-white">{item.position || "—"}</p>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs text-gray-400">Address</p>
              <div className="flex items-center gap-2 font-mono text-sm text-white break-all">
                <span title={item.contractAddress}>
                  {item.contractAddress || "—"}
                </span>
                {item.contractAddress && (
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => handleCopy(item.id, item.contractAddress)}
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-white" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <span
                className={`text-sm font-semibold ${
                  item.status === 1 ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.status === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
