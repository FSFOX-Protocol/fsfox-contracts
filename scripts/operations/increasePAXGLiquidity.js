const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988"; // Pool FSFOX/PAXG
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const FEE = 3000; // 0.3%

// ============================================
// Settings: Amounts to add to match USDC Pool
// ============================================
// Target (current USDC Pool): 144.174494 USDC + 55,206.97 FSFOX
// Current PAXG Pool (on-chain): ~0.0175962872 PAXG + ~28,239.14 FSFOX
// Amount to add (this script): ~0.01680411 PAXG + ~26,967.83 FSFOX
// Resulting target PAXG Pool (approx): ~0.03440040 PAXG + ~55,206.97 FSFOX
const AMOUNT_PAXG = "0.01680412"; // PAXG amount to add (approx, keeps price ratio)
const AMOUNT_FSFOX = "26967.8303"; // FSFOX amount to add (approx to match USDC pool value)

// Full range ticks for 0.3% fee (tickSpacing = 60)
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

async function main() {
  console.log("🚀 Increasing FSFOX/PAXG Pool Liquidity to Match USDC Pool\n");
  
  if (!POOL_PAXG || POOL_PAXG === "") {
    console.log("❌ Error: Enter Pool address!");
    return;
  }
  
  const provider = ethers.provider;

  // Try to read local signer (optional - script is for Safe calldata only)
  let signerAddress = "(no local signer - use Safe for execution)";
  try {
    const signers = await ethers.getSigners();
    if (signers && signers.length > 0 && signers[0].address) {
      signerAddress = signers[0].address;
    }
  } catch (e) {
    // ignore, not required
  }

  console.log("📝 Information:");
  console.log("  Local signer (if any):", signerAddress);
  console.log("  Safe:", SAFE);
  console.log("  Pool:", POOL_PAXG);
  console.log("");
  
  // Contracts
  const paxg = new ethers.Contract(PAXG, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ], provider);
  
  // Get decimals
  const paxgDecimals = await paxg.decimals();
  const fsfoxDecimals = 18;
  
  // Check current pool ratio
  const pool = new ethers.Contract(POOL_PAXG, [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  const token0 = await pool.token0();
  const token1 = await pool.token1();
  
  const poolPAXGBalance = await paxg.balanceOf(POOL_PAXG);
  const poolFSFOXBalance = await fsfox.balanceOf(POOL_PAXG);
  
  const poolPAXG = parseFloat(ethers.formatUnits(poolPAXGBalance, paxgDecimals));
  const poolFSFOX = parseFloat(ethers.formatEther(poolFSFOXBalance));
  
  console.log("📊 Current Pool Status:");
  console.log("  PAXG:", poolPAXG.toFixed(6));
  console.log("  FSFOX:", poolFSFOX.toFixed(2));
  console.log("");
  
  // Calculate target amounts (based on current USDC Pool FSFOX balance)
  const targetFSFOX = 55206.97;
  const targetPAXG = poolPAXG * (targetFSFOX / poolFSFOX);
  
  console.log("🎯 Target (to match USDC Pool):");
  console.log("  PAXG:", targetPAXG.toFixed(6));
  console.log("  FSFOX:", targetFSFOX.toFixed(2));
  console.log("");
  
  console.log("➕ Amount to Add:");
  console.log("  PAXG:", AMOUNT_PAXG);
  console.log("  FSFOX:", AMOUNT_FSFOX);
  console.log("");
  
  // Convert to wei
  const amountPAXGWei = ethers.parseUnits(AMOUNT_PAXG, paxgDecimals);
  const amountFSFOXWei = ethers.parseEther(AMOUNT_FSFOX);
  
  // Check balances in Safe
  const safePAXGBalance = await paxg.balanceOf(SAFE);
  const safeFSFOXBalance = await fsfox.balanceOf(SAFE);
  
  console.log("💵 Safe Balance:");
  console.log("  PAXG:", ethers.formatUnits(safePAXGBalance, paxgDecimals));
  console.log("  FSFOX:", ethers.formatEther(safeFSFOXBalance));
  console.log("");
  
  if (safePAXGBalance < amountPAXGWei) {
    console.log("❌ Error: Insufficient PAXG balance in Safe!");
    console.log("  Required:", AMOUNT_PAXG, "PAXG");
    console.log("  Available:", ethers.formatUnits(safePAXGBalance, paxgDecimals), "PAXG");
    return;
  }
  
  if (safeFSFOXBalance < amountFSFOXWei) {
    console.log("❌ Error: Insufficient FSFOX balance in Safe!");
    console.log("  Required:", AMOUNT_FSFOX, "FSFOX");
    console.log("  Available:", ethers.formatEther(safeFSFOXBalance), "FSFOX");
    console.log("");
    console.log("💡 Solution: Use unlockTokens() to unlock more FSFOX");
    return;
  }
  
  // Check allowances
  const paxgAllowance = await paxg.allowance(SAFE, NPM);
  const fsfoxAllowance = await fsfox.allowance(SAFE, NPM);
  
  console.log("✅ Current Allowance (Safe → NPM):");
  console.log("  PAXG:", ethers.formatUnits(paxgAllowance, paxgDecimals));
  console.log("  FSFOX:", ethers.formatEther(fsfoxAllowance));
  console.log("");
  
  if (paxgAllowance < amountPAXGWei) {
    console.log("⚠️  PAXG Allowance insufficient!");
    console.log("  Required:", AMOUNT_PAXG, "PAXG");
    console.log("  Current:", ethers.formatUnits(paxgAllowance, paxgDecimals), "PAXG");
    console.log("");
    console.log("💡 Action Required: Approve PAXG from Safe");
    console.log("  To:", PAXG);
    console.log("  Spender:", NPM);
    console.log("  Amount:", AMOUNT_PAXG, "PAXG (or MaxUint256)");
    console.log("");
  }
  
  if (fsfoxAllowance < amountFSFOXWei) {
    console.log("⚠️  FSFOX Allowance insufficient!");
    console.log("  Required:", AMOUNT_FSFOX, "FSFOX");
    console.log("  Current:", ethers.formatEther(fsfoxAllowance), "FSFOX");
    console.log("");
    console.log("💡 Action Required: Approve FSFOX from Safe");
    console.log("  To:", FSFOX);
    console.log("  Spender:", NPM);
    console.log("  Amount:", AMOUNT_FSFOX, "FSFOX (or MaxUint256)");
    console.log("");
  }
  
  if (paxgAllowance < amountPAXGWei || fsfoxAllowance < amountFSFOXWei) {
    console.log("❌ Cannot proceed: Insufficient allowances!");
    console.log("  Please approve tokens from Safe first.");
    return;
  }
  
  // Note: This script only generates calldata for Safe
  // Actual execution must be done from Safe
  console.log("═══════════════════════════════════════");
  console.log("📋 Calldata for Gnosis Safe:");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("⚠️  Note: This script generates calldata for Safe execution.");
  console.log("  You must execute from Safe, not from this script.");
  console.log("");
  
  const npm = new ethers.Contract(NPM, [
    "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) returns (uint256 tokenId,uint128 liquidity,uint256 amount0,uint256 amount1)"
  ], provider);
  
  const params = {
    token0: token0,
    token1: token1,
    fee: FEE,
    tickLower: TICK_LOWER,
    tickUpper: TICK_UPPER,
    amount0Desired: token0.toLowerCase() === PAXG.toLowerCase() ? amountPAXGWei : amountFSFOXWei,
    amount1Desired: token0.toLowerCase() === PAXG.toLowerCase() ? amountFSFOXWei : amountPAXGWei,
    amount0Min: 0,
    amount1Min: 0,
    recipient: SAFE,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
  };
  
  const calldata = npm.interface.encodeFunctionData("mint", [params]);
  
  console.log("🔹 Transaction to Add Liquidity:");
  console.log("   To:", NPM);
  console.log("   Value: 0");
  console.log("   Data:", calldata);
  console.log("");
  
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
  
  console.log("   JSON (for Safe Transaction Builder):");
  console.log("   " + JSON.stringify(transaction, null, 2));
  console.log("");
  
  console.log("💡 How to Execute:");
  console.log("  1. Go to: https://app.safe.global/polygon:0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130");
  console.log("  2. Click 'New Transaction' → 'Contract Interaction'");
  console.log("  3. To:", NPM);
  console.log("  4. Data: Copy calldata from above");
  console.log("  5. Submit → Sign → Execute");
  console.log("");
  console.log("📝 After execution (approx):");
  console.log("  - Pool PAXG will have: ~0.0344 PAXG + ~55,206.97 FSFOX");
  console.log("  - Total $ value will approximately match USDC PoS Bridge pool liquidity");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

