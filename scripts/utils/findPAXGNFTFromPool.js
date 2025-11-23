const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔍 Searching for NFT Token ID from FSFOX/PAXG Pool Transactions\n");
  
  const provider = ethers.provider;
  
  const npm = new ethers.Contract(NPM, [
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ], provider);
  
  // NPM Interface for Transfer events
  const npmInterface = new ethers.Interface([
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
  ]);
  
  try {
    console.log("📋 Checking Pool Transactions to Find Mint Events...");
    console.log("");
    
    // Get pool transactions - we'll check recent transactions
    const currentBlock = await provider.getBlockNumber();
    console.log(`  Current Block: ${currentBlock}`);
    console.log("");
    
    // Check if we can find the NFT by checking known addresses
    console.log("🔍 Checking Known Addresses...");
    console.log("");
    
    // List of addresses to check (you can add more)
    const addressesToCheck = [
      SAFE,
      // Add other addresses if you know them
    ];
    
    let foundNFT = null;
    
    for (const address of addressesToCheck) {
      try {
        const balance = await npm.balanceOf(address);
        if (balance > 0n) {
          console.log(`  Checking ${address}...`);
          console.log(`    NFT Count: ${balance.toString()}`);
          
          for (let i = 0; i < balance; i++) {
            try {
              const tokenId = await npm.tokenOfOwnerByIndex(address, i);
              const position = await npm.positions(tokenId);
              
              // Check if this is the PAXG pool
              const isPAXGPool = (
                (position.token0.toLowerCase() === PAXG.toLowerCase() && 
                 position.token1.toLowerCase() === FSFOX.toLowerCase()) ||
                (position.token0.toLowerCase() === FSFOX.toLowerCase() && 
                 position.token1.toLowerCase() === PAXG.toLowerCase())
              ) && position.fee === 3000n;
              
              if (isPAXGPool) {
                const currentOwner = await npm.ownerOf(tokenId);
                foundNFT = {
                  tokenId: tokenId.toString(),
                  owner: currentOwner,
                  position: position
                };
                console.log(`    ✅ NFT #${tokenId.toString()} - PAXG Pool Found!`);
                break;
              }
            } catch (error) {
              // Skip if error
              continue;
            }
          }
        }
      } catch (error) {
        // Skip if error
        continue;
      }
    }
    
    if (foundNFT) {
      console.log("");
      displayNFTInfo(foundNFT.tokenId, foundNFT.owner, foundNFT.position);
      return;
    }
    
    console.log("");
    console.log("❌ PAXG Pool NFT Position Not Found in Known Addresses!");
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📝 Guide to Find NFT Token ID:");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("Method 1: From Polygonscan NPM Events");
    console.log("");
    console.log("1. Go to this link:");
    console.log(`   https://polygonscan.com/address/${NPM}#events`);
    console.log("");
    console.log("2. In Events filter:");
    console.log("   - Event: Select 'Transfer'");
    console.log("   - from: '0x0000000000000000000000000000000000000000' (mint)");
    console.log("");
    console.log("3. Check Transfer events list");
    console.log("   - For each event, note Token ID");
    console.log("");
    console.log("4. For each Token ID:");
    console.log("   - Go to this link:");
    console.log(`     https://polygonscan.com/token/${NPM}?a=[TOKEN_ID]`);
    console.log("   - In 'Read Contract' → 'positions' → Enter Token ID");
    console.log("   - Check that:");
    console.log("     * token0 = PAXG or FSFOX");
    console.log("     * token1 = FSFOX or PAXG");
    console.log("     * fee = 3000");
    console.log("");
    console.log("───────────────────────────────────────");
    console.log("");
    console.log("Method 2: From Pool Transactions");
    console.log("");
    console.log("1. Go to this link:");
    console.log(`   https://polygonscan.com/address/${POOL_PAXG}`);
    console.log("");
    console.log("2. Go to 'Transactions' tab");
    console.log("");
    console.log("3. Find 'Mint' transaction");
    console.log("   (Transaction that added Liquidity)");
    console.log("");
    console.log("4. Copy Transaction Hash");
    console.log("");
    console.log("5. Go to Transaction and check in 'Logs':");
    console.log("   - Find 'Transfer' event from NPM");
    console.log("   - Token ID is in 'tokenId' parameter");
    console.log("");
    console.log("───────────────────────────────────────");
    console.log("");
    console.log("Method 3: From Token Tracker");
    console.log("");
    console.log("1. Go to this link:");
    console.log(`   https://polygonscan.com/token/${NPM}`);
    console.log("");
    console.log("2. Go to 'Holders' tab");
    console.log("");
    console.log("3. For each Holder:");
    console.log("   - Click on address");
    console.log("   - Go to 'Token' → 'ERC-721 Token Txns' tab");
    console.log("   - Find NFTs related to NPM");
    console.log("   - Note Token ID");
    console.log("   - Check that it's related to PAXG Pool");
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("📝 After Finding Token ID:");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log("1. Find current NFT Owner:");
    console.log(`   https://polygonscan.com/token/${NPM}?a=[TOKEN_ID]`);
    console.log("");
    console.log("2. Open file scripts/generateTransferNFTCalldata.js");
    console.log("");
    console.log("3. Configure:");
    console.log("   const NFT_TOKEN_IDS = [\"TOKEN_ID\"];");
    console.log("   const CURRENT_OWNER = \"OWNER_ADDRESS\";");
    console.log("");
    console.log("4. Run Script:");
    console.log("   npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon");
    console.log("");
    console.log("5. Use Calldata in Gnosis Safe");
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

