const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
  const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
  const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_MAINNET_URL || "https://polygon-rpc.com");
  const fsfox = new ethers.Contract(FSFOX, [
    "function tradingEnabled() view returns (bool)",
    "function allowedPools(address) view returns (bool)",
    "function allowedSpenders(address) view returns (bool)"
  ], provider);
  
  console.log("🔍 Checking Presale Status:");
  console.log("");
  console.log("FSFOX:", FSFOX);
  console.log("Pool:", POOL);
  console.log("SwapRouter:", SWAP_ROUTER);
  console.log("");
  
  try {
    const tradingEnabled = await fsfox.tradingEnabled();
    const poolAllowed = await fsfox.allowedPools(POOL);
    const swapRouterAllowed = await fsfox.allowedSpenders(SWAP_ROUTER);
    
    console.log("📊 Status:");
    console.log("  tradingEnabled:", tradingEnabled ? "true ✅" : "false ⚠️ (Presale active)");
    console.log("  Pool allowed:", poolAllowed ? "true ✅" : "false ❌");
    console.log("  SwapRouter allowed:", swapRouterAllowed ? "true ✅" : "false ❌");
    console.log("");
    
    if (!poolAllowed) {
      console.log("❌ Problem: Pool is not in allowlist!");
      console.log("   Solution: Execute setPool(POOL, true)");
    }
    
    if (!swapRouterAllowed) {
      console.log("❌ Problem: SwapRouter is not in allowedSpenders!");
      console.log("   Solution: Execute setSpender(SWAP_ROUTER, true)");
    }
    
    if (poolAllowed && swapRouterAllowed) {
      console.log("✅ Settings are correct!");
      console.log("");
      console.log("🔍 Check Other Issues:");
      console.log("  1. Pool liquidity: Check that Pool has liquidity");
      console.log("  2. Route: Uniswap may not find route");
      console.log("  3. Slippage: Increase slippage");
      console.log("  4. Allowance: Make sure USDC is approved");
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main().catch(console.error);
