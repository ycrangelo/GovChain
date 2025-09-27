"use client";
import { useEffect, useRef } from "react";
import { Button } from "@heroui/button";
import Link from "next/link";

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Background particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const nodesCount = 30;
    const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 4;
        ctx.fillRect(node.x - 5, node.y - 5, 10, 10);
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${1 - dist / 200})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative overflow-hidden bg-black text-white">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center h-screen px-4 text-center">
        <div>
          <h1 className="text-5xl sm:text-7xl md:text-[11rem] font-bold leading-tight">
            <span className="text-yellow-500 font-semibold">G</span>
            <span className="text-blue-500 font-semibold">o</span>
            <span className="text-red-500 font-semibold">v</span>Chain
          </h1>
          <p className="text-base sm:text-lg md:text-xl mt-4 mb-9 max-w-lg mx-auto">
            Immutable Records, Transparent Governance.
          </p>
          <Link href={`/pblc/goverment/projects`}>
            <Button color="default" variant="flat" size="lg">
              Explore Projects
            </Button>
          </Link>
        </div>

        {/* Down Arrow */}
        <div className="absolute bottom-8 sm:bottom-12 animate-bounce">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative mt-20 z-10 mb-9 flex items-center justify-center px-6 text-center"
      >
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6">
            What is <span className="text-blue-400">GovChain</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300">
            GovChain is a <span className="text-yellow-400 font-semibold">Web3</span> platform
            that brings complete transparency to government projects. Citizens
            and auditors can track proposals, budgets, and approvals in real
            time using <span className="text-yellow-400 font-semibold">blockchain</span>{" "}
            technology, ensuring accountability and trust.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="Works"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 sm:py-24 mt-9"
      >
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-center mb-12 sm:mb-16">
          From Idea to Execution
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-8 w-full max-w-6xl">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center text-center p-6">
            <p className="text-4xl sm:text-[50px]">🗂️</p>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              Project Creation
            </h3>
            <p className="text-sm sm:text-base">
              Government uploads detailed project proposals (PDFs) to
              decentralized storage (IPFS). Each project is minted as a unique
              Project <span className="text-yellow-400 font-semibold">NFT</span>.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center">
            <div className="w-12 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center text-center p-6">
            <p className="text-4xl sm:text-[50px]">🎟</p>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              Voting & Approval
            </h3>
            <p className="text-sm sm:text-base">
              Authorized stakeholders receive Governance{" "}
              <span className="text-yellow-400 font-semibold">Tokens</span>. Tokens
              are used to approve or reject projects on-chain.
            </p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center">
            <div className="w-12 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center text-center p-6">
            <p className="text-4xl sm:text-[50px]">🔍</p>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">
              Real-Time Transparency
            </h3>
            <p className="text-sm sm:text-base">
              Citizens and auditors can monitor project progress, budgets, and
              approvals in real time. Every vote and proposal is verifiable
              on-chain.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="Features"
        className="relative z-10 flex flex-col items-center justify-center px-4 py-16 sm:py-24"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-center mb-12 sm:mb-16">
          Accountable Government Projects
        </h2>

        <div className="flex flex-col items-center w-full max-w-6xl mx-auto gap-12">
          {/* First row */}
          <div className="flex flex-col md:flex-row justify-center gap-12 w-full">
            <div className="flex-1 flex flex-col items-center text-center p-6">
              <p className="text-4xl sm:text-[50px]">👾</p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Project NFTs
              </h3>
              <p className="text-sm sm:text-base">
                Budget, timeline, signatories, and proposal PDFs are linked to
                the blockchain, ensuring every project is verifiable and secure.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center p-6">
              <p className="text-4xl sm:text-[50px]">🪙</p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Governance Tokens
              </h3>
              <p className="text-sm sm:text-base">
                Tokenized voting ensures only real approvers can vote,
                guaranteeing secure and equal participation in project approvals.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center p-6">
              <p className="text-4xl sm:text-[50px]">⚖</p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Immutable Voting & Audit Trail
              </h3>
              <p className="text-sm sm:text-base">
                Votes are recorded on-chain and cannot be tampered with,
                providing a full audit trail for transparency.
              </p>
            </div>
          </div>

          {/* Second row */}
          <div className="flex flex-col sm:flex-row justify-center gap-12 w-full md:w-auto">
            <div className="flex-1 flex flex-col items-center text-center p-6 max-w-xs">
              <p className="text-4xl sm:text-[50px]">☁️</p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Decentralized Storage
              </h3>
              <p className="text-sm sm:text-base">
                Project PDFs and metadata are stored on IPFS, making all
                information verifiable and permanent.
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center text-center p-6 max-w-xs">
              <p className="text-4xl sm:text-[50px]">📄</p>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                Public Dashboard
              </h3>
              <p className="text-sm sm:text-base">
                Citizens can track all projects, funding, and approvals in
                real-time, ensuring accountability and transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 bg-black text-white px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 text-lg w-full justify-center text-center">
            <a href="#about" className="hover:text-blue-400 transition">
              About
            </a>
            <a href="#Works" className="hover:text-blue-400 transition">
              How it Works
            </a>
            <a href="#Features" className="hover:text-blue-400 transition">
              Features
            </a>
            <Link
              href="/pblc/goverment/projects"
              className="hover:text-blue-400 transition"
            >
              Projects
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-400 text-sm sm:text-base">
          &copy; {new Date().getFullYear()} GovChain. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
