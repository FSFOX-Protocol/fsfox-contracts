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
// Settings: Enter your desired amounts
// ============================================
// For initial liquidity ($91.997634) with PAXG price = $4000:
const AMOUNT_PAXG = "0.011500"; // PAXG amount (updated)
const AMOUNT_FSFOX = "43261.740279"; // FSFOX amount

// For more/less liquidity, change the amounts
// Or leave AMOUNT_FSFOX empty to auto-calculate

// Full range ticks for 0.3% fee (tickSpacing = 60)
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

async function main() {
  console.log("🚀 Adding Liquidity to FSFOX/PAXG Pool\n");
  
  if (!POOL_PAXG || POOL_PAXG === "") {
    console.log("❌ Error: Enter Pool address!");
    console.log("   First run createPAXGPool.js");
    return;
  }
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Signer:", signer.address);
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
  
  let currentRatio;
  if (poolPAXG > 0 && poolFSFOX > 0) {
    if (token0.toLowerCase() === PAXG.toLowerCase()) {
      currentRatio = poolFSFOX / poolPAXG; // FSFOX per 1 PAXG
    } else {
      currentRatio = poolPAXG / poolFSFOX; // PAXG per 1 FSFOX
    }
  } else {
    // Pool is empty, use initial price
    const FSFOX_PRICE_USDC = 0.001063;
    const PAXG_PRICE_USD = 4000;
    const fsfoxPriceInPAXG = FSFOX_PRICE_USDC / PAXG_PRICE_USD;
    if (token0.toLowerCase() === PAXG.toLowerCase()) {
      currentRatio = 1 / fsfoxPriceInPAXG; // FSFOX per 1 PAXG
    } else {
      currentRatio = fsfoxPriceInPAXG; // PAXG per 1 FSFOX
    }
  }
  
  console.log("📊 Current Pool Ratio:");
  if (poolPAXG > 0 && poolFSFOX > 0) {
    console.log("  PAXG:", poolPAXG.toFixed(6));
    console.log("  FSFOX:", poolFSFOX.toFixed(2));
  } else {
    console.log("  Pool is empty (first Liquidity)");
  }
  console.log("");
  
  // Calculate FSFOX if empty
  let finalAmountPAXG = AMOUNT_PAXG;
  let finalAmountFSFOX = AMOUNT_FSFOX;
  
  if (!AMOUNT_FSFOX || AMOUNT_FSFOX.trim() === "" || parseFloat(AMOUNT_FSFOX) === 0) {
    const desiredPAXG = parseFloat(AMOUNT_PAXG);
    if (token0.toLowerCase() === PAXG.toLowerCase()) {
      const calculatedFSFOX = desiredPAXG * currentRatio;
      finalAmountFSFOX = Math.floor(calculatedFSFOX).toString();
    } else {
      const calculatedFSFOX = desiredPAXG / currentRatio;
      finalAmountFSFOX = Math.floor(calculatedFSFOX).toString();
    }
    console.log("🔢 Calculated FSFOX:", finalAmountFSFOX);
    console.log("");
  }
  
  // Convert to wei
  const amountPAXGWei = ethers.parseUnits(finalAmountPAXG, paxgDecimals);
  const amountFSFOXWei = ethers.parseEther(finalAmountFSFOX);
  
  console.log("💰 Final Amounts:");
  console.log("  PAXG:", finalAmountPAXG);
  console.log("  FSFOX:", finalAmountFSFOX);
  console.log("");
  
  // Check balances
  const signerPAXGBalance = await paxg.balanceOf(signer.address);
  const signerFSFOXBalance = await fsfox.balanceOf(signer.address);
  
  console.log("💵 Signer Balance:");
  console.log("  PAXG:", ethers.formatUnits(signerPAXGBalance, paxgDecimals));
  console.log("  FSFOX:", ethers.formatEther(signerFSFOXBalance));
  console.log("");
  
  if (signerPAXGBalance < amountPAXGWei) {
    console.log("❌ Error: Insufficient PAXG balance!");
    return;
  }
  
  if (signerFSFOXBalance < amountFSFOXWei) {
    console.log("❌ Error: Insufficient FSFOX balance!");
    return;
  }
  
  // Check allowances
  const paxgAllowance = await paxg.allowance(signer.address, NPM);
  const fsfoxAllowance = await fsfox.allowance(signer.address, NPM);
  
  console.log("✅ Allowance:");
  console.log("  PAXG:", ethers.formatUnits(paxgAllowance, paxgDecimals));
  console.log("  FSFOX:", ethers.formatEther(fsfoxAllowance));
  console.log("");
  
  // Approve if needed
  if (paxgAllowance < amountPAXGWei) {
    console.log("🔓 Approve PAXG...");
    const approveTx = await paxg.connect(signer).approve(NPM, ethers.MaxUint256);
    console.log("  📝 Transaction hash:", approveTx.hash);
    await approveTx.wait();
    console.log("  ✅ Approve successful!");
    console.log("");
  }
  
  if (fsfoxAllowance < amountFSFOXWei) {
    console.log("🔓 Approving FSFOX...");
    const approveTx = await fsfox.connect(signer).approve(NPM, ethers.MaxUint256);
    console.log("  📝 Transaction hash:", approveTx.hash);
    await approveTx.wait();
    console.log("  ✅ Approve successful!");
    console.log("");
  }
  
  // Mint liquidity
  console.log("💧 Adding Liquidity...");
  
  const npm = await ethers.getContractAt(
    [
      "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) returns (uint256 tokenId,uint128 liquidity,uint256 amount0,uint256 amount1)"
    ],
    NPM,
    signer
  );
  
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
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes
  };
  
  try {
    const mintTx = await npm.mint(params);
    console.log("  📝 Transaction hash:", mintTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    const receipt = await mintTx.wait();
    console.log("  ✅ Liquidity added!");
    console.log("  📊 Block:", receipt.blockNumber);
    
    // Parse events
    const mintEvent = receipt.logs.find(log => {
      try {
        const parsed = npm.interface.parseLog(log);
        return parsed && parsed.name === "Transfer";
      } catch {
        return false;
      }
    });
    
    if (mintEvent) {
      console.log("  🎫 NFT Position Token ID:", mintEvent.args[3]?.toString() || "N/A");
    }
  } catch (error) {
    console.log("  ❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

