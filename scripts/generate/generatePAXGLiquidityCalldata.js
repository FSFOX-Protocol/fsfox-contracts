const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const FEE = 3000; // 0.3%

// ============================================
// Settings: Enter your desired amounts
// ============================================
const AMOUNT_PAXG = "0.011500"; // PAXG amount
const AMOUNT_FSFOX = "43261.740279"; // FSFOX amount

// Full range ticks for 0.3% fee (tickSpacing = 60)
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

async function main() {
  console.log("🔧 Generating Calldata for Adding FSFOX/PAXG Liquidity (for Safe)\n");
  
  const provider = ethers.provider;
  
  // Contracts
  const paxg = new ethers.Contract(PAXG, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)"
  ], provider);
  
  // Get decimals
  const paxgDecimals = await paxg.decimals();
  const fsfoxDecimals = 18;
  
  // Check Safe balances
  const safePAXGBalance = await paxg.balanceOf(SAFE);
  const safeFSFOXBalance = await fsfox.balanceOf(SAFE);
  
  console.log("💵 Safe Balance:");
  console.log("  PAXG:", ethers.formatUnits(safePAXGBalance, paxgDecimals));
  console.log("  FSFOX:", ethers.formatEther(safeFSFOXBalance));
  console.log("");
  
  // Convert amounts
  const amountPAXGWei = ethers.parseUnits(AMOUNT_PAXG, paxgDecimals);
  const amountFSFOXWei = ethers.parseEther(AMOUNT_FSFOX);
  
  console.log("💰 Required Amounts:");
  console.log("  PAXG:", AMOUNT_PAXG);
  console.log("  FSFOX:", AMOUNT_FSFOX);
  console.log("");
  
  // Check balances
  if (safePAXGBalance < amountPAXGWei) {
    console.log("❌ Error: Insufficient PAXG balance in Safe!");
    console.log("  Required:", AMOUNT_PAXG, "PAXG");
    console.log("  Available:", ethers.formatUnits(safePAXGBalance, paxgDecimals), "PAXG");
    console.log("");
    console.log("💡 Solution: Transfer more PAXG to Safe");
    return;
  }
  
  if (safeFSFOXBalance < amountFSFOXWei) {
    console.log("❌ Error: Insufficient FSFOX balance in Safe!");
    console.log("  Required:", AMOUNT_FSFOX, "FSFOX");
    console.log("  Available:", ethers.formatEther(safeFSFOXBalance), "FSFOX");
    console.log("");
    console.log("💡 Solution:");
    console.log("  1. Use unlockTokens()");
    console.log("  2. Or transfer more FSFOX to Safe");
    console.log("");
    console.log("📋 Amount needed to unlock:");
    const unlockNeeded = amountFSFOXWei - safeFSFOXBalance;
    console.log("  ", ethers.formatEther(unlockNeeded), "FSFOX");
    return;
  }
  
  // Get pool info
  const pool = new ethers.Contract(POOL_PAXG, [
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ], provider);
  
  const token0 = await pool.token0();
  const token1 = await pool.token1();
  
  // ============================================
  // Transaction 1: Approve PAXG
  // ============================================
  console.log("📝 Transaction 1: Approve PAXG");
  console.log("  To:", PAXG);
  console.log("  Function: approve");
  console.log("  Parameters:");
  console.log("    spender:", NPM);
  console.log("    amount:", ethers.MaxUint256.toString());
  console.log("");
  
  const paxgInterface = new ethers.Interface([
    "function approve(address spender, uint256 amount) returns (bool)"
  ]);
  
  const approvePAXGCalldata = paxgInterface.encodeFunctionData("approve", [
    NPM,
    ethers.MaxUint256
  ]);
  
  console.log("  Calldata:");
  console.log("  ", approvePAXGCalldata);
  console.log("");
  
  // ============================================
  // Transaction 2: Approve FSFOX
  // ============================================
  console.log("📝 Transaction 2: Approve FSFOX");
  console.log("  To:", FSFOX);
  console.log("  Function: approve");
  console.log("  Parameters:");
  console.log("    spender:", NPM);
  console.log("    amount:", ethers.MaxUint256.toString());
  console.log("");
  
  const fsfoxInterface = new ethers.Interface([
    "function approve(address spender, uint256 amount) returns (bool)"
  ]);
  
  const approveFSFOXCalldata = fsfoxInterface.encodeFunctionData("approve", [
    NPM,
    ethers.MaxUint256
  ]);
  
  console.log("  Calldata:");
  console.log("  ", approveFSFOXCalldata);
  console.log("");
  
  // ============================================
  // Transaction 3: Mint (Add Liquidity)
  // ============================================
  console.log("📝 Transaction 3: Mint (Add Liquidity)");
  console.log("  To:", NPM);
  console.log("  Function: mint");
  console.log("  Parameters:");
  console.log("    token0:", token0);
  console.log("    token1:", token1);
  console.log("    fee:", FEE);
  console.log("    tickLower:", TICK_LOWER);
  console.log("    tickUpper:", TICK_UPPER);
  console.log("    amount0Desired:", token0.toLowerCase() === PAXG.toLowerCase() ? amountPAXGWei.toString() : amountFSFOXWei.toString());
  console.log("    amount1Desired:", token0.toLowerCase() === PAXG.toLowerCase() ? amountFSFOXWei.toString() : amountPAXGWei.toString());
  console.log("    amount0Min: 0");
  console.log("    amount1Min: 0");
  console.log("    recipient:", SAFE);
  console.log("    deadline:", Math.floor(Date.now() / 1000) + 60 * 20);
  console.log("");
  
  const npmInterface = new ethers.Interface([
    "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) returns (uint256 tokenId,uint128 liquidity,uint256 amount0,uint256 amount1)"
  ]);
  
  const mintParams = {
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
    deadline: Math.floor(Date.now() / 1000) + 60 * 20
  };
  
  const mintCalldata = npmInterface.encodeFunctionData("mint", [mintParams]);
  
  console.log("  Calldata:");
  console.log("  ", mintCalldata);
  console.log("");
  
  console.log("📋 For Safe:");
  console.log("  Transaction Order:");
  console.log("  1. Approve PAXG");
  console.log("  2. Approve FSFOX");
  console.log("  3. Mint (Add Liquidity)");
  console.log("");
  console.log("  Or use QuickSwap UI:");
  console.log("  https://quickswap.exchange/pools");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

