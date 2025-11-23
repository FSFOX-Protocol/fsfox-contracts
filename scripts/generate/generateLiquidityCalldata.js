const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const FEE = 3000; // 0.3%

// ============================================
// Settings: Enter your desired amounts
// ============================================
const AMOUNT_USDC = "40"; // USDC amount (without decimals)
const AMOUNT_FSFOX = ""; // FSFOX amount (without decimals) - if empty, will be calculated automatically

// Full range ticks for 0.3% fee (tickSpacing = 60)
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

async function main() {
  console.log("🔧 Generating Calldata for Gnosis Safe\n");
  
  const provider = ethers.provider;
  
  const usdc = new ethers.Contract(USDC, [
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ], provider);
  
  // Determine token0 and token1 (lexical order)
  const token0 = FSFOX.toLowerCase() < USDC.toLowerCase() ? FSFOX : USDC;
  const token1 = FSFOX.toLowerCase() < USDC.toLowerCase() ? USDC : FSFOX;
  
  // Calculate current Pool ratio
  const pool = new ethers.Contract(POOL, [
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ], provider);
  
  const usdcDecimals = await usdc.decimals();
  const poolUSDCBalance = await usdc.balanceOf(POOL);
  const poolFSFOXBalance = await fsfox.balanceOf(POOL);
  
  const poolUSDC = parseFloat(ethers.formatUnits(poolUSDCBalance, usdcDecimals));
  const poolFSFOX = parseFloat(ethers.formatEther(poolFSFOXBalance));
  const currentRatio = poolFSFOX / poolUSDC;
  
  console.log("📊 Current Pool Ratio:");
  console.log("  Ratio:", currentRatio.toFixed(6), "FSFOX per 1 USDC");
  console.log("");
  
  // Calculate FSFOX if empty
  let finalAmountFSFOX = AMOUNT_FSFOX;
  if (!AMOUNT_FSFOX || AMOUNT_FSFOX.trim() === "" || parseFloat(AMOUNT_FSFOX) === 0) {
    const desiredUSDC = parseFloat(AMOUNT_USDC);
    const calculatedFSFOX = desiredUSDC * currentRatio;
    finalAmountFSFOX = Math.floor(calculatedFSFOX).toString();
    console.log("🔢 Calculated FSFOX:", finalAmountFSFOX);
    console.log("");
  }
  
  // Convert amounts
  const amountUSDC = ethers.parseUnits(AMOUNT_USDC, usdcDecimals);
  const amountFSFOX = ethers.parseUnits(finalAmountFSFOX, 18);
  
  // Determine amount0 and amount1
  const amount0 = token0 === USDC ? amountUSDC : amountFSFOX;
  const amount1 = token1 === USDC ? amountUSDC : amountFSFOX;
  
  console.log("💰 Amounts:");
  console.log("  USDC:", AMOUNT_USDC);
  console.log("  FSFOX:", finalAmountFSFOX);
  console.log("");
  
  // Generate Calldata for Approve USDC
  const usdcInterface = new ethers.Interface([
    "function approve(address spender, uint256 amount) returns (bool)"
  ]);
  const approveUSDCCalldata = usdcInterface.encodeFunctionData("approve", [
    NPM,
    amountUSDC * 110n / 100n // 10% buffer
  ]);
  
  // Generate Calldata for Approve FSFOX
  const fsfoxInterface = new ethers.Interface([
    "function approve(address spender, uint256 amount) returns (bool)"
  ]);
  const approveFSFOXCalldata = fsfoxInterface.encodeFunctionData("approve", [
    NPM,
    amountFSFOX * 110n / 100n // 10% buffer
  ]);
  
  // Generate Calldata for Mint
  const npmInterface = new ethers.Interface([
    "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
  ]);
  
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
  
  const mintParams = {
    token0: token0,
    token1: token1,
    fee: FEE,
    tickLower: TICK_LOWER,
    tickUpper: TICK_UPPER,
    amount0Desired: amount0,
    amount1Desired: amount1,
    amount0Min: 0,
    amount1Min: 0,
    recipient: SAFE,
    deadline: deadline
  };
  
  const mintCalldata = npmInterface.encodeFunctionData("mint", [mintParams]);
  
  console.log("═══════════════════════════════════════");
  console.log("📋 Calldata for Gnosis Safe:");
  console.log("═══════════════════════════════════════");
  console.log("");
  
  console.log("1️⃣  Approve USDC:");
  console.log("  To:", USDC);
  console.log("  Value: 0");
  console.log("  Data:", approveUSDCCalldata);
  console.log("");
  
  console.log("2️⃣  Approve FSFOX:");
  console.log("  To:", FSFOX);
  console.log("  Value: 0");
  console.log("  Data:", approveFSFOXCalldata);
  console.log("");
  
  console.log("3️⃣  Mint (Add Liquidity):");
  console.log("  To:", NPM);
  console.log("  Value: 0");
  console.log("  Data:", mintCalldata);
  console.log("");
  
  console.log("═══════════════════════════════════════");
  console.log("📝 How to Use:");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("1. Go to Gnosis Safe");
  console.log("2. New Transaction → Contract interaction");
  console.log("3. Copy To and Data from above");
  console.log("4. Submit → Sign → Execute");
  console.log("");
  console.log("⚠️  Note: Execute transactions in order:");
  console.log("   1. Approve USDC");
  console.log("   2. Approve FSFOX");
  console.log("   3. Mint");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

