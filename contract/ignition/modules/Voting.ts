import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingModule", (m) => {
  // Deploy the DpwhProjects contract
  const govTokenAddress = "0x6e4A757459c24059A237434f36a610A96f7146EA";   
  const projectsAddress = "0xF6B2A9c1b3Cbd44C49EF45A22a821B93205c684a";   

  // Pass addresses as constructor args
  const voting = m.contract("Voting", [govTokenAddress, projectsAddress]);

  return { voting };
});
