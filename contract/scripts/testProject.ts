import { network } from "hardhat";

async function main() {
  // 1. Connect to Hardhat EDR
  const { ethers } = await network.connect({
    network: "hardhatMainnet", // or "hardhatOp"
    chainType: "l1",           // use "op" if Optimism style
  });

  console.log("🚀 Deploying DpwhProjects...");

  // 2. Deploy contract
  const projects = await ethers.getContractFactory("Projects");
  const prjct = await projects.deploy();
  await prjct.waitForDeployment();

  console.log("✅ Contract deployed at:", await prjct.getAddress());

  // 3. Call createProjectNft
  const tx = await prjct.createProjectNft(
    "Sample Project",
    "Manila City",
    1_000_000n,
    [
      "0xabc1234567890defabc1234567890defabc12345",
      "0x9fe817e5d29d20bc6a43f0ffa22b5c3baa5c1111",
    ], // signatories
    [
      "0x7d7e5abe8c01b9e5c7f7a2a95b7e09ff73b9c222",
      "0x8ba432ee5cb90e99f3f2cc2a8b7e901dc99e4444",
    ], // engineers
    [
      "0xdef4567890abc1234567890defabc12345678901",
      "0xccc111222333444555666777888999aaaabbbccc",
    ], // contractors
    "2025-01-01",
    "2025-12-31",
    "ipfs://sampleProposalHash"
  );

  await tx.wait();
  console.log("📌 Project created successfully!");

  // 4. Fetch project #1
  const project1 = await prjct.projects(1);

  console.log("📝 Project #1:");
  console.log("ID:", project1.projectId.toString());
  console.log("Name:", project1.projectName);
  console.log("Location:", project1.location);
  console.log("Budget:", project1.budgetPeso.toString());
  console.log("Timeline:", project1.timelineStart, "→", project1.timelineEnd);
  console.log("Proposal:", project1.proposalLink);
  console.log("Status:", project1.status.toString());
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
