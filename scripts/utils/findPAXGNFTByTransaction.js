const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔍 Searching for NFT Token ID Related to FSFOX/PAXG Pool\n");
  console.log("💡 This Script uses a different method\n");
  
  const provider = ethers.provider;
  
  const npm = new ethers.Contract(NPM, [
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function balanceOf(address owner) view returns (uint256)"
  ], provider);
  
  // Pool ABI for Mint events
  const poolInterface = new ethers.Interface([
    "event Mint(address sender, address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)"
  ]);
  
  try {
    console.log("📋 Method 1: Checking Pool Transactions...");
    console.log("");
    
    // Get pool info
    const pool = new ethers.Contract(POOL_PAXG, [
      "function liquidity() view returns (uint128)"
    ], provider);
    
    const poolLiquidity = await pool.liquidity();
    console.log(`  Pool Liquidity: ${poolLiquidity.toString()}`);
    
    if (poolLiquidity === 0n) {
      console.log("  ❌ Pool has no Liquidity!");
      console.log("");
      console.log("💡 You must first add Liquidity");
      return;
    }
    
    console.log("  ✅ Pool has Liquidity");
    console.log("");
    
    // Method 2: Check all NFTs owned by known addresses
    console.log("📋 Method 2: Checking NFTs of Known Addresses...");
    console.log("");
    
    // Check Safe
    const safeBalance = await npm.balanceOf(SAFE);
    console.log(`  Safe (${SAFE}): ${safeBalance.toString()} NFT`);
    
    if (safeBalance > 0n) {
      for (let i = 0; i < safeBalance; i++) {
        try {
          const tokenId = await npm.tokenOfOwnerByIndex(SAFE, i);
          const position = await npm.positions(tokenId);
          
          // Check if this is the PAXG pool
          const isPAXGPool = (
            (position.token0.toLowerCase() === PAXG.toLowerCase() && 
             position.token1.toLowerCase() === FSFOX.toLowerCase()) ||
            (position.token0.toLowerCase() === FSFOX.toLowerCase() && 
             position.token1.toLowerCase() === PAXG.toLowerCase())
          ) && position.fee === 3000n;
          
          if (isPAXGPool) {
            console.log(`    ✅ NFT #${tokenId.toString()} - PAXG Pool Found!`);
            console.log("");
            displayNFTInfo(tokenId.toString(), SAFE, position);
            return;
          }
        } catch (error) {
          // Skip if error
          continue;
        }
      }
    }
    
    console.log("");
    console.log("📋 Method 3: Manual Search on Polygonscan...");
    console.log("");
    console.log("💡 To Find NFT Token ID:");
    console.log("");
    console.log("1. Go to NPM Contract:");
    console.log(`   https://polygonscan.com/address/${NPM}`);
    console.log("");
    console.log("2. Go to 'Events' tab");
    console.log("");
    console.log("3. Filter 'Transfer' events");
    console.log("   - 'from' should be '0x0000...' (mint)");
    console.log("   - 'to' is wallet address where NFT was minted to");
    console.log("");
    console.log("4. For each Transfer event:");
    console.log("   - Note Token ID");
    console.log("   - Go to NFT page:");
    console.log("     https://polygonscan.com/token/[NPM]?a=[TOKEN_ID]");
    console.log("   - In 'Read Contract' → 'positions' → Enter Token ID");
    console.log("   - Check that token0 and token1 are related to PAXG and FSFOX");
    console.log("");
    console.log("5. Or use 'Token Tracker':");
    console.log("   - Go to https://polygonscan.com/token/${NPM}");
    console.log("   - Check 'Holders'");
    console.log("   - For each holder, check NFTs");
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📝 After Finding Token ID:");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("1. Open file scripts/generateTransferNFTCalldata.js");
    console.log("2. Configure:");
    console.log("   const NFT_TOKEN_IDS = [\"TOKEN_ID\"];");
    console.log("   const CURRENT_OWNER = \"OWNER_ADDRESS\";");
    console.log("3. Run Script");
    console.log("");
    console.log("🔗 Useful Links:");
    console.log(`  Pool: https://polygonscan.com/address/${POOL_PAXG}`);
    console.log(`  NPM: https://polygonscan.com/address/${NPM}`);
    console.log(`  NPM Events: https://polygonscan.com/address/${NPM}#events`);
    console.log(`  NPM Token Tracker: https://polygonscan.com/token/${NPM}`);
    
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
  }
}

async function displayNFTInfo(tokenId, owner, position) {
  const npm = await ethers.getContractAt([
    "function ownerOf(uint256 tokenId) view returns (address)"
  ], NPM);
  
  const currentOwner = await npm.ownerOf(tokenId);
  const isInSafe = currentOwner.toLowerCase() === SAFE.toLowerCase();
  
  console.log("═══════════════════════════════════════");
  console.log("📊 NFT Position Information:");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log(`  Token ID: ${tokenId}`);
  console.log(`  Current Owner: ${currentOwner}`);
  console.log(`  Token0: ${position.token0}`);
  console.log(`  Token1: ${position.token1}`);
  console.log(`  Fee: ${position.fee}`);
  console.log(`  Liquidity: ${position.liquidity.toString()}`);
  console.log("");
  
  if (isInSafe) {
    console.log("✅ NFT Position is already in Safe!");
    console.log("");
    console.log(`🔗 Polygonscan: https://polygonscan.com/token/${NPM}?a=${tokenId}`);
  } else {
    console.log("⚠️  NFT Position is not in Safe!");
    console.log("");
    console.log("📝 To Transfer to Safe:");
    console.log("");
    console.log("1. Open file scripts/generateTransferNFTCalldata.js");
    console.log("2. Configure:");
    console.log(`   const NFT_TOKEN_IDS = ["${tokenId}"];`);
    console.log(`   const CURRENT_OWNER = "${currentOwner}";`);
    console.log("3. Run Script:");
    console.log("   npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon");
    console.log("4. Use Calldata in Gnosis Safe");
    console.log("");
    console.log(`🔗 Polygonscan NFT: https://polygonscan.com/token/${NPM}?a=${tokenId}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

