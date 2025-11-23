const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

async function main() {
  console.log("🔍 Searching for NFT Position Related to FSFOX/PAXG Pool\n");
  
  const provider = ethers.provider;
  
  const pool = new ethers.Contract(POOL_PAXG, [
    "function liquidity() view returns (uint128)",
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ], provider);
  
  const npm = new ethers.Contract(NPM, [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ], provider);
  
  try {
    // Check pool info
    const poolToken0 = await pool.token0();
    const poolToken1 = await pool.token1();
    const poolLiquidity = await pool.liquidity();
    
    console.log("📊 FSFOX/PAXG Pool Information:");
    console.log("  Pool Address:", POOL_PAXG);
    console.log("  Token0:", poolToken0);
    console.log("  Token1:", poolToken1);
    console.log("  Liquidity:", poolLiquidity.toString());
    console.log("");
    
    if (poolLiquidity === 0n) {
      console.log("❌ Pool has no Liquidity!");
      console.log("  💡 You must first add Liquidity");
      return;
    }
    
    // Search for NFT positions related to this pool
    // We'll check Safe first, then try to find by checking recent transactions
    console.log("🔍 Searching for NFT Position...");
    console.log("");
    
    // Check Safe
    const safeBalance = await npm.balanceOf(SAFE);
    console.log(`📍 Safe (${SAFE}):`);
    console.log(`  NFT Count: ${safeBalance.toString()}`);
    
    let foundNFT = null;
    
    if (safeBalance > 0n) {
      for (let i = 0; i < safeBalance; i++) {
        const tokenId = await npm.tokenOfOwnerByIndex(SAFE, i);
        const position = await npm.positions(tokenId);
        
        // Check if this is the PAXG pool
        const isPAXGPool = (
          (position.token0.toLowerCase() === PAXG.toLowerCase() && position.token1.toLowerCase() === FSFOX.toLowerCase()) ||
          (position.token0.toLowerCase() === FSFOX.toLowerCase() && position.token1.toLowerCase() === PAXG.toLowerCase())
        ) && position.fee === 3000n;
        
        if (isPAXGPool) {
          foundNFT = {
            tokenId: tokenId.toString(),
            owner: SAFE,
            position: position
          };
          console.log(`    ✅ NFT #${tokenId.toString()} - This NFT belongs to PAXG Pool!`);
          break;
        }
      }
    }
    
    console.log("");
    
    // If not found in Safe, we need to search elsewhere
    // Check recent transactions to find who created the liquidity
    if (!foundNFT) {
      console.log("⚠️  PAXG Pool NFT Position not found in Safe!");
      console.log("");
      console.log("💡 Solution:");
      console.log("  1. Check which address the NFT is at");
      console.log("  2. Check Pool transactions on Polygonscan");
      console.log("  3. Or find NFT from address that added Liquidity");
      console.log("");
      console.log("🔗 Check on Polygonscan:");
      console.log(`  Pool: https://polygonscan.com/address/${POOL_PAXG}`);
      console.log(`  NPM: https://polygonscan.com/address/${NPM}`);
      console.log("");
      console.log("📝 To transfer NFT:");
      console.log("  1. Find NFT Token ID");
      console.log("  2. Find current NFT Owner");
      console.log("  3. Use generateTransferNFTCalldata.js");
    } else {
      console.log("✅ PAXG Pool NFT Position is in Safe!");
      console.log("");
      console.log("📋 NFT Information:");
      console.log(`  Token ID: ${foundNFT.tokenId}`);
      console.log(`  Owner: ${foundNFT.owner}`);
      console.log(`  Token0: ${foundNFT.position.token0}`);
      console.log(`  Token1: ${foundNFT.position.token1}`);
      console.log(`  Fee: ${foundNFT.position.fee}`);
      console.log(`  Liquidity: ${foundNFT.position.liquidity.toString()}`);
      console.log("");
      console.log(`🔗 Polygonscan: https://polygonscan.com/token/${NPM}?a=${foundNFT.tokenId}`);
    }
    
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

