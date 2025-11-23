const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

async function main() {
  console.log("🔍 Checking Pool Access in Uniswap API\n");
  
  const provider = ethers.provider;
  
  // Check Pool status on-chain
  const pool = new ethers.Contract(POOL, [
    "function liquidity() view returns (uint128)",
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function fee() view returns (uint24)",
    "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)"
  ], provider);
  
  const factory = new ethers.Contract(
    "0x1F98431c8aD98523631AE4a59f267346ea31F984", // Uniswap V3 Factory
    ["function getPool(address,address,uint24) view returns (address)"],
    provider
  );
  
  try {
    const token0 = await pool.token0();
    const token1 = await pool.token1();
    const fee = await pool.fee();
    const liquidity = await pool.liquidity();
    const slot0 = await pool.slot0();
    const poolFromFactory = await factory.getPool(token0, token1, fee);
    
    console.log("📊 Pool Status on Blockchain:");
    console.log("  ✅ Pool in Factory:", poolFromFactory.toLowerCase() === POOL.toLowerCase() ? "Yes" : "No");
    console.log("  ✅ Liquidity:", liquidity.toString());
    console.log("  ✅ Price initialized:", slot0[1] !== 0n ? "Yes" : "No");
    console.log("  ✅ Unlocked:", slot0[6] ? "Yes" : "No");
    console.log("");
    
    // Try to check via Uniswap Subgraph API (public endpoint)
    console.log("🌐 Checking Access in Uniswap API...");
    console.log("");
    
    const axios = require('axios');
    
    // Check if pool exists in Uniswap V3 Subgraph
    const subgraphUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
    
    const query = `
      {
        pools(
          where: {
            id: "${POOL.toLowerCase()}"
          }
        ) {
          id
          token0 { id symbol }
          token1 { id symbol }
          feeTier
          liquidity
          totalValueLockedUSD
          createdAtTimestamp
        }
      }
    `;
    
    try {
      console.log("  Checking Subgraph...");
      const response = await axios.post(subgraphUrl, { query });
      
      if (response.data && response.data.data && response.data.data.pools && response.data.data.pools.length > 0) {
        const poolData = response.data.data.pools[0];
        console.log("  ✅ Pool found in Subgraph!");
        console.log("  📅 Created:", new Date(parseInt(poolData.createdAtTimestamp) * 1000).toISOString());
        console.log("  💰 TVL:", poolData.totalValueLockedUSD || "N/A");
        console.log("  💧 Liquidity (Subgraph):", poolData.liquidity || "N/A");
        console.log("");
        console.log("  ⚠️  If Pool is in Subgraph but still returns 404:");
        console.log("     Issue may be with Trading API (trading-api-labs.interface.gateway)");
        console.log("     This API is separate from Subgraph and may index slower");
      } else {
        console.log("  ❌ Pool not found in Subgraph!");
        console.log("");
        console.log("  💡 This means Pool is not yet indexed");
        console.log("  ⏰ May take a few more days");
        console.log("  🔧 Use Direct Swap in the meantime");
      }
    } catch (error) {
      console.log("  ⚠️  Error connecting to Subgraph:", error.message);
      console.log("");
      console.log("  💡 Subgraph may have issues");
    }
    
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("🎯 Result and Recommendations:");
    console.log("═══════════════════════════════════════");
    console.log("");
    
    if (liquidity > 0n && slot0[1] !== 0n && slot0[6]) {
      console.log("✅ Your Pool is completely healthy:");
      console.log("   - Active on blockchain");
      console.log("   - Has Liquidity");
      console.log("   - Price initialized");
      console.log("");
      console.log("⚠️  Issue is from Uniswap API side:");
      console.log("   - Trading API may not have indexed Pool yet");
      console.log("   - This is a temporary issue");
      console.log("");
      console.log("🔧 Current Solutions:");
      console.log("   1. ✅ Use Direct Swap Script:");
      console.log("      npx hardhat run scripts/operations/buyFSFOX.js --network polygon");
      console.log("");
      console.log("   2. ✅ Use Polygonscan Write Contract:");
      console.log("      Call SwapRouter directly");
      console.log("");
      console.log("   3. ⏰ Wait (may take a few more days)");
      console.log("");
      console.log("   4. 📧 Contact Uniswap Support:");
      console.log("      - Discord: https://discord.gg/uniswap");
      console.log("      - GitHub: https://github.com/Uniswap");
      console.log("");
      console.log("📝 Pool Information to Send to Uniswap:");
      console.log("   Pool Address:", POOL);
      console.log("   Token0 (USDC):", token0);
      console.log("   Token1 (FSFOX):", token1);
      console.log("   Fee Tier:", fee.toString());
      console.log("   Created: ~3 days ago");
    } else {
      console.log("❌ Pool has issues!");
      console.log("   Please check the Pool");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

