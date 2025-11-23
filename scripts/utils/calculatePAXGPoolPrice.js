const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const POOL_USDC = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";

// PAXG on Polygon (Paxos Gold)
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5"; // PAXG on Polygon

// QuickSwap V3 Factory (same as Uniswap V3)
const QUICKSWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// Target liquidity value (USD)
const TARGET_LIQUIDITY_USD = 91.997634;

async function main() {
  console.log("📊 Calculating Price and Amounts for FSFOX/PAXG Pool\n");
  
  const provider = ethers.provider;
  
  // Get current USDC Pool price
  const usdc = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)"
  ], provider);
  
  const poolUSDC = new ethers.Contract(POOL_USDC, [
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)",
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ], provider);
  
  // Get PAXG contract (if exists)
  let paxgContract;
  try {
    paxgContract = new ethers.Contract(PAXG, [
      "function decimals() view returns (uint8)",
      "function balanceOf(address) view returns (uint256)"
    ], provider);
    await paxgContract.decimals();
    console.log("✅ PAXG contract found:", PAXG);
  } catch (error) {
    console.log("⚠️  PAXG contract not found at:", PAXG);
    console.log("   Please enter correct PAXG address in Script");
    console.log("");
    console.log("💡 To Find PAXG Address:");
    console.log("   1. Go to https://polygonscan.com");
    console.log("   2. Search for 'PAXG'");
    console.log("   3. Enter address in Script");
    return;
  }
  
  // Get current USDC Pool balances
  const usdcDecimals = await usdc.decimals();
  const poolUSDCBalance = await usdc.balanceOf(POOL_USDC);
  const poolFSFOXBalance = await fsfox.balanceOf(POOL_USDC);
  
  const poolUSDCAmount = parseFloat(ethers.formatUnits(poolUSDCBalance, usdcDecimals));
  const poolFSFOXAmount = parseFloat(ethers.formatEther(poolFSFOXBalance));
  
  // Calculate current price: USDC per FSFOX
  const currentPriceUSDC = poolUSDCAmount / poolFSFOXAmount;
  
  console.log("📊 Current Pool Status (FSFOX/USDC):");
  console.log("  USDC:", poolUSDCAmount.toFixed(6));
  console.log("  FSFOX:", poolFSFOXAmount.toFixed(6));
  console.log("  Price: $", currentPriceUSDC.toFixed(6), "per FSFOX");
  console.log("");
  
  // Get PAXG price (approximate, you may need to fetch from oracle)
  // PAXG is usually around $1800-2000 per ounce
  // For now, we'll use a placeholder - user should update this
  const PAXG_PRICE_USD = 4000; // Approximate PAXG price in USD
  console.log("💰 PAXG Price (Approximate):");
  console.log("  $", PAXG_PRICE_USD, "per PAXG");
  console.log("  ⚠️  Please check and update exact PAXG price in Script");
  console.log("");
  
  // Calculate FSFOX price in PAXG
  // FSFOX price = $0.001062
  // PAXG price = $1800
  // FSFOX/PAXG = 0.001062 / 1800 = 0.00000059 PAXG per FSFOX
  const fsfoxPriceInPAXG = currentPriceUSDC / PAXG_PRICE_USD;
  
  console.log("💱 FSFOX/PAXG Price:");
  console.log("  ", fsfoxPriceInPAXG.toFixed(10), "PAXG per 1 FSFOX");
  console.log("  Or:", (1 / fsfoxPriceInPAXG).toFixed(2), "FSFOX per 1 PAXG");
  console.log("");
  
  // Calculate amounts for target liquidity
  // Target: $91.997634 total value
  // We want equal value in both tokens (50/50)
  // So: $45.998817 in FSFOX and $45.998817 in PAXG
  
  const targetValuePerToken = TARGET_LIQUIDITY_USD / 2;
  
  // Amount of FSFOX needed (in USD value)
  const amountFSFOX_USD = targetValuePerToken;
  const amountFSFOX = amountFSFOX_USD / currentPriceUSDC;
  
  // Amount of PAXG needed (in USD value)
  const amountPAXG_USD = targetValuePerToken;
  const amountPAXG = amountPAXG_USD / PAXG_PRICE_USD;
  
  console.log("💧 Required Amounts for Liquidity ($", TARGET_LIQUIDITY_USD, "):");
  console.log("  FSFOX:", amountFSFOX.toFixed(6), "FSFOX ($", amountFSFOX_USD.toFixed(6), ")");
  console.log("  PAXG:", amountPAXG.toFixed(6), "PAXG ($", amountPAXG_USD.toFixed(6), ")");
  console.log("");
  
  // Get PAXG decimals
  const paxgDecimals = await paxgContract.decimals();
  
  // Convert to wei
  const amountFSFOXWei = ethers.parseEther(amountFSFOX.toString());
  const amountPAXGWei = ethers.parseUnits(amountPAXG.toString(), paxgDecimals);
  
  console.log("📝 Amounts (raw):");
  console.log("  FSFOX:", amountFSFOXWei.toString());
  console.log("  PAXG:", amountPAXGWei.toString());
  console.log("");
  
  // Calculate sqrtPriceX96 for initialization
  // price = PAXG / FSFOX
  // We need to determine token0 and token1 (lexical order)
  const token0 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? FSFOX : PAXG;
  const token1 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? PAXG : FSFOX;
  
  console.log("🔤 Token Order (lexical order):");
  console.log("  token0:", token0 === FSFOX ? "FSFOX" : "PAXG", `(${token0})`);
  console.log("  token1:", token1 === FSFOX ? "FSFOX" : "PAXG", `(${token1})`);
  console.log("");
  
  // Calculate sqrtPriceX96
  // If token0 = FSFOX, token1 = PAXG
  // price = token1/token0 = PAXG/FSFOX
  // If token0 = PAXG, token1 = FSFOX
  // price = token1/token0 = FSFOX/PAXG
  
  let sqrtPriceX96;
  if (token0 === FSFOX) {
    // price = PAXG / FSFOX = fsfoxPriceInPAXG
    const amount1 = amountPAXGWei; // PAXG
    const amount0 = amountFSFOXWei; // FSFOX
    sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
  } else {
    // price = FSFOX / PAXG = 1 / fsfoxPriceInPAXG
    const amount1 = amountFSFOXWei; // FSFOX
    const amount0 = amountPAXGWei; // PAXG
    sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
  }
  
  console.log("🔢 sqrtPriceX96 for Initialize:");
  console.log("  ", sqrtPriceX96.toString());
  console.log("");
  
  console.log("✅ Summary:");
  console.log("  Current FSFOX/USDC Price: $", currentPriceUSDC.toFixed(6));
  console.log("  FSFOX/PAXG Price: ", fsfoxPriceInPAXG.toFixed(10), "PAXG per FSFOX");
  console.log("  FSFOX Amount: ", amountFSFOX.toFixed(6));
  console.log("  PAXG Amount: ", amountPAXG.toFixed(6));
  console.log("  Total Value: $", TARGET_LIQUIDITY_USD);
  console.log("");
  
  console.log("📋 Next Steps:");
  console.log("  1. Check PAXG address");
  console.log("  2. Update exact PAXG price");
  console.log("  3. Use createPAXGPool.js to create Pool");
  console.log("  4. Use addPAXGLiquidity.js to add Liquidity");
}

function encodeSqrtPriceX96(amount1, amount0) {
  const Q96 = 2n ** 96n;
  const numerator = BigInt(amount1) * Q96 * Q96;
  const ratio = numerator / BigInt(amount0);
  return sqrt(ratio);
}

function sqrt(value) {
  if (value < 0n) throw new Error("negative");
  if (value < 2n) return value;
  function newtonIteration(n, x0) {
    const x1 = (n / x0 + x0) >> 1n;
    if (x0 === x1 || x0 === x1 - 1n) return x0;
    return newtonIteration(n, x1);
  }
  return newtonIteration(value, 1n << 128n);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

