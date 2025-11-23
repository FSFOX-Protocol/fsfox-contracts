const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 SwapRouter (QuickSwap also uses this)
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const POOL_FEE = 3000; // 0.3%

// ============================================
// Settings: PAXG Amount for Purchase
// ============================================
// You can change the amount or use available balance
const AMOUNT_PAXG = "0.001"; // PAXG amount to buy FSFOX (you can change)

// Slippage tolerance (5%)
const SLIPPAGE_TOLERANCE = 5; // 5%

async function main() {
  console.log("🚀 Buying FSFOX with PAXG\n");
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Account:", signer.address);
  console.log("  PAXG:", PAXG);
  console.log("  FSFOX:", FSFOX);
  console.log("  Pool:", POOL_PAXG);
  console.log("  SwapRouter:", SWAP_ROUTER);
  console.log("");
  
  // Contracts
  const paxg = new ethers.Contract(PAXG, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ], signer);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)"
  ], signer);
  
  // Get decimals
  const paxgDecimals = await paxg.decimals();
  const fsfoxDecimals = 18;
  
  // Check balance
  const paxgBalance = await paxg.balanceOf(signer.address);
  const fsfoxBalanceBefore = await fsfox.balanceOf(signer.address);
  
  console.log("💵 Balance Before Swap:");
  console.log("  PAXG:", ethers.formatUnits(paxgBalance, paxgDecimals));
  console.log("  FSFOX:", ethers.formatEther(fsfoxBalanceBefore));
  console.log("");
  
  // Convert amount
  const amountPAXG = ethers.parseUnits(AMOUNT_PAXG, paxgDecimals);
  
  if (paxgBalance < amountPAXG) {
    console.log("❌ Error: Insufficient PAXG balance!");
    console.log("  Required:", AMOUNT_PAXG, "PAXG");
    console.log("  Available:", ethers.formatUnits(paxgBalance, paxgDecimals), "PAXG");
    return;
  }
  
  // Check allowance
  const allowance = await paxg.allowance(signer.address, SWAP_ROUTER);
  
  console.log("✅ Allowance:");
  console.log("  Current:", ethers.formatUnits(allowance, paxgDecimals), "PAXG");
  console.log("");
  
  // Approve if needed
  if (allowance < amountPAXG) {
    console.log("🔓 Approving PAXG...");
    const approveTx = await paxg.approve(SWAP_ROUTER, ethers.MaxUint256);
    console.log("  📝 Transaction hash:", approveTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    await approveTx.wait();
    console.log("  ✅ Approve successful!");
    console.log("");
  }
  
  // Get pool info
  const pool = new ethers.Contract(POOL_PAXG, [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  const token0 = await pool.token0();
  const token1 = await pool.token1();
  
  // Get pool balances for better price calculation
  const poolPAXGBalance = await paxg.balanceOf(POOL_PAXG);
  const poolFSFOXBalance = await fsfox.balanceOf(POOL_PAXG);
  
  // Calculate expected output based on pool balances
  let estimatedFSFOX;
  if (poolPAXGBalance > 0n && poolFSFOXBalance > 0n) {
    // Use pool ratio for estimation
    // ratio = FSFOX / PAXG
    estimatedFSFOX = (amountPAXG * poolFSFOXBalance) / poolPAXGBalance;
  } else {
    // Pool is empty, use price from slot0
    const slot0 = await pool.slot0();
    const sqrtPriceX96 = slot0.sqrtPriceX96;
    const Q96 = 2n ** 96n;
    
    if (token0.toLowerCase() === PAXG.toLowerCase()) {
      // price = FSFOX / PAXG = (sqrtPriceX96 / Q96)^2
      const price = (sqrtPriceX96 * sqrtPriceX96) / (Q96 * Q96);
      estimatedFSFOX = (amountPAXG * price) / (10n ** BigInt(paxgDecimals - fsfoxDecimals));
    } else {
      // price = PAXG / FSFOX, so FSFOX = PAXG / price
      const price = (Q96 * Q96) / (sqrtPriceX96 * sqrtPriceX96);
      estimatedFSFOX = (amountPAXG * price) / (10n ** BigInt(paxgDecimals - fsfoxDecimals));
    }
  }
  
  // Apply slippage
  const amountOutMinimum = (estimatedFSFOX * BigInt(100 - SLIPPAGE_TOLERANCE)) / 100n;
  
  console.log("📊 Swap Parameters:");
  console.log("  Token In (PAXG):", PAXG);
  console.log("  Token Out (FSFOX):", FSFOX);
  console.log("  Fee:", POOL_FEE, "(0.3%)");
  console.log("  Amount In:", AMOUNT_PAXG, "PAXG");
  console.log("  Estimated Out:", ethers.formatEther(estimatedFSFOX), "FSFOX");
    console.log("  Amount Out Min:", ethers.formatEther(amountOutMinimum), "FSFOX (with", SLIPPAGE_TOLERANCE + "% slippage)");
  console.log("  Recipient:", signer.address);
  console.log("");
  
  // Prepare swap params
  const swapRouter = await ethers.getContractAt(
    [
      "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)) returns (uint256 amountOut)"
    ],
    SWAP_ROUTER,
    signer
  );
  
  const params = {
    tokenIn: PAXG,
    tokenOut: FSFOX,
    fee: POOL_FEE,
    recipient: signer.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
    amountIn: amountPAXG,
    amountOutMinimum: amountOutMinimum,
    sqrtPriceLimitX96: 0 // No price limit
  };
  
  console.log("🔄 Executing Swap...");
  
  try {
    const swapTx = await swapRouter.exactInputSingle(params);
    console.log("  📝 Transaction hash:", swapTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    const receipt = await swapTx.wait();
    console.log("  ✅ Swap successful!");
    console.log("  📊 Block:", receipt.blockNumber);
    console.log("");
    
    // Check new balance
    const fsfoxBalanceAfter = await fsfox.balanceOf(signer.address);
    const fsfoxReceived = fsfoxBalanceAfter - fsfoxBalanceBefore;
    
    console.log("💰 Result:");
    console.log("  FSFOX Received:", ethers.formatEther(fsfoxReceived));
    console.log("  FSFOX New Balance:", ethers.formatEther(fsfoxBalanceAfter));
    console.log("");
    
    console.log("🔗 Polygonscan:");
    console.log("  https://polygonscan.com/tx/" + swapTx.hash);
  } catch (error) {
    console.log("  ❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
    console.log("");
    console.log("💡 Check:");
    console.log("  1. Is PAXG balance sufficient?");
    console.log("  2. Is allowance sufficient?");
    console.log("  3. Does Pool have liquidity?");
    console.log("  4. Is slippage sufficient?");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

