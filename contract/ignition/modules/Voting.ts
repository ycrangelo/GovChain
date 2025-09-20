import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VotingModule", (m) => {
  // Deploy the DpwhProjects contract
  const govTokenAddress = "0x6e4A757459c24059A237434f36a610A96f7146EA";   
  const projectsAddress = "0x88500d62c57bc0809EAfC11ed5125ed8d19fFF86";   

  // Pass addresses as constructor args
  const voting = m.contract("Voting", [govTokenAddress, projectsAddress]);

  return { voting };
});
