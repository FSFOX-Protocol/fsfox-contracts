const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";

// Pool addresses
const POOL_USDC = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";

// Price references (USD)
const USDC_PRICE_USD = 1; // USDC = $1
const PAXG_PRICE_USD = 4000; // PAXG ≈ $4000 (based on previous calculations)

async function main() {
  console.log("📊 Calculating FSFOX Value Across Different Pools\n");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const provider = ethers.provider;
  
  // Contract interfaces
  const usdc = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const paxg = new ethers.Contract(PAXG, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const poolUSDC = new ethers.Contract(POOL_USDC, [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  const poolPAXG = new ethers.Contract(POOL_PAXG, [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  // Get decimals
  const usdcDecimals = await usdc.decimals();
  const paxgDecimals = await paxg.decimals();
  const fsfoxDecimals = await fsfox.decimals();
  
  console.log("🔢 Decimals:");
  console.log("  USDC:", usdcDecimals);
  console.log("  PAXG:", paxgDecimals);
  console.log("  FSFOX:", fsfoxDecimals);
  console.log("");
  
  // ==========================================
  // Pool 1: FSFOX / USDC
  // ==========================================
  console.log("═══════════════════════════════════════════════════════════");
  console.log("🏊 Pool 1: FSFOX / USDC");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const token0_USDC = await poolUSDC.token0();
  const token1_USDC = await poolUSDC.token1();
  
  const isFSFOXToken0_USDC = token0_USDC.toLowerCase() === FSFOX.toLowerCase();
  const isFSFOXToken1_USDC = token1_USDC.toLowerCase() === FSFOX.toLowerCase();
  
  console.log("📋 Pool Information:");
  console.log("  Address:", POOL_USDC);
  console.log("  Token0:", isFSFOXToken0_USDC ? "FSFOX" : "USDC", `(${token0_USDC})`);
  console.log("  Token1:", isFSFOXToken1_USDC ? "FSFOX" : "USDC", `(${token1_USDC})`);
  console.log("");
  
  // Get balances
  const usdcBalance = await usdc.balanceOf(POOL_USDC);
  const fsfoxBalance_USDC = await fsfox.balanceOf(POOL_USDC);
  
  const usdcAmount = parseFloat(ethers.formatUnits(usdcBalance, usdcDecimals));
  const fsfoxAmount_USDC = parseFloat(ethers.formatEther(fsfoxBalance_USDC));
  
  console.log("💰 Pool Balance:");
  console.log("  USDC:", usdcAmount.toFixed(6), "USDC");
  console.log("  FSFOX:", fsfoxAmount_USDC.toFixed(2), "FSFOX");
  console.log("");
  
  // Calculate price
  const fsfoxPriceInUSDC = usdcAmount / fsfoxAmount_USDC;
  const fsfoxValueInUSD_USDC = fsfoxPriceInUSDC * USDC_PRICE_USD;
  
  console.log("💵 FSFOX Price in this Pool:");
  console.log("  FSFOX/USDC:", fsfoxPriceInUSDC.toFixed(8), "USDC per FSFOX");
  console.log("  FSFOX/USD:", fsfoxValueInUSD_USDC.toFixed(8), "USD per FSFOX");
  console.log("");
  
  // Calculate total value of FSFOX in this pool
  const totalValueFSFOX_USDC = fsfoxAmount_USDC * fsfoxValueInUSD_USDC;
  
  console.log("📊 FSFOX Value in this Pool:");
  console.log("  FSFOX Amount:", fsfoxAmount_USDC.toFixed(2), "FSFOX");
  console.log("  Price per FSFOX:", fsfoxValueInUSD_USDC.toFixed(8), "USD");
  console.log("  Total Value:", totalValueFSFOX_USDC.toFixed(2), "USD");
  console.log("");
  
  // ==========================================
  // Pool 2: FSFOX / PAXG
  // ==========================================
  console.log("═══════════════════════════════════════════════════════════");
  console.log("🏊 Pool 2: FSFOX / PAXG");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const token0_PAXG = await poolPAXG.token0();
  const token1_PAXG = await poolPAXG.token1();
  
  const isFSFOXToken0_PAXG = token0_PAXG.toLowerCase() === FSFOX.toLowerCase();
  const isFSFOXToken1_PAXG = token1_PAXG.toLowerCase() === FSFOX.toLowerCase();
  
  console.log("📋 Pool Information:");
  console.log("  Address:", POOL_PAXG);
  console.log("  Token0:", isFSFOXToken0_PAXG ? "FSFOX" : "PAXG", `(${token0_PAXG})`);
  console.log("  Token1:", isFSFOXToken1_PAXG ? "FSFOX" : "PAXG", `(${token1_PAXG})`);
  console.log("");
  
  // Get balances
  const paxgBalance = await paxg.balanceOf(POOL_PAXG);
  const fsfoxBalance_PAXG = await fsfox.balanceOf(POOL_PAXG);
  
  const paxgAmount = parseFloat(ethers.formatUnits(paxgBalance, paxgDecimals));
  const fsfoxAmount_PAXG = parseFloat(ethers.formatEther(fsfoxBalance_PAXG));
  
  console.log("💰 Pool Balance:");
  console.log("  PAXG:", paxgAmount.toFixed(8), "PAXG");
  console.log("  FSFOX:", fsfoxAmount_PAXG.toFixed(2), "FSFOX");
  console.log("");
  
  // Calculate price
  const fsfoxPriceInPAXG = paxgAmount / fsfoxAmount_PAXG;
  const fsfoxValueInUSD_PAXG = fsfoxPriceInPAXG * PAXG_PRICE_USD;
  
  console.log("💵 FSFOX Price in this Pool:");
  console.log("  FSFOX/PAXG:", fsfoxPriceInPAXG.toFixed(10), "PAXG per FSFOX");
  console.log("  FSFOX/USD:", fsfoxValueInUSD_PAXG.toFixed(8), "USD per FSFOX");
  console.log("");
  
  // Calculate total value of FSFOX in this pool
  const totalValueFSFOX_PAXG = fsfoxAmount_PAXG * fsfoxValueInUSD_PAXG;
  
  console.log("📊 FSFOX Value in this Pool:");
  console.log("  FSFOX Amount:", fsfoxAmount_PAXG.toFixed(2), "FSFOX");
  console.log("  Price per FSFOX:", fsfoxValueInUSD_PAXG.toFixed(8), "USD");
  console.log("  Total Value:", totalValueFSFOX_PAXG.toFixed(2), "USD");
  console.log("");
  
  // ==========================================
  // Summary
  // ==========================================
  console.log("═══════════════════════════════════════════════════════════");
  console.log("📊 Summary and Answer to Question");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const totalFSFOXInPools = fsfoxAmount_USDC + fsfoxAmount_PAXG;
  const totalValueAllPools = totalValueFSFOX_USDC + totalValueFSFOX_PAXG;
  
  // Weighted average price
  const weightedAvgPrice = totalValueAllPools / totalFSFOXInPools;
  
  console.log("📈 General Information:");
  console.log("  Total FSFOX in all Pools:", totalFSFOXInPools.toFixed(2), "FSFOX");
  console.log("  Total FSFOX Value in all Pools:", totalValueAllPools.toFixed(2), "USD");
  console.log("  Weighted Average Price:", weightedAvgPrice.toFixed(8), "USD per FSFOX");
  console.log("");
  
  console.log("❓ Answer to Question:");
  console.log("");
  console.log("  Each pair (Pool) has a separate price for FSFOX:");
  console.log("");
  console.log("  1️⃣  Pool FSFOX/USDC:");
  console.log("     - Price:", fsfoxValueInUSD_USDC.toFixed(8), "USD per FSFOX");
  console.log("     - FSFOX Amount:", fsfoxAmount_USDC.toFixed(2), "FSFOX");
  console.log("     - Value:", totalValueFSFOX_USDC.toFixed(2), "USD");
  console.log("");
  console.log("  2️⃣  Pool FSFOX/PAXG:");
  console.log("     - Price:", fsfoxValueInUSD_PAXG.toFixed(8), "USD per FSFOX");
  console.log("     - FSFOX Amount:", fsfoxAmount_PAXG.toFixed(2), "FSFOX");
  console.log("     - Value:", totalValueFSFOX_PAXG.toFixed(2), "USD");
  console.log("");
  console.log("  ✅ Total FSFOX Value = Sum of FSFOX Values in all Pools");
  console.log("     =", totalValueFSFOX_USDC.toFixed(2), "+", totalValueFSFOX_PAXG.toFixed(2));
  console.log("     =", totalValueAllPools.toFixed(2), "USD");
  console.log("");
  console.log("  ⚠️  Important Note:");
  console.log("     - FSFOX price in each Pool may differ");
  console.log("     - This price difference causes Arbitrage");
  console.log("     - Arbitrageurs bring prices closer together");
  console.log("");
  
  // Price difference
  const priceDiff = Math.abs(fsfoxValueInUSD_USDC - fsfoxValueInUSD_PAXG);
  const priceDiffPercent = (priceDiff / Math.min(fsfoxValueInUSD_USDC, fsfoxValueInUSD_PAXG)) * 100;
  
  console.log("📊 Price Difference between Pools:");
  console.log("  Difference:", priceDiff.toFixed(8), "USD");
  console.log("  Percentage Difference:", priceDiffPercent.toFixed(2), "%");
  console.log("");
  
  if (priceDiffPercent > 1) {
    console.log("  ⚠️  Significant price difference! Arbitrage opportunity exists.");
  } else {
    console.log("  ✅ Prices are approximately the same.");
  }
  console.log("");
  
  console.log("🔗 Useful Links:");
  console.log("  Pool USDC: https://polygonscan.com/address/" + POOL_USDC);
  console.log("  Pool PAXG: https://polygonscan.com/address/" + POOL_PAXG);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

