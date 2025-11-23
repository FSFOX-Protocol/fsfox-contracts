const { ethers } = require("hardhat");
require("dotenv").config();

const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔍 Checking Safe Balance\n");
  
  const provider = ethers.provider;
  
  // Check MATIC balance
  const maticBalance = await provider.getBalance(SAFE);
  const maticBalanceFormatted = ethers.formatEther(maticBalance);
  
  console.log("💰 Safe Balance:");
  console.log("  MATIC:", maticBalanceFormatted, "MATIC");
  console.log("");
  
  // Check Safe threshold
  const safeContract = new ethers.Contract(SAFE, [
    "function getThreshold() view returns (uint256)",
    "function getOwners() view returns (address[])",
    "function nonce() view returns (uint256)"
  ], provider);
  
  try {
    const threshold = await safeContract.getThreshold();
    const owners = await safeContract.getOwners();
    const nonce = await safeContract.nonce();
    
    console.log("👥 Safe Settings:");
    console.log("  Threshold:", threshold.toString(), "of", owners.length.toString());
    console.log("  Owners:", owners.length);
    console.log("  Nonce:", nonce.toString());
    console.log("");
  } catch (error) {
    console.log("⚠️  Error reading Safe settings:", error.message);
    console.log("");
  }
  
  // Check Gas Price
  const feeData = await provider.getFeeData();
  console.log("⛽ Gas Information:");
  console.log("  Gas Price:", ethers.formatUnits(feeData.gasPrice || 0n, "gwei"), "Gwei");
  console.log("");
  
  // Estimate Gas for a simple transaction
  const estimatedGas = 100000n; // Estimate
  const estimatedCost = (feeData.gasPrice || 0n) * estimatedGas;
  const estimatedCostFormatted = ethers.formatEther(estimatedCost);
  
  console.log("💡 Estimated Gas Cost:");
  console.log("  For a simple transaction:", estimatedCostFormatted, "MATIC");
  console.log("");
  
  // Check if balance is sufficient
  if (maticBalance < estimatedCost) {
    console.log("❌ Error: Insufficient MATIC balance!");
    console.log("  Required:", estimatedCostFormatted, "MATIC");
    console.log("  Available:", maticBalanceFormatted, "MATIC");
    console.log("");
    console.log("💡 Solution:");
    console.log("  1. Add MATIC to Safe");
    console.log("  2. Or use MetaMask for transaction");
  } else {
    console.log("✅ MATIC balance is sufficient");
  }
  
  console.log("");
  console.log("🔍 Checking GS013 Error:");
  console.log("  GS013 usually means:");
  console.log("  - Insufficient MATIC balance");
  console.log("  - Or issue with Safe settings");
  console.log("  - Or Safe threshold not set");
  console.log("");
  console.log("💡 Solutions:");
  console.log("  1. Add MATIC to Safe (at least 0.1 MATIC)");
  console.log("  2. Check that Safe threshold is set correctly");
  console.log("  3. Use MetaMask for transaction (if possible)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

