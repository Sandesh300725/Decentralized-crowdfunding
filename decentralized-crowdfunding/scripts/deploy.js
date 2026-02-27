const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Crowdfunding contract...");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
  const crowdfunding = await Crowdfunding.deploy();
  await crowdfunding.waitForDeployment();

  const address = await crowdfunding.getAddress();
  console.log("Crowdfunding deployed to:", address);
  console.log("Add to frontend .env: VITE_CONTRACT_ADDRESS=" + address);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
