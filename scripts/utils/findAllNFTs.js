const { ethers } = require("hardhat");
require("dotenv").config();

const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔍 Searching for All NFT Positions Related to FSFOX\n");
  
  const provider = ethers.provider;
  
  const npm = new ethers.Contract(NPM, [
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ], provider);
  
  // Addresses to check
  const addressesToCheck = [
    SAFE,
    // Add other addresses if needed
  ];
  
  // Also check if there are NFTs in other common addresses
  // We'll search by checking recent transactions or known addresses
  
  console.log("📋 Checking NFT Positions:\n");
  
  let totalNFTs = 0;
  const allNFTs = [];
  
  for (const address of addressesToCheck) {
    try {
      const balance = await npm.balanceOf(address);
      console.log(`📍 ${address}:`);
      console.log(`  NFT Count: ${balance.toString()}`);
      
      if (balance > 0n) {
        for (let i = 0; i < balance; i++) {
          const tokenId = await npm.tokenOfOwnerByIndex(address, i);
          const position = await npm.positions(tokenId);
          
          // Check if this NFT is related to FSFOX
          const isFSFOXRelated = (
            position.token0.toLowerCase() === FSFOX.toLowerCase() ||
            position.token1.toLowerCase() === FSFOX.toLowerCase()
          );
          
          if (isFSFOXRelated) {
            totalNFTs++;
            allNFTs.push({
              tokenId: tokenId.toString(),
              owner: address,
              token0: position.token0,
              token1: position.token1,
              fee: position.fee.toString(),
              liquidity: position.liquidity.toString(),
              tickLower: position.tickLower.toString(),
              tickUpper: position.tickUpper.toString()
            });
            
            console.log(`    NFT #${tokenId.toString()}:`);
            console.log(`      Token0: ${position.token0}`);
            console.log(`      Token1: ${position.token1}`);
            console.log(`      Fee: ${position.fee}`);
            console.log(`      Liquidity: ${position.liquidity.toString()}`);
            
            // Identify pool
            let poolType = "Unknown";
            if (position.token0.toLowerCase() === USDC.toLowerCase() || position.token1.toLowerCase() === USDC.toLowerCase()) {
              poolType = "FSFOX/USDC";
            } else if (position.token0.toLowerCase() === PAXG.toLowerCase() || position.token1.toLowerCase() === PAXG.toLowerCase()) {
              poolType = "FSFOX/PAXG";
            }
            console.log(`      Pool: ${poolType}`);
            console.log(`      🔗 https://polygonscan.com/token/${NPM}?a=${tokenId}`);
          }
        }
      }
      console.log("");
    } catch (error) {
      console.log(`  ❌ Error checking ${address}:`, error.message);
    }
  }
  
  console.log("═══════════════════════════════════════");
  console.log("📊 Summary:");
  console.log("═══════════════════════════════════════");
  console.log(`  Total FSFOX NFTs: ${totalNFTs}`);
  console.log("");
  
  // Check which NFTs are NOT in Safe
  const nftsNotInSafe = allNFTs.filter(nft => nft.owner.toLowerCase() !== SAFE.toLowerCase());
  
  if (nftsNotInSafe.length > 0) {
    console.log("⚠️  NFTs Not in Safe:");
    nftsNotInSafe.forEach(nft => {
      console.log(`  - NFT #${nft.tokenId} (Owner: ${nft.owner})`);
    });
    console.log("");
    console.log("💡 To transfer these NFTs to Safe:");
    console.log("  Use Script transferNFTsToSafe.js");
  } else {
    console.log("✅ All FSFOX NFTs are in Safe!");
  }
  
  console.log("");
  console.log("🔗 Useful Links:");
  console.log(`  Safe: https://polygonscan.com/address/${SAFE}`);
  console.log(`  NPM: https://polygonscan.com/address/${NPM}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

