const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const POOL_PAXG = ""; // Enter Pool address
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const FEE = 3000; // 0.3%

// ============================================
// Settings: Desired Operation
// ============================================
// To add Liquidity:
const ADD_LIQUIDITY = true;
const AMOUNT_PAXG_ADD = "0.01"; // PAXG amount to add
const AMOUNT_FSFOX_ADD = ""; // Empty = auto-calculate

// To remove Liquidity:
const REMOVE_LIQUIDITY = false;
const PERCENTAGE_REMOVE = 10; // Percentage of Liquidity to remove (0-100)

// To change price range:
const CHANGE_RANGE = false;
const NEW_TICK_LOWER = -887220; // New lower range
const NEW_TICK_UPPER = 887220;  // New upper range

// NFT Token ID (after first Mint, you will receive this ID)
const TOKEN_ID = ""; // Enter NFT Position Token ID here

async function main() {
  console.log("🔧 Managing FSFOX/PAXG Liquidity Pool\n");
  
  if (!POOL_PAXG || POOL_PAXG === "") {
    console.log("❌ Error: Enter Pool address!");
    return;
  }
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Signer:", signer.address);
  console.log("  Pool:", POOL_PAXG);
  console.log("");
  
  const npm = await ethers.getContractAt(
    [
      "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
      "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) returns (uint256 tokenId,uint128 liquidity,uint256 amount0,uint256 amount1)",
      "function increaseLiquidity((uint256 tokenId,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,uint256 deadline)) returns (uint128 liquidity,uint256 amount0,uint256 amount1)",
      "function decreaseLiquidity((uint256 tokenId,uint128 liquidity,uint256 amount0Min,uint256 amount1Min,uint256 deadline)) returns (uint256 amount0,uint256 amount1)",
      "function collect((uint256 tokenId,address recipient,uint128 amount0Max,uint128 amount1Max)) returns (uint256 amount0,uint256 amount1)"
    ],
    NPM,
    signer
  );
  
  // If we have Token ID, check Position status
  if (TOKEN_ID && TOKEN_ID !== "") {
    try {
      const position = await npm.positions(TOKEN_ID);
      console.log("📊 Position Status (Token ID:", TOKEN_ID, "):");
      console.log("  Liquidity:", position.liquidity.toString());
      console.log("  Tick Lower:", position.tickLower.toString());
      console.log("  Tick Upper:", position.tickUpper.toString());
      console.log("  Token0:", position.token0);
      console.log("  Token1:", position.token1);
      console.log("");
    } catch (error) {
      console.log("⚠️  Error reading Position:", error.message);
      console.log("");
    }
  }
  
  // Add Liquidity
  if (ADD_LIQUIDITY) {
    console.log("➕ Adding Liquidity...");
    
    if (!TOKEN_ID || TOKEN_ID === "") {
      console.log("  ⚠️  No Token ID - use addPAXGLiquidity.js for first time");
    } else {
      // Increase liquidity for existing position
      console.log("  Increasing Liquidity for existing Position...");
      // TODO: Implement increaseLiquidity
      console.log("  ⚠️  This feature is under development");
    }
    console.log("");
  }
  
  // Remove Liquidity
  if (REMOVE_LIQUIDITY) {
    console.log("➖ Removing Liquidity...");
    
    if (!TOKEN_ID || TOKEN_ID === "") {
      console.log("  ❌ Error: Token ID required!");
    } else {
      // TODO: Implement decreaseLiquidity
      console.log("  ⚠️  This feature is under development");
    }
    console.log("");
  }
  
  // Change price range
  if (CHANGE_RANGE) {
    console.log("🔄 Changing Price Range...");
    console.log("  ⚠️  To change range, you must Remove Position and Mint again with new range");
    console.log("");
  }
  
  console.log("💡 Guidance:");
  console.log("  - To add Liquidity: use addPAXGLiquidity.js");
  console.log("  - To remove: manage Position in QuickSwap UI");
  console.log("  - To change range: Remove Position and Mint again");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

