const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

async function main() {
  console.log("🔍 Checking NFT Position and FSFOX/PAXG Liquidity Pool\n");
  
  const provider = ethers.provider;
  
  // Check pool liquidity
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
  
  // Check NFT positions
  const npm = new ethers.Contract(NPM, [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)"
  ], provider);
  
  try {
    // Pool status
    const liquidity = await pool.liquidity();
    const token0 = await pool.token0();
    const token1 = await pool.token1();
    const slot0 = await pool.slot0();
    
    const paxgBalance = await paxg.balanceOf(POOL_PAXG);
    const fsfoxBalance = await fsfox.balanceOf(POOL_PAXG);
    const paxgDecimals = await paxg.decimals();
    
    console.log("📊 FSFOX/PAXG Pool Status:");
    console.log("  Pool Address:", POOL_PAXG);
    console.log("  Token0:", token0);
    console.log("  Token1:", token1);
    console.log("  Liquidity (raw):", liquidity.toString());
    console.log("  Initialized:", slot0.unlocked ? "✅ Yes" : "❌ No");
    console.log("");
    
    console.log("💰 Pool Balance:");
    console.log("  PAXG:", ethers.formatUnits(paxgBalance, paxgDecimals));
    console.log("  FSFOX:", ethers.formatEther(fsfoxBalance));
    console.log("");
    
    // Check NFT positions in Safe
    const safeNFTBalance = await npm.balanceOf(SAFE);
    console.log("🎨 NFT Positions in Safe:");
    console.log("  NFT Count:", safeNFTBalance.toString());
    console.log("");
    
    if (safeNFTBalance > 0n) {
      console.log("📋 NFT Positions List:");
      for (let i = 0; i < safeNFTBalance; i++) {
        const tokenId = await npm.tokenOfOwnerByIndex(SAFE, i);
        const position = await npm.positions(tokenId);
        
        console.log(`\n  NFT #${tokenId.toString()}:`);
        console.log("    Token0:", position.token0);
        console.log("    Token1:", position.token1);
        console.log("    Fee:", position.fee.toString());
        console.log("    Liquidity:", position.liquidity.toString());
        console.log("    TickLower:", position.tickLower.toString());
        console.log("    TickUpper:", position.tickUpper.toString());
        
        // Check if this is the PAXG pool
        const isPAXGPool = (
          (position.token0.toLowerCase() === PAXG.toLowerCase() && position.token1.toLowerCase() === FSFOX.toLowerCase()) ||
          (position.token0.toLowerCase() === FSFOX.toLowerCase() && position.token1.toLowerCase() === PAXG.toLowerCase())
        ) && position.fee === 3000n;
        
        if (isPAXGPool) {
          console.log("    ✅ This NFT is for FSFOX/PAXG Pool!");
        }
        
        console.log("    🔗 Polygonscan:", `https://polygonscan.com/token/${NPM}?a=${tokenId}`);
      }
    } else {
      console.log("  ❌ No NFT Position in Safe");
      console.log("");
      console.log("💡 To Add Liquidity:");
      console.log("  1. Use addPAXGLiquidity.js");
      console.log("  2. Or use QuickSwap UI");
      console.log("  3. NFT Position will be in Safe");
    }
    
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📊 Summary:");
    console.log("═══════════════════════════════════════");
    console.log("");
    
    if (liquidity > 0n) {
      console.log("✅ Pool has Liquidity");
    } else {
      console.log("❌ Pool has no Liquidity");
    }
    
    if (safeNFTBalance > 0n) {
      console.log("✅ NFT Position exists in Safe");
    } else {
      console.log("❌ NFT Position does not exist in Safe");
    }
    
    console.log("");
    console.log("🔗 Useful Links:");
    console.log("  Pool:", `https://polygonscan.com/address/${POOL_PAXG}`);
    console.log("  Safe:", `https://polygonscan.com/address/${SAFE}`);
    console.log("  NPM:", `https://polygonscan.com/address/${NPM}`);
    
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

