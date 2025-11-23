const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔍 Searching for NFT Token ID Related to FSFOX/PAXG Pool\n");
  
  const provider = ethers.provider;
  
  const npm = new ethers.Contract(NPM, [
    "function positions(uint256 tokenId) view returns (uint96 nonce,address operator,address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint128 liquidity,uint256 feeGrowthInside0LastX128,uint256 feeGrowthInside1LastX128,uint128 tokensOwed0,uint128 tokensOwed1)",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ], provider);
  
  // NPM ABI for events
  const npmInterface = new ethers.Interface([
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    "event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
  ]);
  
  try {
    console.log("📋 Checking Pool Transactions to Find NFT Token ID...");
    console.log("");
    
    // Get current block
    const currentBlock = await provider.getBlockNumber();
    console.log(`  Current Block: ${currentBlock}`);
    
    // Search from last 50,000 blocks (approximately last few days)
    // If not found, we'll try smaller ranges
    let fromBlock = Math.max(0, currentBlock - 50000);
    console.log(`  Searching from Block: ${fromBlock}`);
    console.log("");
    
    // Filter for Transfer events from NPM where from is zero address (mint)
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    
    console.log("🔍 Searching for Transfer Events (Mint)...");
    console.log("");
    
    // Get Transfer events from NPM
    // Try smaller ranges if needed
    const transferFilter = npmInterface.getEvent("Transfer");
    let logs = [];
    let searchRange = 50000;
    let attempts = 0;
    const maxAttempts = 5;
    
    while (logs.length === 0 && attempts < maxAttempts) {
      try {
        fromBlock = Math.max(0, currentBlock - searchRange);
        console.log(`  Attempt ${attempts + 1}: Searching from Block ${fromBlock} to ${currentBlock}...`);
        
        logs = await provider.getLogs({
          address: NPM,
          topics: [
            transferFilter.topicHash,
            ethers.zeroPadValue(zeroAddress, 32) // from = 0x0000... (mint)
          ],
          fromBlock: fromBlock,
          toBlock: currentBlock
        });
        
        if (logs.length > 0) {
          console.log(`  ✅ ${logs.length} Transfer event (Mint) found`);
          break;
        } else {
          // Try smaller range
          searchRange = Math.floor(searchRange / 2);
          attempts++;
        }
      } catch (error) {
        if (error.message.includes("too large")) {
          // Range too large, try smaller
          searchRange = Math.floor(searchRange / 2);
          attempts++;
          console.log(`  ⚠️  Range too large, trying smaller range...`);
        } else {
          throw error;
        }
      }
    }
    
    console.log("");
    
    if (logs.length === 0) {
      console.log("❌ No Transfer Event (Mint) Found!");
      console.log("");
      console.log("💡 Solution:");
      console.log("  1. Check that Liquidity has been added");
      console.log("  2. Or check directly on Polygonscan");
      console.log(`     https://polygonscan.com/address/${POOL_PAXG}`);
      console.log(`     NPM Events: https://polygonscan.com/address/${NPM}#events`);
      return;
    }
    
    // Check each Transfer event to find PAXG pool NFT
    console.log("🔍 Checking NFT Positions...");
    console.log("");
    
    let foundNFT = null;
    
    for (const log of logs) {
      try {
        const parsed = npmInterface.parseLog(log);
        if (parsed && parsed.name === "Transfer") {
          const tokenId = parsed.args.tokenId;
          const to = parsed.args.to;
          
          // Check if this NFT is for PAXG pool
          try {
            const position = await npm.positions(tokenId);
            
            // Check if this is the PAXG pool
            const isPAXGPool = (
              (position.token0.toLowerCase() === PAXG.toLowerCase() && 
               position.token1.toLowerCase() === FSFOX.toLowerCase()) ||
              (position.token0.toLowerCase() === FSFOX.toLowerCase() && 
               position.token1.toLowerCase() === PAXG.toLowerCase())
            ) && position.fee === 3000n;
            
            if (isPAXGPool) {
              // Get current owner
              const currentOwner = await npm.ownerOf(tokenId);
              
              foundNFT = {
                tokenId: tokenId.toString(),
                mintedTo: to,
                currentOwner: currentOwner,
                position: position,
                blockNumber: log.blockNumber,
                txHash: log.transactionHash
              };
              
              console.log("✅ PAXG Pool NFT Position Found!");
              console.log("");
              break;
            }
          } catch (error) {
            // Skip if position doesn't exist or other error
            continue;
          }
        }
      } catch (error) {
        // Skip if can't parse
        continue;
      }
    }
    
    if (!foundNFT) {
      console.log("❌ PAXG Pool NFT Position Not Found!");
      console.log("");
      console.log("💡 Check:");
      console.log("  1. Has Liquidity been added to Pool?");
      console.log("  2. Is Pool created correctly?");
      console.log(`  3. Pool: https://polygonscan.com/address/${POOL_PAXG}`);
      console.log("");
      console.log("🔍 You can check manually:");
      console.log(`  NPM Events: https://polygonscan.com/address/${NPM}#events`);
      return;
    }
    
    // Display found NFT
    console.log("═══════════════════════════════════════");
    console.log("📊 NFT Position Information:");
    console.log("═══════════════════════════════════════");
    console.log("");
    console.log(`  Token ID: ${foundNFT.tokenId}`);
    console.log(`  Minted To: ${foundNFT.mintedTo}`);
    console.log(`  Current Owner: ${foundNFT.currentOwner}`);
    console.log(`  Token0: ${foundNFT.position.token0}`);
    console.log(`  Token1: ${foundNFT.position.token1}`);
    console.log(`  Fee: ${foundNFT.position.fee}`);
    console.log(`  Liquidity: ${foundNFT.position.liquidity.toString()}`);
    console.log(`  Block: ${foundNFT.blockNumber}`);
    console.log(`  Transaction: ${foundNFT.txHash}`);
    console.log("");
    
    // Check if already in Safe
    const isInSafe = foundNFT.currentOwner.toLowerCase() === SAFE.toLowerCase();
    
    if (isInSafe) {
      console.log("✅ NFT Position is already in Safe!");
      console.log("");
      console.log(`🔗 Polygonscan: https://polygonscan.com/token/${NPM}?a=${foundNFT.tokenId}`);
    } else {
      console.log("⚠️  NFT Position is not in Safe!");
      console.log("");
      console.log("📝 To Transfer to Safe:");
      console.log("");
      console.log("1. Open file scripts/generateTransferNFTCalldata.js");
      console.log("2. Configure:");
      console.log(`   const NFT_TOKEN_IDS = ["${foundNFT.tokenId}"];`);
      console.log(`   const CURRENT_OWNER = "${foundNFT.currentOwner}";`);
      console.log("3. Run Script:");
      console.log("   npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon");
      console.log("4. Use Calldata in Gnosis Safe");
      console.log("");
      console.log(`🔗 Polygonscan NFT: https://polygonscan.com/token/${NPM}?a=${foundNFT.tokenId}`);
      console.log(`🔗 Transaction: https://polygonscan.com/tx/${foundNFT.txHash}`);
    }
    
    console.log("");
    console.log("🔗 Useful Links:");
    console.log(`  Pool: https://polygonscan.com/address/${POOL_PAXG}`);
    console.log(`  Safe: https://polygonscan.com/address/${SAFE}`);
    console.log(`  NPM: https://polygonscan.com/address/${NPM}`);
    
  } catch (error) {
    console.log("❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
    console.log("");
    console.log("💡 If you have errors:");
    console.log("  1. Check that RPC endpoint is correct");
    console.log("  2. Or check directly on Polygonscan");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

