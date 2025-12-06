const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const POOL_USDT = "0x4E06f9f368c27962431c508423263B899f8AF4bD"; // Pool FSFOX/USDT (created via createUSDTPool.js)
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const FEE = 3000; // 0.3%

// ============================================
// Settings: Amounts to match other pools
// ============================================
// Target: Match current USDC PoS Bridge Pool (~144.174494 USDC + ~55,206.97 FSFOX)
const AMOUNT_USDT = "144.174494"; // USDT amount (≈ USDC side of current USDC pool)
const AMOUNT_FSFOX = "55206.9722"; // FSFOX amount (≈ FSFOX side of current USDC pool)

// Full range ticks for 0.3% fee (tickSpacing = 60)
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

async function main() {
  console.log("🚀 Adding Liquidity to FSFOX/USDT Pool\n");
  
  if (!POOL_USDT || POOL_USDT === "") {
    console.log("❌ Error: Enter Pool address!");
    console.log("   First run createUSDTPool.js");
    return;
  }
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Signer:", signer.address);
  console.log("  Safe:", SAFE);
  console.log("  Pool:", POOL_USDT);
  console.log("");
  
  // Contracts
  const usdt = new ethers.Contract(USDT, [
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
  const usdtDecimals = await usdt.decimals();
  const fsfoxDecimals = 18;
  
  // Check current pool ratio
  const pool = new ethers.Contract(POOL_USDT, [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  const token0 = await pool.token0();
  const token1 = await pool.token1();
  
  const poolUSDTBalance = await usdt.balanceOf(POOL_USDT);
  const poolFSFOXBalance = await fsfox.balanceOf(POOL_USDT);
  
  const poolUSDT = parseFloat(ethers.formatUnits(poolUSDTBalance, usdtDecimals));
  const poolFSFOX = parseFloat(ethers.formatEther(poolFSFOXBalance));
  
  console.log("📊 Current Pool Status:");
  console.log("  USDT:", poolUSDT.toFixed(6));
  console.log("  FSFOX:", poolFSFOX.toFixed(2));
  console.log("");
  
  // Convert to wei
  const amountUSDTWei = ethers.parseUnits(AMOUNT_USDT, usdtDecimals);
  const amountFSFOXWei = ethers.parseEther(AMOUNT_FSFOX);
  
  console.log("💰 Amounts to Add:");
  console.log("  USDT:", AMOUNT_USDT);
  console.log("  FSFOX:", AMOUNT_FSFOX);
  console.log("");
  
  // Check balances in Safe
  const safeUSDTBalance = await usdt.balanceOf(SAFE);
  const safeFSFOXBalance = await fsfox.balanceOf(SAFE);
  
  console.log("💵 Safe Balance:");
  console.log("  USDT:", ethers.formatUnits(safeUSDTBalance, usdtDecimals));
  console.log("  FSFOX:", ethers.formatEther(safeFSFOXBalance));
  console.log("");
  
  if (safeUSDTBalance < amountUSDTWei) {
    console.log("❌ Error: Insufficient USDT balance in Safe!");
    console.log("  Required:", AMOUNT_USDT, "USDT");
    console.log("  Available:", ethers.formatUnits(safeUSDTBalance, usdtDecimals), "USDT");
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
  const usdtAllowance = await usdt.allowance(SAFE, NPM);
  const fsfoxAllowance = await fsfox.allowance(SAFE, NPM);
  
  console.log("✅ Current Allowance (Safe → NPM):");
  console.log("  USDT:", ethers.formatUnits(usdtAllowance, usdtDecimals));
  console.log("  FSFOX:", ethers.formatEther(fsfoxAllowance));
  console.log("");
  
  if (usdtAllowance < amountUSDTWei) {
    console.log("⚠️  USDT Allowance insufficient!");
    console.log("  Required:", AMOUNT_USDT, "USDT");
    console.log("  Current:", ethers.formatUnits(usdtAllowance, usdtDecimals), "USDT");
    console.log("");
    console.log("💡 Action Required: Approve USDT from Safe");
    console.log("  To:", USDT);
    console.log("  Spender:", NPM);
    console.log("  Amount:", AMOUNT_USDT, "USDT (or MaxUint256)");
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
  
  if (usdtAllowance < amountUSDTWei || fsfoxAllowance < amountFSFOXWei) {
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
    amount0Desired: token0.toLowerCase() === USDT.toLowerCase() ? amountUSDTWei : amountFSFOXWei,
    amount1Desired: token0.toLowerCase() === USDT.toLowerCase() ? amountFSFOXWei : amountUSDTWei,
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
  console.log("📝 After execution:");
  console.log("  - Pool USDT will have: 144.420182 USDT + 55,244.41 FSFOX");
  console.log("  - This matches other pools' liquidity");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

