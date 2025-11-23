const { ethers } = require("hardhat");
require("dotenv").config();

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

async function main() {
  console.log("🔍 Checking FSFOX/PAXG Pool Settings\n");
  
  const provider = ethers.provider;
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function tradingEnabled() view returns (bool)",
    "function allowedPools(address) view returns (bool)",
    "function allowedSpenders(address) view returns (bool)",
    "function owner() view returns (address)"
  ], provider);
  
  try {
    const tradingEnabled = await fsfox.tradingEnabled();
    const poolAllowed = await fsfox.allowedPools(POOL_PAXG);
    const npmAllowed = await fsfox.allowedSpenders(NPM);
    const owner = await fsfox.owner();
    
    console.log("📊 Status:");
    console.log("  tradingEnabled:", tradingEnabled ? "true ✅" : "false ⚠️ (Presale active)");
    console.log("  Pool PAXG allowed:", poolAllowed ? "true ✅" : "false ❌");
    console.log("  NPM allowed:", npmAllowed ? "true ✅" : "false ❌");
    console.log("  Owner:", owner);
    console.log("");
    
    if (!poolAllowed) {
      console.log("❌ Problem: PAXG Pool is not in allowlist!");
      console.log("");
      console.log("💡 Solution: Add Pool to allowlist");
      console.log("");
      console.log("📋 From Safe:");
      console.log("  1. New Transaction → Contract interaction");
      console.log("  2. To:", FSFOX);
      console.log("  3. Function: setPool");
      console.log("  4. Parameters:");
      console.log("     pool:", POOL_PAXG);
      console.log("     allowed: true");
      console.log("  5. Submit → Sign → Execute");
      console.log("");
    }
    
    if (!npmAllowed) {
      console.log("❌ Problem: NPM is not in allowedSpenders!");
      console.log("");
      console.log("💡 Solution: Add NPM to allowedSpenders");
      console.log("");
      console.log("📋 From Safe:");
      console.log("  1. New Transaction → Contract interaction");
      console.log("  2. To:", FSFOX);
      console.log("  3. Function: setSpender");
      console.log("  4. Parameters:");
      console.log("     spender:", NPM);
      console.log("     allowed: true");
      console.log("  5. Submit → Sign → Execute");
      console.log("");
    }
    
    if (poolAllowed && npmAllowed) {
      console.log("✅ Settings are correct!");
      console.log("");
      console.log("🔍 If you still have errors:");
      console.log("  1. Check that you have sufficient balance");
      console.log("  2. Check that Approve has been done");
      console.log("  3. Check that Pool is Initialized");
    }
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

