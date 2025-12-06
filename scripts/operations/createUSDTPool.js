const { ethers } = require("hardhat");
require("dotenv").config();

// QuickSwap V3 Factory (same as Uniswap V3)
const QUICKSWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// Tokens
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT PoS Bridge on Polygon

// Fee tier 0.3% = 3000
const FEE = 3000;

// Current FSFOX/USDC price (from current Pool)
// Calculated from on-chain ratio: 144.174494 USDC / 55,206.972162567576 FSFOX
const FSFOX_PRICE_USDC = 0.00261153;

async function main() {
  console.log("🚀 Creating FSFOX/USDT Pool on QuickSwap V3\n");
  
  const signers = await ethers.getSigners();
  if (!signers || signers.length === 0) {
    console.log("❌ Error: Signer not found!");
    console.log("   Please set PRIVATE_KEY in .env");
    return;
  }
  
  const signer = signers[0];
  console.log("📝 Deployer:", signer.address);
  console.log("");
  
  // Check USDT address
  try {
    const usdtContract = new ethers.Contract(USDT, [
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)"
    ], ethers.provider);
    
    const usdtSymbol = await usdtContract.symbol();
    const usdtDecimals = await usdtContract.decimals();
    console.log("✅ USDT Contract:");
    console.log("  Address:", USDT);
    console.log("  Symbol:", usdtSymbol);
    console.log("  Decimals:", usdtDecimals);
    console.log("");
  } catch (error) {
    console.log("❌ Error checking USDT:", error.message);
    console.log("   Please enter correct USDT address in Script");
    return;
  }
  
  // Determine token order (lexical order)
  const token0 = FSFOX.toLowerCase() < USDT.toLowerCase() ? FSFOX : USDT;
  const token1 = FSFOX.toLowerCase() < USDT.toLowerCase() ? USDT : FSFOX;
  
  console.log("🔤 Token Order (lexical order):");
  console.log("  token0:", token0 === FSFOX ? "FSFOX" : "USDT", `(${token0})`);
  console.log("  token1:", token1 === FSFOX ? "FSFOX" : "USDT", `(${token1})`);
  console.log("");
  
  // Calculate FSFOX/USDT price (same as FSFOX/USDC since both are $1)
  console.log("💱 FSFOX/USDT Price:");
  console.log("  FSFOX Price (USDC): $", FSFOX_PRICE_USDC);
  console.log("  FSFOX/USDT: ", FSFOX_PRICE_USDC, "USDT per 1 FSFOX");
  console.log("  Or: ", (1 / FSFOX_PRICE_USDC).toFixed(2), "FSFOX per 1 USDT");
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
    // price = token1/token0
    // For FSFOX/USDT: price = USDT / FSFOX = FSFOX_PRICE_USDC
    
    let sqrtPriceX96;
    if (token0 === FSFOX) {
      // price = USDT / FSFOX
      // Example: 1 FSFOX = 0.001062 USDT
      // For calculation: amount1 (USDT) = 0.001062 * 10^6, amount0 (FSFOX) = 1 * 10^18
      const usdtDecimals = 6;
      const amount1 = ethers.parseUnits(FSFOX_PRICE_USDC.toString(), usdtDecimals);
      const amount0 = ethers.parseEther("1");
      sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
    } else {
      // price = FSFOX / USDT
      // token0 = USDT, token1 = FSFOX
      // price = FSFOX / USDT = 1 / FSFOX_PRICE_USDC
      const fsfoxPerUsdt = 1 / FSFOX_PRICE_USDC;
      const usdtDecimals = 6;
      const amount1 = ethers.parseEther(Math.floor(fsfoxPerUsdt).toString());
      const amount0 = ethers.parseUnits("1", usdtDecimals);
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
  console.log("  1. Use addUSDTLiquidity.js to add Liquidity");
  console.log("  2. Or use QuickSwap UI to add Liquidity");
  console.log("  3. Add Pool to allowlist in FSFOX contract");
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

