const { ethers } = require("hardhat");
require("dotenv").config();

const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
// Set current NFT owner address (or use environment variable)
const CURRENT_OWNER = process.env.CURRENT_NFT_OWNER || ""; // Current NFT Owner address

// ============================================
// Settings: List of NFT Token IDs to Approve
// ============================================
const NFT_TOKEN_IDS = [
  "2751156", // NFT Position Pool FSFOX/PAXG
];

async function main() {
  console.log("📝 Generating Calldata for Approve NFT\n");
  
  if (NFT_TOKEN_IDS.length === 0) {
    console.log("❌ Error: NFT Token IDs list is empty!");
    return;
  }
  
  console.log("📝 Information:");
  console.log("  Current Owner:", CURRENT_OWNER);
  console.log("  Safe (Operator):", SAFE);
  console.log("  NPM:", NPM);
  console.log("  NFT Count:", NFT_TOKEN_IDS.length);
  console.log("");
  
  const npm = new ethers.Contract(NPM, [
    "function setApprovalForAll(address operator, bool approved)",
    "function approve(address to, uint256 tokenId)"
  ]);
  
  console.log("═══════════════════════════════════════");
  console.log("📋 Calldata for Approve NFT:");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("⚠️  Note: This Calldata must be executed from current NFT Owner!");
  console.log("   Owner: " + CURRENT_OWNER);
  console.log("");
  
  // Option 1: setApprovalForAll (Recommended)
  console.log("🔹 Option 1: setApprovalForAll (Recommended)");
  console.log("   This method Approves Safe for all NFTs");
  console.log("");
  
  const calldataApproveAll = npm.interface.encodeFunctionData("setApprovalForAll", [
    SAFE,
    true
  ]);
  
  console.log("   To: " + NPM);
  console.log("   Value: 0");
  console.log("   Data: " + calldataApproveAll);
  console.log("");
  console.log("   JSON (for MetaMask or Owner):");
  console.log("   " + JSON.stringify({
    to: NPM,
    value: "0",
    data: calldataApproveAll
  }, null, 2));
  console.log("");
  console.log("───────────────────────────────────────");
  console.log("");
  
  // Option 2: approve (for each NFT separately)
  console.log("🔹 Option 2: approve (for each NFT separately)");
  console.log("   This method only Approves one NFT");
  console.log("");
  
  for (let i = 0; i < NFT_TOKEN_IDS.length; i++) {
    const tokenId = BigInt(NFT_TOKEN_IDS[i]);
    
    const calldataApprove = npm.interface.encodeFunctionData("approve", [
      SAFE,
      tokenId
    ]);
    
    console.log(`   Transaction ${i + 1}: Approve NFT #${NFT_TOKEN_IDS[i]}`);
    console.log("   To: " + NPM);
    console.log("   Value: 0");
    console.log("   Data: " + calldataApprove);
    console.log("");
  }
  
  console.log("═══════════════════════════════════════");
  console.log("💡 Usage Steps:");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("Step 1: Approve from Current Owner");
  console.log("  1. Connect MetaMask or Owner wallet");
  console.log("  2. Go to Polygonscan:");
  console.log(`     https://polygonscan.com/address/${NPM}#writeContract`);
  console.log("  3. Select Function 'setApprovalForAll'");
  console.log("  4. operator: " + SAFE);
  console.log("  5. approved: true");
  console.log("  6. Write → Confirm");
  console.log("");
  console.log("  Or");
  console.log("");
  console.log("  From MetaMask:");
  console.log("  1. Open MetaMask");
  console.log("  2. Go to 'Send'");
  console.log("  3. To: " + NPM);
  console.log("  4. Data: " + calldataApproveAll);
  console.log("  5. Confirm");
  console.log("");
  console.log("Step 2: Transfer from Safe");
  console.log("  1. After Approve, transfer from Safe");
  console.log("  2. Use generateTransferNFTCalldata.js");
  console.log("");
  console.log("🔗 Useful Links:");
  console.log(`  NPM Write Contract: https://polygonscan.com/address/${NPM}#writeContract`);
  console.log(`  Safe: https://polygonscan.com/address/${SAFE}`);
  console.log(`  Owner: https://polygonscan.com/address/${CURRENT_OWNER}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

