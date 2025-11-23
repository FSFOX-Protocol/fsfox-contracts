const { ethers } = require("hardhat");
require("dotenv").config();

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  const provider = ethers.provider;
  
  const fsfoxContract = new ethers.Contract(FSFOX, [
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function lockedTokens() view returns (uint256)",
    "function getLockedSupply() pure returns (uint256)",
    "function getFreeSupply() pure returns (uint256)"
  ], provider);
  
  try {
    console.log("📊 Complete FSFOX Token Status\n");
    
    // Total Supply
    const totalSupply = await fsfoxContract.totalSupply();
    console.log("📈 Total Supply:");
    console.log("  Amount:", ethers.formatEther(totalSupply), "FSFOX");
    console.log("  Amount (raw):", totalSupply.toString());
    console.log("");
    
    // Locked Supply (constant)
    const lockedSupply = await fsfoxContract.getLockedSupply();
    console.log("🔒 Locked Supply (constant):");
    console.log("  Amount:", ethers.formatEther(lockedSupply), "FSFOX");
    console.log("");
    
    // Free Supply (constant)
    const freeSupply = await fsfoxContract.getFreeSupply();
    console.log("🆓 Free Supply (constant):");
    console.log("  Amount:", ethers.formatEther(freeSupply), "FSFOX");
    console.log("");
    
    // Current Locked Tokens (remaining)
    const currentLocked = await fsfoxContract.lockedTokens();
    console.log("🔐 Locked Tokens (remaining - can be Unlocked):");
    console.log("  Amount:", ethers.formatEther(currentLocked), "FSFOX");
    console.log("  Amount (raw):", currentLocked.toString());
    console.log("");
    
    // Pool Balance
    const poolBalance = await fsfoxContract.balanceOf(POOL);
    console.log("💧 Pool Balance:");
    console.log("  Amount:", ethers.formatEther(poolBalance), "FSFOX");
    console.log("  ⚠️  These tokens are in Pool and used for Liquidity");
    console.log("  ⚠️  Cannot transfer them directly to Safe");
    console.log("  ⚠️  To remove, must Remove Liquidity (Pool will be destroyed)");
    console.log("");
    
    // Safe Balance
    const safeBalance = await fsfoxContract.balanceOf(SAFE);
    console.log("🏦 Safe Balance:");
    console.log("  Amount:", ethers.formatEther(safeBalance), "FSFOX");
    console.log("");
    
    // Contract Balance (Locked tokens stored here)
    const contractBalance = await fsfoxContract.balanceOf(FSFOX);
    console.log("📦 Contract Balance (Locked Tokens):");
    console.log("  Amount:", ethers.formatEther(contractBalance), "FSFOX");
    console.log("  These tokens are transferred to Safe via unlockTokens()");
    console.log("");
    
    // Calculations
    const unlockedSoFar = lockedSupply - currentLocked;
    console.log("📊 Calculations:");
    console.log("  Locked Supply (total):", ethers.formatEther(lockedSupply), "FSFOX");
    console.log("  Unlocked so far:", ethers.formatEther(unlockedSoFar), "FSFOX");
    console.log("  Remaining Locked:", ethers.formatEther(currentLocked), "FSFOX");
    console.log("");
    
    // Distribution Check
    console.log("🔍 Token Distribution:");
    console.log("  Pool:", ethers.formatEther(poolBalance), "FSFOX");
    console.log("  Safe:", ethers.formatEther(safeBalance), "FSFOX");
    console.log("  Contract (Locked):", ethers.formatEther(contractBalance), "FSFOX");
    const totalDistributed = poolBalance + safeBalance + contractBalance;
    console.log("  Total:", ethers.formatEther(totalDistributed), "FSFOX");
    console.log("");
    
    // Guidance
    console.log("💡 Guidance:");
    console.log("");
    console.log("✅ To Transfer Tokens to Safe:");
    console.log("   Use unlockTokens()");
    console.log("   Amount Available to Unlock:", ethers.formatEther(currentLocked), "FSFOX");
    console.log("");
    console.log("❌ Cannot Transfer Pool Tokens Directly to Safe:");
    console.log("   - These tokens are used for Liquidity");
    console.log("   - To remove, must Remove Liquidity Position");
    console.log("   - This will destroy the Pool");
    console.log("");
    
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

