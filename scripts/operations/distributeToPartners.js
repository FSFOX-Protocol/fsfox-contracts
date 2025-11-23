const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

// Partner list (address and amount)
// Amount in FSFOX (not wei)
const PARTNERS = [
  // { address: "0x...", amount: "10000" },  // 10,000 FSFOX
  // { address: "0x...", amount: "20000" },  // 20,000 FSFOX
  // Example:
  // { address: "0x1234567890123456789012345678901234567890", amount: "50000" },
];

async function main() {
  console.log("🚀 Distributing Tokens to Partners\n");
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Signer:", signer.address);
  console.log("  Owner (Safe):", SAFE);
  console.log("  FSFOX:", FSFOX);
  console.log("");
  
  // Check that signer is the owner
  const fsfox = new ethers.Contract(FSFOX, [
    "function owner() view returns (address)",
    "function balanceOf(address) view returns (uint256)",
    "function lockedTokens() view returns (uint256)",
    "function unlockTokens(uint256 amount)",
    "function transfer(address to, uint256 amount) returns (bool)"
  ], provider);
  
  const owner = await fsfox.owner();
  console.log("👤 Contract Owner:", owner);
  console.log("");
  
  if (signer.address.toLowerCase() !== owner.toLowerCase()) {
    console.log("⚠️  Warning: Signer is not the Owner!");
    console.log("   If using Gnosis Safe, run this Script from Safe");
    console.log("   Or manually execute transactions from Safe");
    console.log("");
    console.log("📖 Manual Guide: docs/guides/safe/PARTNER_DISTRIBUTION.md");
    return;
  }
  
  // Check partner list
  if (PARTNERS.length === 0) {
    console.log("❌ Partner list is empty!");
    console.log("   Please add partner list to this Script");
    return;
  }
  
  // Calculate total
  let totalAmount = 0n;
  for (const partner of PARTNERS) {
    const amount = ethers.parseUnits(partner.amount, 18);
    totalAmount += amount;
    console.log(`  ${partner.address}: ${ethers.formatEther(amount)} FSFOX`);
  }
  
  console.log("");
  console.log("💰 Total:", ethers.formatEther(totalAmount), "FSFOX");
  console.log("");
  
  // Check Safe balance
  const safeBalance = await fsfox.balanceOf(SAFE);
  const lockedTokens = await fsfox.lockedTokens();
  
  console.log("📊 Current Balance:");
  console.log("  Safe Balance:", ethers.formatEther(safeBalance), "FSFOX");
  console.log("  Locked Tokens:", ethers.formatEther(lockedTokens), "FSFOX");
  console.log("");
  
  // Check if unlock is needed
  const needToUnlock = safeBalance < totalAmount;
  
  if (needToUnlock) {
    const unlockAmount = totalAmount - safeBalance;
    
    if (unlockAmount > lockedTokens) {
      console.log("❌ Error: Insufficient Locked Tokens!");
      console.log("  Required:", ethers.formatEther(unlockAmount), "FSFOX");
      console.log("  Available:", ethers.formatEther(lockedTokens), "FSFOX");
      return;
    }
    
    console.log("⚠️  Safe has insufficient balance!");
    console.log("  Need to unlock:", ethers.formatEther(unlockAmount), "FSFOX");
    console.log("");
    console.log("🔓 Unlocking tokens...");
    
    try {
      const unlockTx = await fsfox.unlockTokens(unlockAmount);
      console.log("  📝 Transaction hash:", unlockTx.hash);
      console.log("  ⏳ Waiting for confirmation...");
      await unlockTx.wait();
      console.log("  ✅ Unlock successful!");
      console.log("");
    } catch (error) {
      console.error("  ❌ Error in Unlock:", error.message);
      return;
    }
  } else {
    console.log("✅ Safe has sufficient balance");
    console.log("");
  }
  
  // Check final balance
  const finalBalance = await fsfox.balanceOf(SAFE);
  console.log("💰 Final Safe Balance:", ethers.formatEther(finalBalance), "FSFOX");
  
  if (finalBalance < totalAmount) {
    console.log("❌ Error: Safe balance is still insufficient!");
    return;
  }
  
  console.log("");
  console.log("🔄 Transferring to partners...");
  console.log("");
  
  // Transfer to partners
  const contractWithSigner = fsfox.connect(signer);
  const results = [];
  
  for (let i = 0; i < PARTNERS.length; i++) {
    const partner = PARTNERS[i];
    const amount = ethers.parseUnits(partner.amount, 18);
    
    try {
      console.log(`📤 Transfer ${i + 1}/${PARTNERS.length}:`);
      console.log(`  To: ${partner.address}`);
      console.log(`  Amount: ${ethers.formatEther(amount)} FSFOX`);
      
      const tx = await contractWithSigner.transfer(partner.address, amount);
      console.log(`  📝 Transaction hash: ${tx.hash}`);
      console.log(`  ⏳ Waiting for confirmation...`);
      
      const receipt = await tx.wait();
      console.log(`  ✅ Confirmed! (Block: ${receipt.blockNumber})`);
      console.log("");
      
      results.push({
        partner: partner.address,
        amount: ethers.formatEther(amount),
        txHash: tx.hash,
        success: true
      });
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
      console.log("");
      
      results.push({
        partner: partner.address,
        amount: ethers.formatEther(amount),
        txHash: null,
        success: false,
        error: error.message
      });
    }
  }
  
  // Display final result
  console.log("═══════════════════════════════════════");
  console.log("📊 Final Result:");
  console.log("═══════════════════════════════════════");
  console.log("");
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}/${PARTNERS.length}`);
  console.log(`❌ Failed: ${failed}/${PARTNERS.length}`);
  console.log("");
  
  if (successful > 0) {
    console.log("✅ Successful Transactions:");
    results.filter(r => r.success).forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.partner}: ${result.amount} FSFOX`);
      console.log(`     Tx: https://polygonscan.com/tx/${result.txHash}`);
    });
    console.log("");
  }
  
  if (failed > 0) {
    console.log("❌ Failed Transactions:");
    results.filter(r => !r.success).forEach((result, i) => {
      console.log(`  ${i + 1}. ${result.partner}: ${result.amount} FSFOX`);
      console.log(`     Error: ${result.error}`);
    });
    console.log("");
  }
  
  // Final balance
  const finalSafeBalance = await fsfox.balanceOf(SAFE);
  console.log("💰 Final Safe Balance:", ethers.formatEther(finalSafeBalance), "FSFOX");
  
  // Check partner balances
  console.log("");
  console.log("📊 Partner Balances After Transfer:");
  for (const partner of PARTNERS) {
    const balance = await fsfox.balanceOf(partner.address);
    console.log(`  ${partner.address}: ${ethers.formatEther(balance)} FSFOX`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

