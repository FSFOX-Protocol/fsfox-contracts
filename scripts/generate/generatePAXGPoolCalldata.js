const { ethers } = require("hardhat");
require("dotenv").config();

// QuickSwap V3 Factory (same as Uniswap V3)
const QUICKSWAP_V3_FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

// Tokens
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";

// Fee tier 0.3% = 3000
const FEE = 3000;

// Prices
const FSFOX_PRICE_USDC = 0.001062;
const PAXG_PRICE_USD = 4000;

// Safe Address
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

async function main() {
  console.log("🔧 Generating Calldata for Creating FSFOX/PAXG Pool (for Safe)\n");
  
  const provider = ethers.provider;
  
  // Check PAXG address
  const paxgContract = new ethers.Contract(PAXG, [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ], provider);
  
  const paxgSymbol = await paxgContract.symbol();
  const paxgDecimals = await paxgContract.decimals();
  console.log("✅ PAXG Contract:");
  console.log("  Address:", PAXG);
  console.log("  Symbol:", paxgSymbol);
  console.log("  Decimals:", paxgDecimals.toString());
  console.log("");
  
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
  console.log("  FSFOX/PAXG: ", fsfoxPriceInPAXG.toFixed(10), "PAXG per 1 FSFOX");
  console.log("");
  
  // Factory contract interface
  const factoryInterface = new ethers.Interface([
    "function getPool(address,address,uint24) view returns (address)",
    "function createPool(address,address,uint24) returns (address pool)"
  ]);
  
  // Check existing Pool
  const factory = new ethers.Contract(QUICKSWAP_V3_FACTORY, factoryInterface, provider);
  const existingPool = await factory.getPool(token0, token1, FEE);
  
  if (existingPool !== ethers.ZeroAddress) {
    console.log("⚠️  Pool already exists:", existingPool);
    console.log("   You can go directly to Initialize step");
    console.log("");
  }
  
  // ============================================
  // Transaction 1: Create Pool (if doesn't exist)
  // ============================================
  if (existingPool === ethers.ZeroAddress) {
    console.log("📝 Transaction 1: Create Pool");
    console.log("  To:", QUICKSWAP_V3_FACTORY);
    console.log("  Function: createPool");
    console.log("  Parameters:");
    console.log("    token0:", token0);
    console.log("    token1:", token1);
    console.log("    fee:", FEE);
    console.log("");
    
    const createPoolCalldata = factoryInterface.encodeFunctionData("createPool", [
      token0,
      token1,
      FEE
    ]);
    
    console.log("  Calldata:");
    console.log("  ", createPoolCalldata);
    console.log("");
    console.log("  📋 For Safe:");
    console.log("    1. New Transaction → Contract interaction");
    console.log("    2. To:", QUICKSWAP_V3_FACTORY);
    console.log("    3. Toggle 'Custom data' OFF");
    console.log("    4. ABI:");
    console.log('       [{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"}],"name":"createPool","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"nonpayable","type":"function"}]');
    console.log("    5. Function: createPool");
    console.log("    6. tokenA:", token0);
    console.log("    7. tokenB:", token1);
    console.log("    8. fee:", FEE);
    console.log("    9. Submit → Sign → Execute");
    console.log("");
  }
  
  // ============================================
  // Transaction 2: Initialize Pool
  // ============================================
  // For Initialize, we need to know Pool address
  // If Pool exists, we use it
  // If not, we need to get address after creating Pool
  
  let poolAddress = existingPool;
  if (poolAddress === ethers.ZeroAddress) {
    console.log("⚠️  To Initialize, first create Pool");
    console.log("   After creating Pool, enter address in Script and run again");
    console.log("");
    console.log("   Or use this Calldata (after creating Pool):");
    console.log("");
  } else {
    // Pool already exists - only Initialize needed
    console.log("✅ Pool already exists!");
    console.log("   Pool Address:", poolAddress);
    console.log("   Only Initialize needed (createPool not needed)");
    console.log("");
    console.log("📝 Transaction 2: Initialize Pool");
    console.log("  Pool Address:", poolAddress);
    console.log("");
    
    // Calculate sqrtPriceX96
    const poolInterface = new ethers.Interface([
      "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)",
      "function initialize(uint160 sqrtPriceX96)"
    ]);
    
    const poolContract = new ethers.Contract(poolAddress, poolInterface, provider);
    const slot0 = await poolContract.slot0();
    const initialized = slot0.unlocked;
    
    if (initialized) {
      console.log("  ✅ Pool is already Initialized");
      console.log("  Current sqrtPriceX96:", slot0.sqrtPriceX96.toString());
      console.log("");
    } else {
      // Calculate sqrtPriceX96
      let sqrtPriceX96;
      if (token0 === FSFOX) {
        const amount1 = ethers.parseEther(fsfoxPriceInPAXG.toString());
        const amount0 = ethers.parseEther("1");
        sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
      } else {
        const fsfoxPerPaxg = 1 / fsfoxPriceInPAXG;
        const amount1 = ethers.parseEther(Math.floor(fsfoxPerPaxg).toString());
        const amount0 = ethers.parseEther("1");
        sqrtPriceX96 = encodeSqrtPriceX96(amount1, amount0);
      }
      
      console.log("  To:", poolAddress);
      console.log("  Function: initialize");
      console.log("  Parameters:");
      console.log("    sqrtPriceX96:", sqrtPriceX96.toString());
      console.log("");
      
      const initializeCalldata = poolInterface.encodeFunctionData("initialize", [sqrtPriceX96]);
      
      console.log("  Calldata:");
      console.log("  ", initializeCalldata);
      console.log("");
      console.log("  📋 For Safe:");
      console.log("    1. New Transaction → Contract interaction");
      console.log("    2. To:", poolAddress);
      console.log("    3. Toggle 'Custom data' OFF");
      console.log("    4. ABI:");
      console.log('       [{"inputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
      console.log("    5. Function: initialize");
      console.log("    6. sqrtPriceX96:", sqrtPriceX96.toString());
      console.log("    7. Submit → Sign → Execute");
      console.log("");
    }
  }
  
  console.log("💡 Notes:");
  console.log("  - If Pool doesn't exist, first do createPool");
  console.log("  - After createPool, get Pool address from Transaction Receipt");
  console.log("  - Then do Initialize");
  console.log("  - After Initialize, you can add Liquidity");
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

