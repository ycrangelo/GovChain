import { network } from "hardhat";

async function main() {
  // 1. Connect to Hardhat EDR
  const { ethers } = await network.connect({
    network: "hardhatMainnet", // or "hardhatOp"
    chainType: "l1",           // use "op" if Optimism style
  });

  console.log("🚀 Deploying TokenApproval...");

  // 2. Deploy contract
  const TokenApproval = await ethers.getContractFactory("GovToken");
  const token = await TokenApproval.deploy();
  await token.waitForDeployment();

  console.log("✅ Contract deployed at:", await token.getAddress());

  // 3. Check contract balance
  let contractBal = await token.returnContractBalance();
  console.log("💰 Contract initial balance:", contractBal.toString());

  // 4. Add approvers (example: 2 addresses)
  const [_, addr1, addr2] = await ethers.getSigners();
  const approvers = [addr1.address, addr2.address];
  await token.addApprovers(approvers);
  console.log("👥 Added approvers:", approvers);

  // 5. Distribute tokens
  await token.destributeToken();
  console.log("🎉 Tokens distributed!");

  // 6. Check balances of approvers
  for (let i = 0; i < approvers.length; i++) {
    const bal = await token.balanceOf(approvers[i]);
    console.log(`🔹 Balance of ${approvers[i]}: ${bal.toString()}`);
  }

  // 7. Check remaining contract balance
  contractBal = await token.returnContractBalance();
  console.log("💰 Remaining contract balance:", contractBal.toString());
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
