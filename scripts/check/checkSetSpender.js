const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
  const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_MAINNET_URL || "https://polygon-rpc.com");
  const fsfox = new ethers.Contract(FSFOX, [
    "function allowedSpenders(address) view returns (bool)"
  ], provider);
  
  console.log("🔍 Checking setSpender Status:");
  console.log("");
  console.log("Contract:", FSFOX);
  console.log("SwapRouter:", SWAP_ROUTER);
  console.log("");
  
  try {
    const isAllowed = await fsfox.allowedSpenders(SWAP_ROUTER);
    console.log("✅ Result:");
    console.log("  allowedSpenders(SwapRouter):", isAllowed ? "true ✅" : "false ❌");
    console.log("");
    if (isAllowed) {
      console.log("🎉 SwapRouter is correctly in allowedSpenders!");
      console.log("   Now you can test buy/sell through Uniswap.");
    } else {
      console.log("⚠️  SwapRouter is not in allowedSpenders!");
      console.log("   Please check the transaction again.");
    }
  } catch (error) {
    console.log("❌ Error checking:", error.message);
  }
}

main().catch(console.error);
