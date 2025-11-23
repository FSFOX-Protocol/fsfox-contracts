const { ethers } = require("hardhat");
require("dotenv").config();

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const QUICKSWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const FEE = 3000;

async function main() {
  console.log("🔍 Checking FSFOX/PAXG Pool Existence\n");
  
  const provider = ethers.provider;
  
  // Determine token order
  const token0 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? FSFOX : PAXG;
  const token1 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? PAXG : FSFOX;
  
  console.log("🔤 Token Order:");
  console.log("  token0:", token0 === FSFOX ? "FSFOX" : "PAXG", `(${token0})`);
  console.log("  token1:", token1 === FSFOX ? "FSFOX" : "PAXG", `(${token1})`);
  console.log("");
  
  // Check Pool
  const factory = new ethers.Contract(QUICKSWAP_V3_FACTORY, [
    "function getPool(address,address,uint24) view returns (address)"
  ], provider);
  
  const pool = await factory.getPool(token0, token1, FEE);
  
  if (pool === ethers.ZeroAddress) {
    console.log("❌ Pool does not exist");
    console.log("");
    console.log("💡 Must create Pool:");
    console.log("   Use Safe Transaction Builder");
    console.log("   Or use createPAXGPool.js (if you are Owner)");
  } else {
    console.log("✅ Pool exists!");
    console.log("  Pool Address:", pool);
    console.log("");
    
    // Check Pool status
    const poolContract = new ethers.Contract(pool, [
      "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)",
      "function token0() view returns (address)",
      "function token1() view returns (address)",
      "function fee() view returns (uint24)"
    ], provider);
    
    try {
      const slot0 = await poolContract.slot0();
      const initialized = slot0.unlocked;
      
      console.log("📊 Pool Status:");
      console.log("  Initialized:", initialized ? "✅ Yes" : "❌ No");
      
      if (initialized) {
        console.log("  sqrtPriceX96:", slot0.sqrtPriceX96.toString());
        console.log("  Tick:", slot0.tick.toString());
        console.log("");
        console.log("✅ Pool is ready! You can add Liquidity");
      } else {
        console.log("");
        console.log("⚠️  Pool is not Initialized!");
        console.log("   Must Initialize:");
        console.log("   1. Use generatePAXGPoolCalldata.js for Calldata");
        console.log("   2. Use Safe Transaction Builder to Initialize");
      }
    } catch (error) {
      console.log("⚠️  Error reading Pool:", error.message);
    }
  }
  
  console.log("");
  console.log("💡 If you have GS013 error:");
  console.log("  1. Check if Pool already exists (this Script)");
  console.log("  2. If Pool exists, just Initialize");
  console.log("  3. Use Transaction Builder (not direct Calldata)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

