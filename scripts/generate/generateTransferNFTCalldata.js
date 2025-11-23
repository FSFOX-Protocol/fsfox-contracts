const { ethers } = require("hardhat");
require("dotenv").config();

const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

// ============================================
// Settings: List of NFT Token IDs to Transfer
// ============================================
// You can enter Token IDs of NFTs you want to transfer here
const NFT_TOKEN_IDS = [
  "2751156", // NFT Position Pool FSFOX/PAXG
];

// ============================================
// Settings: Current NFT Owner Address
// ============================================
// Address of wallet where NFTs are located
// Set current NFT owner address (or use environment variable)
const CURRENT_OWNER = process.env.CURRENT_NFT_OWNER || ""; // Current NFT Owner address

async function main() {
  console.log("📝 Generating Calldata for Transferring NFT to Safe\n");
  
  if (NFT_TOKEN_IDS.length === 0) {
    console.log("❌ Error: NFT Token IDs list is empty!");
    console.log("");
    console.log("💡 Solution:");
    console.log("  1. First run findAllNFTs.js to find NFTs");
    console.log("  2. Enter Token IDs of NFTs you want to transfer in NFT_TOKEN_IDS");
    console.log("  3. Enter current Owner address in CURRENT_OWNER");
    console.log("  4. Run this Script again");
    return;
  }
  
  if (!CURRENT_OWNER || CURRENT_OWNER === "") {
    console.log("❌ Error: Current Owner address not entered!");
    console.log("");
    console.log("💡 Solution:");
    console.log("  Set CURRENT_OWNER in Script");
    return;
  }
  
  console.log("📝 Information:");
  console.log("  Current Owner:", CURRENT_OWNER);
  console.log("  Safe:", SAFE);
  console.log("  NPM:", NPM);
  console.log("  NFT Count:", NFT_TOKEN_IDS.length);
  console.log("");
  
  const npm = new ethers.Contract(NPM, [
    "function safeTransferFrom(address from, address to, uint256 tokenId)"
  ]);
  
  console.log("═══════════════════════════════════════");
  console.log("📋 Calldata for Gnosis Safe:");
  console.log("═══════════════════════════════════════");
  console.log("");
  
  for (let i = 0; i < NFT_TOKEN_IDS.length; i++) {
    const tokenId = BigInt(NFT_TOKEN_IDS[i]);
    
    try {
      // Generate calldata
      const calldata = npm.interface.encodeFunctionData("safeTransferFrom", [
        CURRENT_OWNER,
        SAFE,
        tokenId
      ]);
      
      console.log(`🔹 Transaction ${i + 1}: Transfer NFT #${NFT_TOKEN_IDS[i]}`);
      console.log(`   To: ${NPM}`);
      console.log(`   Value: 0`);
      console.log(`   Data: ${calldata}`);
      console.log("");
      
      // Also provide as JSON for easy copy
      const transaction = {
        to: NPM,
        value: "0",
        data: calldata,
        operation: 0, // 0 = Call, 1 = DelegateCall
        safeTxGas: 0,
        baseGas: 0,
        gasPrice: "0",
        gasToken: "0x0000000000000000000000000000000000000000",
        refundReceiver: "0x0000000000000000000000000000000000000000",
        nonce: 0
      };
      
      console.log(`   JSON (for Safe Transaction Builder):`);
      console.log(`   ${JSON.stringify(transaction, null, 2)}`);
      console.log("");
      console.log("─".repeat(60));
      console.log("");
    } catch (error) {
      console.log(`  ❌ Error generating Calldata for NFT #${NFT_TOKEN_IDS[i]}:`, error.message);
      console.log("");
    }
  }
  
  console.log("💡 Usage Steps:");
  console.log("  1. Go to Gnosis Safe Transaction Builder");
  console.log("  2. For each NFT, add a new transaction");
  console.log("  3. To: Enter NPM address");
  console.log("  4. Data: Copy Calldata");
  console.log("  5. Submit → Sign → Execute");
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

