const { ethers } = require("hardhat");

/**
 * FSFOX Token Contract Deployment Script with New Owner
 * This script deploys the contract with a new owner address
 */
async function main() {
  console.log("🚀 Starting FSFOX Token contract deployment with new owner...");
  
  // Get deployer wallet address
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers found. Please check your private key in .env file.");
  }
  const deployer = signers[0];
  console.log("📝 Deployer:", deployer.address);
  
  // New owner address (Glad Polygon Safe)
  const newOwner = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
  console.log("🎯 New Owner:", newOwner);
  
  // Check wallet balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Wallet balance:", ethers.formatEther(balance), "ETH/MATIC");
  
  // Check sufficient balance for deployment
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low wallet balance. Deployment may fail.");
  }
  
  console.log("\n📋 FSFOX Contract Information:");
  console.log("- Name: FSFOX");
  console.log("- Symbol: FSFOX");
  console.log("- Total Supply: 1,000,000 tokens");
  console.log("- Locked Tokens: 950,000 tokens");
  console.log("- Free Tokens: 50,000 tokens");
  console.log("- New Contract Owner:", newOwner);
  
  // Get FSFOXToken contract
  const FSFOXToken = await ethers.getContractFactory("FSFOXToken");
  console.log("\n🔨 Deploying contract with new owner...");
  
  // Deploy contract with new owner address
  const fsfoxToken = await FSFOXToken.deploy(newOwner);
  await fsfoxToken.waitForDeployment();
  
  const contractAddress = await fsfoxToken.getAddress();
  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  
  // Get contract information
  const contractInfo = await fsfoxToken.getContractInfo();
  console.log("\n📊 Complete Contract Information:");
  console.log("- Token Name:", contractInfo.tokenName);
  console.log("- Token Symbol:", contractInfo.tokenSymbol);
  console.log("- Decimals:", contractInfo.tokenDecimals);
  console.log("- Total Supply:", ethers.formatUnits(contractInfo.totalTokenSupply, 18));
  console.log("- Locked Tokens:", ethers.formatUnits(contractInfo.lockedTokenSupply, 18));
  console.log("- Free Tokens:", ethers.formatUnits(contractInfo.freeTokenSupply, 18));
  console.log("- Contract Owner:", contractInfo.contractOwner);
  console.log("- Lock Contract Address:", contractInfo.contractLockAddress);
  console.log("- Mint Enabled:", contractInfo.mintEnabled ? "Yes" : "No");
  console.log("- Burn Enabled:", contractInfo.burnEnabled ? "Yes" : "No");
  
  // Check new owner balance
  const ownerBalance = await fsfoxToken.balanceOf(newOwner);
  console.log("\n💼 New Owner Balance:", ethers.formatUnits(ownerBalance, 18), "FSFOX");
  
  // Check lock contract balance
  const lockBalance = await fsfoxToken.balanceOf(contractInfo.contractLockAddress);
  console.log("🔒 Lock Contract Balance:", ethers.formatUnits(lockBalance, 18), "FSFOX");
  
  // Check total supply
  const totalSupply = await fsfoxToken.totalSupply();
  console.log("📈 Total Supply:", ethers.formatUnits(totalSupply, 18), "FSFOX");
  
  // Calculate gas cost
  const deploymentTx = fsfoxToken.deploymentTransaction();
  if (deploymentTx) {
    const receipt = await deploymentTx.wait();
    console.log("\n⛽ Gas Information:");
    console.log("- Gas Cost:", ethers.formatEther(receipt.gasUsed * receipt.gasPrice), "ETH/MATIC");
    console.log("- Gas Used:", receipt.gasUsed.toString());
    console.log("- Gas Price:", ethers.formatUnits(receipt.gasPrice, "gwei"), "Gwei");
  }
  
  console.log("\n🎉 Deployment completed successfully!");
  console.log("📋 To verify contract on Polygonscan, use the following command:");
  console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${newOwner}"`);
  
  // Save deployment information to file
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    owner: newOwner,
    deployer: deployer.address,
    totalSupply: ethers.formatUnits(totalSupply, 18),
    lockedSupply: ethers.formatUnits(contractInfo.lockedTokenSupply, 18),
    freeSupply: ethers.formatUnits(contractInfo.freeTokenSupply, 18),
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    `deployments/${hre.network.name}-deployment-new-owner.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`💾 Deployment information saved to deployments/${hre.network.name}-deployment-new-owner.json`);
}

// Execute main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
