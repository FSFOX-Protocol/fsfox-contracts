const { ethers } = require("hardhat");

// All FSFOX contract addresses
const OLD_ADDRESSES = [
  "0x258d004EFEF49c40e716cA02C44CC58D58429cD0",
  "0x3dc05CF96E7f15882BdEA4cf81e466188B3Ae380",
  "0xC2845Cb11c753D511858658F5a74D829Ed78F6e3", // Amoy testnet
];

const OFFICIAL_ADDRESS = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";

async function main() {
  console.log("🔍 Checking FSFOX Contract Addresses\n");
  
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || "https://polygon-rpc.com");
  
  const erc20Interface = new ethers.Interface([
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function owner() view returns (address)",
    "function tradingEnabled() view returns (bool)",
  ]);
  
  // Check official address
  console.log("✅ Official FSFOX Contract:");
  console.log(`   Address: ${OFFICIAL_ADDRESS}`);
  try {
    const name = await provider.call({
      to: OFFICIAL_ADDRESS,
      data: erc20Interface.encodeFunctionData("name"),
    });
    const symbol = await provider.call({
      to: OFFICIAL_ADDRESS,
      data: erc20Interface.encodeFunctionData("symbol"),
    });
    const totalSupply = await provider.call({
      to: OFFICIAL_ADDRESS,
      data: erc20Interface.encodeFunctionData("totalSupply"),
    });
    const owner = await provider.call({
      to: OFFICIAL_ADDRESS,
      data: erc20Interface.encodeFunctionData("owner"),
    });
    
    const [nameResult] = erc20Interface.decodeFunctionResult("name", name);
    const [symbolResult] = erc20Interface.decodeFunctionResult("symbol", symbol);
    const [supplyResult] = erc20Interface.decodeFunctionResult("totalSupply", totalSupply);
    const [ownerResult] = erc20Interface.decodeFunctionResult("owner", owner);
    
    console.log(`   Name: ${nameResult}`);
    console.log(`   Symbol: ${symbolResult}`);
    console.log(`   Total Supply: ${ethers.formatEther(supplyResult)}`);
    console.log(`   Owner: ${ownerResult}`);
    console.log(`   Polygonscan: https://polygonscan.com/address/${OFFICIAL_ADDRESS}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
  
  // Check old addresses
  console.log("⚠️  Old/Deprecated FSFOX Contracts:\n");
  for (const address of OLD_ADDRESSES) {
    console.log(`   Address: ${address}`);
    try {
      const name = await provider.call({
        to: address,
        data: erc20Interface.encodeFunctionData("name"),
      });
      const [nameResult] = erc20Interface.decodeFunctionResult("name", name);
      console.log(`   Name: ${nameResult}`);
      console.log(`   Status: ⚠️  OLD - DO NOT USE`);
      console.log(`   Polygonscan: https://polygonscan.com/address/${address}\n`);
    } catch (error) {
      console.log(`   Status: ❌ Contract not found or error: ${error.message}\n`);
    }
  }
  
  console.log("📝 Summary:");
  console.log(`   Official Address: ${OFFICIAL_ADDRESS}`);
  console.log(`   Old Addresses: ${OLD_ADDRESSES.length}`);
  console.log("\n💡 Recommendation:");
  console.log("   - Always use the official address for transactions");
  console.log("   - Use token-list.json to filter old addresses in DEX interfaces");
  console.log("   - Mark old contracts as deprecated in Polygonscan");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

