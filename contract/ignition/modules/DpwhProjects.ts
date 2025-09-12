import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DpwhProjectsModule", (m) => {
  // Deploy the DpwhProjects contract
  const dpwhProjects = m.contract("DpwhProjects");

  // You can also call contract functions after deployment if needed.
  // Example: mint a sample project NFT immediately after deploy:
  m.call(dpwhProjects, "createProjectNft", [
    "Sample Project",
    "Manila City",
    1000000n,
    ["0xabc1234567890defabc1234567890defabc12345", "0x9fe817e5d29d20bc6a43f0ffa22b5c3baa5c1111"], // signatories
    ["0x7d7e5abe8c01b9e5c7f7a2a95b7e09ff73b9c222", "0x8ba432ee5cb90e99f3f2cc2a8b7e901dc99e4444"], // engineers
    ["0xdef4567890abc1234567890defabc12345678901", "0xccc111222333444555666777888999aaaabbbccc"], // contractors
    "2025-01-01",
    "2025-12-31",
    "ipfs://sampleProposalHash"
  ]);
  
  m.call(dpwhProjects, "projects", [1n]); // fetch project #1
  return { dpwhProjects };
});
