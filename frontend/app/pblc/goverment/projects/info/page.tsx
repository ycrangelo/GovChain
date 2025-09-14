import { Button } from "@heroui/button";
import Link from "next/link";


export default function ProjectInfo() {

  // Dummy NFT data
  const project = {
    name: `Project 1`,
    location: "Cebu City",
    budget: "₱10,000,000",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    signatories: ["Mayor Juan", "Engineer Ana"],
    pdfProposal: "https://example.com/proposal.pdf",
    status: "Ongoing",
    nftContract: "0x1234567890abcdef1234567890abcdef12345678", // example ERC-721 contract
    tokenId: 1,
  };

  const etherscanLink = `https://etherscan.io/token/${project.nftContract}?a=${project.tokenId}`;

  return (
    <div className="min-h-screen bg-black text-white px-20 py-10">
      {/* Back Button */}

      {/* Project Info */}
      <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
      <p className="text-gray-300 mb-2"><strong>Location:</strong> {project.location}</p>
      <p className="text-gray-300 mb-2"><strong>Budget Allocation:</strong> {project.budget}</p>
      <p className="text-gray-300 mb-2"><strong>Start Date:</strong> {project.startDate}</p>
      <p className="text-gray-300 mb-2"><strong>End Date:</strong> {project.endDate}</p>
      <p className="text-gray-300 mb-2"><strong>Signatories / Approvers:</strong> {project.signatories.join(", ")}</p>
      <p className="text-gray-300 mb-2">
        <strong>PDF Proposal:</strong>{" "}
        <a href={project.pdfProposal} target="_blank" rel="noreferrer" className="text-blue-400 underline">
          View PDF
        </a>
      </p>
      <p className="text-gray-300 mb-4"><strong>Status:</strong> {project.status}</p>

      {/* Verify Button */}
        <div className="flex flex-col gap-4">
                  <a href={etherscanLink} target="_blank" rel="noopener noreferrer">
        <Button variant="light" className="bg-white text-black hover:bg-gray-300">
          Verify this Project
        </Button>
      </a>
            <Link href="/pblc/goverment/projects">
        <Button variant="light" className="mb-6 bg-white text-black hover:bg-gray-300">
          Back
        </Button>
      </Link>
        </div>
    </div>
  );
}
