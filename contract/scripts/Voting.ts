import { network } from "hardhat";

async function main() {
  // 1. Connect to Hardhat network
  const { ethers } = await network.connect({
    network: "localhost", // or "hardhatMainnet"
    chainType: "l1",      // use "op" if Optimism
  });

  console.log("🚀 Deploying Voting contract...");

  const govTokenAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // your GovToken
  const projectsAddr = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // your Projects

  // 2. Deploy Voting contract
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(govTokenAddr, projectsAddr);
  await voting.waitForDeployment(); // EDR syntax
  console.log("✅ Voting deployed at:", await voting.getAddress());

  // 3. Attach to Projects contract
  const Projects = await ethers.getContractFactory("Projects");
  const projects = Projects.attach(projectsAddr);

  // create a sample project NFT
  console.log("📌 Creating sample project...");
  const tx1 = await projects.createProjectNft(
    "Flood Control Project",
    "Cabuyao City",
    500_000n,
    ["0xabc1234567890defabc1234567890defabc12345"], // signatories
    ["0x7d7e5abe8c01b9e5c7f7a2a95b7e09ff73b9c222"], // engineers
    ["0xdef4567890abc1234567890defabc12345678901"], // contractors
    "2025-01-01",
    "2025-06-01",
    "ipfs://floodControlProposal"
  );
  await tx1.wait();
  console.log("✅ Project NFT minted");

  // 4. Attach to GovToken contract
  const GovToken = await ethers.getContractFactory("GovToken");
  const token = GovToken.attach(govTokenAddr);

  // 5. Get deployer signer
  const deployer = (await ethers.getSigners())[0];
  console.log("Deployer address:", deployer.address);

  // 6. Add deployer as approver and distribute token
  console.log("📌 Adding deployer as approver...");
  const tx2 = await token.connect(deployer).addApprovers([deployer.address]);
  await tx2.wait();

  console.log("📌 Distributing tokens...");
  const tx3 = await token.connect(deployer).distributeToken();
  await tx3.wait();

  const bal = await token.balanceOf(deployer.address);
  console.log("Deployer token balance:", bal.toString());

    console.log("📌 Creating vote session...");
  const eligibleVoters = [deployer.address]; // you can add more addresses
  const tx23 = await voting.connect(deployer).createVoteSession(1, eligibleVoters);
  await tx23.wait();
  console.log("✅ Vote session created");

  // 7. Cast a vote (YES)
  console.log("🗳 Casting vote...");
  const tx4 = await voting.connect(deployer).vote(1, true);
  await tx4.wait();
  console.log("✅ Vote submitted");

  // 8. Finalize vote
  // console.log("📊 Finalizing vote...");
  // const tx5 = await voting.connect(deployer).finalize(1);
  // await tx5.wait();
  // console.log("✅ Vote finalized");

  // 9. Fetch project status
  const project1 = await projects.projects(1);
  console.log("📝 Project #1 Status:", project1.status.toString()); // Approved or Rejected
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
