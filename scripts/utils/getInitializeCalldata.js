const { ethers } = require("hardhat");
require("dotenv").config();

const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988"; // Pool Address
const FSFOX_PRICE_USDC = 0.001062;
const PAXG_PRICE_USD = 4000;

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";

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

async function main() {
  console.log("🔧 Generating Calldata for Initialize FSFOX/PAXG Pool\n");
  console.log("Pool Address:", POOL_PAXG);
  console.log("");
  
  const provider = ethers.provider;
  
  // Determine token order
  const token0 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? FSFOX : PAXG;
  const token1 = FSFOX.toLowerCase() < PAXG.toLowerCase() ? PAXG : FSFOX;
  
  console.log("🔤 Token Order:");
  console.log("  token0:", token0 === FSFOX ? "FSFOX" : "PAXG");
  console.log("  token1:", token1 === FSFOX ? "FSFOX" : "PAXG");
  console.log("");
  
  // Calculate price
  const fsfoxPriceInPAXG = FSFOX_PRICE_USDC / PAXG_PRICE_USD;
  console.log("💱 FSFOX/PAXG Price:");
  console.log("  ", fsfoxPriceInPAXG.toFixed(10), "PAXG per 1 FSFOX");
  console.log("");
  
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
  
  console.log("🔢 sqrtPriceX96:");
  console.log("  ", sqrtPriceX96.toString());
  console.log("");
  
  // Generate Calldata
  const poolInterface = new ethers.Interface([
    "function initialize(uint160 sqrtPriceX96)"
  ]);
  
  const calldata = poolInterface.encodeFunctionData("initialize", [sqrtPriceX96]);
  
  console.log("📝 Calldata:");
  console.log("  ", calldata);
  console.log("");
  
  console.log("📋 For Safe:");
  console.log("  1. New Transaction → Contract interaction");
  console.log("  2. To:", POOL_PAXG);
  console.log("  3. Toggle 'Custom data' OFF");
  console.log("  4. ABI:");
  console.log('     [{"inputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
  console.log("  5. Function: initialize");
  console.log("  6. sqrtPriceX96:", sqrtPriceX96.toString());
  console.log("  7. Submit → Sign → Execute");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
