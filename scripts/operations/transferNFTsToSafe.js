const { ethers } = require("hardhat");
require("dotenv").config();

const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

// ============================================
// Settings: List of NFT Token IDs to Transfer
// ============================================
// You can enter Token IDs of NFTs you want to transfer here
// To find NFTs, first run findAllNFTs.js
const NFT_TOKEN_IDS = [
  // Example:
  // "2740509",
  // "2743939",
];

async function main() {
  console.log("🚀 Transferring NFT Positions to Safe\n");
  
  if (NFT_TOKEN_IDS.length === 0) {
    console.log("❌ Error: NFT Token IDs list is empty!");
    console.log("");
    console.log("💡 Solution:");
    console.log("  1. First run findAllNFTs.js to find NFTs");
    console.log("  2. Enter Token IDs of NFTs you want to transfer in NFT_TOKEN_IDS");
    console.log("  3. Run this Script again");
    return;
  }
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Signer:", signer.address);
  console.log("  Safe:", SAFE);
  console.log("  NPM:", NPM);
  console.log("  NFT Count to Transfer:", NFT_TOKEN_IDS.length);
  console.log("");
  
  const npm = new ethers.Contract(NPM, [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) returns (void)",
    "function transferFrom(address from, address to, uint256 tokenId) returns (void)",
    "function getApproved(uint256 tokenId) view returns (address)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)"
  ], signer);
  
  // Check each NFT
  const nftsToTransfer = [];
  
  for (const tokenIdStr of NFT_TOKEN_IDS) {
    const tokenId = BigInt(tokenIdStr);
    
    try {
      const owner = await npm.ownerOf(tokenId);
      const position = await npm.positions(tokenId);
      
      console.log(`📋 NFT #${tokenIdStr}:`);
      console.log(`  Current Owner: ${owner}`);
      console.log(`  Token0: ${position.token0}`);
      console.log(`  Token1: ${position.token1}`);
      console.log(`  Liquidity: ${position.liquidity.toString()}`);
      
      if (owner.toLowerCase() === SAFE.toLowerCase()) {
        console.log(`  ✅ Already in Safe`);
      } else if (owner.toLowerCase() === signer.address.toLowerCase()) {
        console.log(`  ✅ You can transfer`);
        nftsToTransfer.push({ tokenId, owner, position });
      } else {
        console.log(`  ❌ You are not the Owner! Cannot transfer`);
        console.log(`  💡 Must transfer from address ${owner}`);
      }
      console.log("");
    } catch (error) {
      console.log(`  ❌ Error checking NFT #${tokenIdStr}:`, error.message);
      console.log("");
    }
  }
  
  if (nftsToTransfer.length === 0) {
    console.log("❌ No transferable NFTs found!");
    console.log("");
    console.log("💡 Check:");
    console.log("  1. Are NFTs at Signer address?");
    console.log("  2. Have NFTs already been transferred to Safe?");
    return;
  }
  
  console.log(`🔄 Transferring ${nftsToTransfer.length} NFTs to Safe...`);
  console.log("");
  
  // Check if signer is approved
  for (const nft of nftsToTransfer) {
    try {
      const approved = await npm.getApproved(nft.tokenId);
      const isApprovedForAll = await npm.isApprovedForAll(nft.owner, signer.address);
      
      if (approved.toLowerCase() !== signer.address.toLowerCase() && !isApprovedForAll) {
        console.log(`⚠️  NFT #${nft.tokenId.toString()}: Approval needed`);
        console.log(`  💡 Must approve this NFT from address ${nft.owner}`);
        console.log("");
      }
    } catch (error) {
      console.log(`  ⚠️  Error checking Approval for NFT #${nft.tokenId.toString()}:`, error.message);
    }
  }
  
  // Transfer NFTs
  for (const nft of nftsToTransfer) {
    try {
      console.log(`🔄 Transferring NFT #${nft.tokenId.toString()}...`);
      
      // Check if already in Safe
      const currentOwner = await npm.ownerOf(nft.tokenId);
      if (currentOwner.toLowerCase() === SAFE.toLowerCase()) {
        console.log(`  ✅ Already in Safe, skipping`);
        console.log("");
        continue;
      }
      
      // Check if signer is the owner
      if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
        console.log(`  ❌ You are not the Owner! (Owner: ${currentOwner})`);
        console.log("");
        continue;
      }
      
      // Transfer
      const tx = await npm.safeTransferFrom(signer.address, SAFE, nft.tokenId);
      console.log(`  📝 Transaction hash: ${tx.hash}`);
      console.log(`  ⏳ Waiting for confirmation...`);
      await tx.wait();
      console.log(`  ✅ Transfer successful!`);
      console.log(`  🔗 https://polygonscan.com/tx/${tx.hash}`);
      console.log("");
    } catch (error) {
      console.log(`  ❌ Error transferring NFT #${nft.tokenId.toString()}:`, error.message);
      if (error.data) {
        console.log(`  Data: ${error.data}`);
      }
      console.log("");
    }
  }
  
  console.log("═══════════════════════════════════════");
  console.log("✅ NFT Transfer Completed!");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("🔗 Final Check:");
  console.log(`  Safe: https://polygonscan.com/address/${SAFE}`);
  console.log(`  NPM: https://polygonscan.com/address/${NPM}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

