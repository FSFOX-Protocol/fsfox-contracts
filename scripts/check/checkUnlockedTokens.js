const { ethers } = require("hardhat");
require("dotenv").config();

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";

async function main() {
  console.log("🔍 Checking Unlocked Tokens Amount\n");
  
  const provider = ethers.provider;
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function TOTAL_SUPPLY() view returns (uint256)",
    "function LOCKED_SUPPLY() view returns (uint256)",
    "function lockedTokens() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)"
  ], provider);
  
  try {
    // Get constants
    const TOTAL_SUPPLY = await fsfox.TOTAL_SUPPLY();
    const LOCKED_SUPPLY = await fsfox.LOCKED_SUPPLY();
    const lockedTokens = await fsfox.lockedTokens();
    
    // Calculate unlocked tokens
    const unlockedTokens = LOCKED_SUPPLY - lockedTokens;
    
    console.log("📊 Token Information:");
    console.log("  TOTAL_SUPPLY:", ethers.formatEther(TOTAL_SUPPLY), "FSFOX");
    console.log("  LOCKED_SUPPLY (constant):", ethers.formatEther(LOCKED_SUPPLY), "FSFOX");
    console.log("  lockedTokens (current):", ethers.formatEther(lockedTokens), "FSFOX");
    console.log("");
    
    console.log("═══════════════════════════════════════");
    console.log("📊 Unlocked Tokens Amount:");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("  Unlocked = LOCKED_SUPPLY - lockedTokens");
    console.log(`  Unlocked = ${ethers.formatEther(LOCKED_SUPPLY)} - ${ethers.formatEther(lockedTokens)}`);
    console.log(`  Unlocked = ${ethers.formatEther(unlockedTokens)} FSFOX`);
    console.log("");
    
    // Check expected value
    const expectedUnlocked = ethers.parseEther("92293.9");
    const difference = unlockedTokens > expectedUnlocked 
      ? unlockedTokens - expectedUnlocked 
      : expectedUnlocked - unlockedTokens;
    
    console.log("🔍 Comparison with Expected Value:");
    console.log("  Expected Value: 92,293.9 FSFOX");
    console.log("  Current Value:", ethers.formatEther(unlockedTokens), "FSFOX");
    console.log("");
    
    if (difference < ethers.parseEther("0.1")) {
      console.log("  ✅ Value is correct!");
    } else {
      console.log("  ⚠️  Difference:", ethers.formatEther(difference), "FSFOX");
    }
    console.log("");
    
    // Check contract balance
    const contractBalance = await fsfox.balanceOf(FSFOX);
    console.log("💰 Contract Balance (Locked):");
    console.log("  Balance:", ethers.formatEther(contractBalance), "FSFOX");
    console.log("  lockedTokens:", ethers.formatEther(lockedTokens), "FSFOX");
    console.log("");
    
    if (contractBalance.toString() === lockedTokens.toString()) {
      console.log("  ✅ Contract Balance matches lockedTokens");
    } else {
      console.log("  ⚠️  Contract Balance differs from lockedTokens");
      console.log("  Difference:", ethers.formatEther(contractBalance > lockedTokens ? contractBalance - lockedTokens : lockedTokens - contractBalance), "FSFOX");
    }
    console.log("");
    
    console.log("🔗 Polygonscan:");
    console.log(`  Contract: https://polygonscan.com/address/${FSFOX}`);
    console.log(`  Read Contract: https://polygonscan.com/address/${FSFOX}#readContract`);
    console.log("");
    console.log("💡 To Check on Polygonscan:");
    console.log("  1. Go to Read Contract");
    console.log("  2. Execute Function 'lockedTokens'");
    console.log("  3. Compare value with 857,706.1 FSFOX");
    console.log("  4. Unlocked = 950,000 - lockedTokens");
    
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

