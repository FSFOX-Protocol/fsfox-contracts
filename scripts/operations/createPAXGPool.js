const { ethers } = require("hardhat");
require("dotenv").config();

// QuickSwap V3 Factory (same as Uniswap V3)
const QUICKSWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// Tokens
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5"; // PAXG on Polygon

// Fee tier 0.3% = 3000 (you can also use 0.05% = 500)
const FEE = 3000;

// Current FSFOX/USDC price (from current Pool)
const FSFOX_PRICE_USDC = 0.001062;

// PAXG price in USD (please update)
const PAXG_PRICE_USD = 4000;

async function main() {
  console.log("🚀 Creating FSFOX/PAXG Pool on QuickSwap V3\n");
  
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.log("❌ Error: Signer not found!");
    console.log("   Please set PRIVATE_KEY in .env");
    return;
  }
  
  const signer = signers[0];
  console.log("📝 Deployer:", signer.address);
  console.log("");
  
  // Check PAXG address
  try {
    const paxgContract = new ethers.Contract(PAXG, [
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ], ethers.provider);
    
    const paxgSymbol = await paxgContract.symbol();
    const paxgDecimals = await paxgContract.decimals();
    console.log("✅ PAXG Contract:");
    console.log("  Address:", PAXG);
    console.log("  Symbol:", paxgSymbol);
    console.log("  Decimals:", paxgDecimals);
    console.log("");
  } catch (error) {
    console.log("❌ Error checking PAXG:", error.message);
    console.log("   Please enter correct PAXG address in Script");
    return;
  }
  
  // Determine token order (lexical order)
  const token0 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? FSFOX : PAXG;
  const token1 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? PAXG : FSFOX;
  
  console.log("🔤 Token Order (lexical order):");
  console.log("  token0:", token0 === FSFOX ? "FSFOX" : "PAXG", `(${token0})`);
  console.log("  token1:", token1 === FSFOX ? "FSFOX" : "PAXG", `(${token1})`);
  console.log("");
  
  // Calculate FSFOX/PAXG price
  const fsfoxPriceInPAXG = FSFOX_PRICE_USDC / PAXG_PRICE_USD;
  console.log("💱 FSFOX/PAXG Price:");
  console.log("  FSFOX Price (USDC): $", FSFOX_PRICE_USDC);
  console.log("  PAXG Price (USD): $", PAXG_PRICE_USD);
  console.log("  FSFOX/PAXG: ", fsfoxPriceInPAXG.toFixed(10), "PAXG per 1 FSFOX");
  console.log("  Or: ", (1 / fsfoxPriceInPAXG).toFixed(2), "FSFOX per 1 PAXG");
  console.log("");
  
  // Factory contract
  const factory = await ethers.getContractAt(
    [
      "function getPool(address,address,uint24) view returns (address)",
      "function createPool(address,address,uint24) returns (address pool)"
    ],
    QUICKSWAP_V3_FACTORY,
    signer
  );
  
  // Check existing Pool
  let pool = await factory.getPool(token0, token1, FEE);
  if (pool === ethers.ZeroAddress) {
    console.log("📦 Creating Pool...");
    const tx = await factory.createPool(token0, token1, FEE);
    console.log("  📝 Transaction hash:", tx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    const receipt = await tx.wait();
    pool = await factory.getPool(token0, token1, FEE);
    console.log("  ✅ Pool created:", pool);
  } else {
    console.log("⚠️  Pool already exists:", pool);
  }
  console.log("");
  
  // Initialize pool if not initialized
  const poolContract = await ethers.getContractAt(
    [
      "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)",
      "function initialize(uint160 sqrtPriceX96)"
    ],
    pool,
    signer
  );
  
  const slot0 = await poolContract.slot0();
  const initialized = slot0.unlocked;
  
  if (!initialized) {
    console.log("🔢 Initializing Pool with price...");
    
    // Calculate sqrtPriceX96
    // For initial price, we use sample values
    // price = token1/token0
    
    let sqrtPriceX96;
    if (token0 === FSFOX) {
      // price = PAXG / FSFOX
      // Example: 1 FSFOX = 0.0000002658 PAXG
      // For calculation: amount1 (PAXG) = 0.0000002658 * 10^18, amount0 (FSFOX) = 1 * 10^18
      const amount1 = ethers.parseEther(fsfoxPriceInPAXG.toString());
      const amount0 = ethers.parseEther("1");
      sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
    } else {
      // price = FSFOX / PAXG
      // token0 = PAXG, token1 = FSFOX
      // price = FSFOX / PAXG = 1 / fsfoxPriceInPAXG
      // For calculation: amount1 (FSFOX) = (1 / fsfoxPriceInPAXG) * 10^18, amount0 (PAXG) = 1 * 10^18
      const fsfoxPerPaxg = 1 / fsfoxPriceInPAXG;
      // Use BigInt for better precision
      const amount1 = ethers.parseEther(Math.floor(fsfoxPerPaxg).toString());
      const amount0 = ethers.parseEther("1");
      sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
    }
    
    console.log("  sqrtPriceX96:", sqrtPriceX96.toString());
    console.log("  ⏳ Initializing...");
    
    const tx2 = await poolContract.initialize(sqrtPriceX96);
    console.log("  📝 Transaction hash:", tx2.hash);
    console.log("  ⏳ Waiting for confirmation...");
    await tx2.wait();
    console.log("  ✅ Pool Initialized.");
  } else {
    console.log("✅ Pool is already Initialized.");
    const currentPrice = slot0[0];
    console.log("  Current sqrtPriceX96:", currentPrice.toString());
  }
  
  console.log("");
  console.log("🎉 Pool is ready!");
  console.log("  Pool Address:", pool);
  console.log("");
  console.log("📋 Next Steps:");
  console.log("  1. Use addPAXGLiquidity.js to add Liquidity");
  console.log("  2. Or use QuickSwap UI to add Liquidity");
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

