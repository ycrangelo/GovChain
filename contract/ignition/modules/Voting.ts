import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingModule", (m) => {
  // Deploy the DpwhProjects contract
  const govTokenAddress = "0x6e4A757459c24059A237434f36a610A96f7146EA";   
  const projectsAddress = "0x3E1623c2F0B9CB1f1558b4B126f0458792Bc8009";   

  // Pass addresses as constructor args
  const voting = m.contract("Voting", [govTokenAddress, projectsAddress]);

  return { voting };
});
