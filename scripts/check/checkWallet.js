const { ethers } = require("hardhat");
require("dotenv").config();

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔍 Checking Wallet and Settings\n");
  
  if (!process.env.PRIVATE_KEY) {
    console.log("❌ PRIVATE_KEY not found in .env!");
    console.log("   Please add PRIVATE_KEY to .env file");
    return;
  }
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Wallet Information:");
  console.log("  Address:", signer.address);
  console.log("");
  
  try {
    const balance = await provider.getBalance(signer.address);
    console.log("  Balance:", ethers.formatEther(balance), "MATIC");
    console.log("");
    
    const fsfox = new ethers.Contract(FSFOX, [
      "function owner() view returns (address)"
    ], provider);
    
    const owner = await fsfox.owner();
    
    console.log("📋 Contract Information:");
    console.log("  FSFOX Owner:", owner);
    console.log("  Safe Address:", SAFE);
    console.log("");
    
    const isOwner = signer.address.toLowerCase() === owner.toLowerCase();
    const isSafeOwner = owner.toLowerCase() === SAFE.toLowerCase();
    
    console.log("✅ Check:");
    console.log("  Wallet = Owner?", isOwner ? "✅ Yes" : "❌ No");
    console.log("  Owner = Safe?", isSafeOwner ? "✅ Yes" : "❌ No");
    console.log("");
    
    if (isOwner) {
      console.log("🎉 You are the Owner!");
      console.log("   You can run Script addLiquidity.js");
    } else if (isSafeOwner) {
      console.log("ℹ️  Owner = Safe");
      console.log("   If this Wallet is one of Safe Signers:");
      console.log("   You can use this Wallet");
      console.log("   But there may be limitations");
    } else {
      console.log("⚠️  Warning:");
      console.log("   Your Wallet is not the Owner");
      console.log("   You can:");
      console.log("   1. Use Safe Transaction Builder");
      console.log("   2. Or use generateLiquidityCalldata.js for Calldata");
    }
    
    console.log("");
    console.log("💡 Alternative Solutions:");
    console.log("   - Use Safe Transaction Builder");
    console.log("   - Use generateLiquidityCalldata.js");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

