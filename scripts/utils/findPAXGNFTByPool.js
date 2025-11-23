const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

async function main() {
  console.log("🔍 Searching for NFT Position Related to FSFOX/PAXG Pool\n");
  console.log("💡 This Script checks Pool transactions to find NFT Position\n");
  
  const provider = ethers.provider;
  
  const npm = new ethers.Contract(NPM, [
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ], provider);
  
  // Get recent transactions from Pool to find mint events
  console.log("📋 Checking Pool Transactions...");
  console.log("");
  console.log("💡 To find NFT Position:");
  console.log("  1. Go to Polygonscan Pool:");
  console.log(`     https://polygonscan.com/address/${POOL_PAXG}`);
  console.log("");
  console.log("  2. Go to 'Events' or 'Transactions' tab");
  console.log("  3. Find 'Mint' transaction");
  console.log("  4. In Logs, find 'Transfer' event");
  console.log("  5. Token ID is in 'tokenId' parameter");
  console.log("");
  console.log("  Or");
  console.log("");
  console.log("  1. Go to NPM Contract:");
  console.log(`     https://polygonscan.com/address/${NPM}`);
  console.log("");
  console.log("  2. Go to 'Events' tab");
  console.log("  3. Filter 'Transfer' events");
  console.log("  4. 'from' should be '0x0000...' (mint)");
  console.log("  5. Find Token ID");
  console.log("");
  console.log("═══════════════════════════════════════");
  console.log("📝 Usage Guide:");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("After finding Token ID:");
  console.log("");
  console.log("1. Open Script generateTransferNFTCalldata.js");
  console.log("2. Enter Token ID in NFT_TOKEN_IDS");
  console.log("3. Enter current Owner in CURRENT_OWNER");
  console.log("4. Run Script");
  console.log("5. Use Calldata in Gnosis Safe");
  console.log("");
  console.log("🔗 Useful Links:");
  console.log(`  Pool: https://polygonscan.com/address/${POOL_PAXG}`);
  console.log(`  NPM: https://polygonscan.com/address/${NPM}`);
  console.log(`  NPM Events: https://polygonscan.com/address/${NPM}#events`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

