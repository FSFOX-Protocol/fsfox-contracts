const { ethers } = require("hardhat");
require("dotenv").config();

const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const NFT_TOKEN_ID = "2751156"; // NFT Position Pool FSFOX/PAXG

async function main() {
  console.log("🚀 Transferring PAXG Pool NFT Position to Safe\n");
  
  if (!process.env.PRIVATE_KEY) {
    console.log("❌ Error: PRIVATE_KEY not set in .env!");
    console.log("");
    console.log("💡 Solution:");
    console.log("  1. Open .env file");
    console.log("  2. Add PRIVATE_KEY:");
    console.log("     PRIVATE_KEY=your_private_key_here");
    console.log("  3. Run Script again");
    return;
  }
  
  // Create signer from private key
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || "https://polygon-rpc.com");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("📝 Information:");
  console.log("  Signer:", wallet.address);
  console.log("  Safe:", SAFE);
  console.log("  NPM:", NPM);
  console.log("  NFT Token ID:", NFT_TOKEN_ID);
  console.log("");
  
  const npm = new ethers.Contract(NPM, [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function safeTransferFrom(address from, address to, uint256 tokenId)",
    "function getApproved(uint256 tokenId) view returns (address)",
    "function isApprovedForAll(address owner, address operator) view returns (bool)",
    "function setApprovalForAll(address operator, bool approved)"
  ], wallet);
  
  try {
    // Check current owner
    const currentOwner = await npm.ownerOf(NFT_TOKEN_ID);
    console.log("📋 Checking NFT:");
    console.log("  Current Owner:", currentOwner);
    console.log("  Signer:", wallet.address);
    console.log("");
    
    if (currentOwner.toLowerCase() !== wallet.address.toLowerCase()) {
      console.log("❌ Error: You are not the Owner of this NFT!");
      console.log("");
      console.log("💡 Solution:");
      console.log("  PRIVATE_KEY must belong to current Owner:");
      console.log("  " + currentOwner);
      return;
    }
    
    // Check if already in Safe
    if (currentOwner.toLowerCase() === SAFE.toLowerCase()) {
      console.log("✅ NFT is already in Safe!");
      console.log("");
      console.log(`🔗 Polygonscan: https://polygonscan.com/token/${NPM}?a=${NFT_TOKEN_ID}`);
      return;
    }
    
    // Check position info
    const position = await npm.positions(NFT_TOKEN_ID);
    console.log("📊 Position Information:");
    console.log("  Token0:", position.token0);
    console.log("  Token1:", position.token1);
    console.log("  Fee:", position.fee.toString());
    console.log("  Liquidity:", position.liquidity.toString());
    console.log("");
    
    // Check approval
    const approved = await npm.getApproved(NFT_TOKEN_ID);
    const isApprovedForAll = await npm.isApprovedForAll(wallet.address, SAFE);
    
    console.log("✅ Checking Approve:");
    console.log("  Approved (for this NFT):", approved);
    console.log("  Approved For All (Safe):", isApprovedForAll ? "✅ Yes" : "❌ No");
    console.log("");
    
    if (!isApprovedForAll && approved.toLowerCase() !== SAFE.toLowerCase()) {
      console.log("⚠️  Approval needed!");
      console.log("");
      console.log("🔓 Approving...");
      
      // Approve Safe
      const approveTx = await npm.setApprovalForAll(SAFE, true);
      console.log("  📝 Transaction hash:", approveTx.hash);
      console.log("  ⏳ Waiting for confirmation...");
      await approveTx.wait();
      console.log("  ✅ Approve successful!");
      console.log("");
    }
    
    // Transfer NFT
    console.log("🔄 Transferring NFT to Safe...");
    console.log("");
    
    const transferTx = await npm.safeTransferFrom(wallet.address, SAFE, NFT_TOKEN_ID);
    console.log("  📝 Transaction hash:", transferTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    console.log(`  🔗 Polygonscan: https://polygonscan.com/tx/${transferTx.hash}`);
    console.log("");
    
    const receipt = await transferTx.wait();
    console.log("  ✅ Transfer successful!");
    console.log("  📊 Block:", receipt.blockNumber);
    console.log("  ⛽ Gas used:", receipt.gasUsed.toString());
    console.log("");
    
    // Verify transfer (wait a bit for block confirmation)
    console.log("  ⏳ Waiting for block confirmation...");
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    
    const newOwner = await npm.ownerOf(NFT_TOKEN_ID);
    console.log("✅ Final Check:");
    console.log("  New Owner:", newOwner);
    
    if (newOwner.toLowerCase() === SAFE.toLowerCase()) {
      console.log("  ✅ NFT is in Safe!");
    } else {
      console.log("  ⚠️  NFT is not in Safe yet!");
      console.log("  💡 Transaction may not be confirmed yet");
      console.log("  💡 Wait a few seconds and check again");
    }
    console.log("");
    
    console.log("═══════════════════════════════════════");
    console.log("✅ Transfer completed successfully!");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("🔗 Useful Links:");
    console.log(`  NFT: https://polygonscan.com/token/${NPM}?a=${NFT_TOKEN_ID}`);
    console.log(`  Safe: https://polygonscan.com/address/${SAFE}`);
    console.log(`  Transaction: https://polygonscan.com/tx/${transferTx.hash}`);
    
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
    if (error.reason) {
      console.log("  Reason:", error.reason);
    }
    console.log("");
    console.log("💡 Check:");
    console.log("  1. Is PRIVATE_KEY correct?");
    console.log("  2. Is MATIC balance sufficient?");
    console.log("  3. Is NFT at Signer address?");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

