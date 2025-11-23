const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";

async function main() {
  console.log("🔍 Checking FSFOX/PAXG Liquidity Pool\n");
  
  const provider = ethers.provider;
  
  const pool = new ethers.Contract(POOL_PAXG, [
    "function liquidity() view returns (uint128)",
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  const paxg = new ethers.Contract(PAXG, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)"
  ], provider);
  
  try {
    const liquidity = await pool.liquidity();
    const token0 = await pool.token0();
    const token1 = await pool.token1();
    const slot0 = await pool.slot0();
    
    const paxgBalance = await paxg.balanceOf(POOL_PAXG);
    const fsfoxBalance = await fsfox.balanceOf(POOL_PAXG);
    const paxgDecimals = await paxg.decimals();
    
    console.log("📊 Pool Status:");
    console.log("  Liquidity (raw):", liquidity.toString());
    console.log("  Initialized:", slot0.unlocked ? "✅ Yes" : "❌ No");
    console.log("");
    
    console.log("💰 Pool Balance:");
    console.log("  PAXG:", ethers.formatUnits(paxgBalance, paxgDecimals));
    console.log("  FSFOX:", ethers.formatEther(fsfoxBalance));
    console.log("");
    
    if (liquidity === 0n || (paxgBalance === 0n && fsfoxBalance === 0n)) {
      console.log("❌ Problem: Pool has no Liquidity!");
      console.log("");
      console.log("💡 Solution:");
      console.log("  Must add Liquidity first");
      console.log("  Use addPAXGLiquidity.js or QuickSwap UI");
      console.log("");
      console.log("📋 Suggested Amounts:");
      console.log("  PAXG: 0.011500");
      console.log("  FSFOX: 43,261.74");
    } else {
      console.log("✅ Pool has Liquidity!");
      console.log("");
      console.log("💡 You can perform Swap");
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

