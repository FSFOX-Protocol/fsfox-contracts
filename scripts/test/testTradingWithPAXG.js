const { ethers } = require("hardhat");
require("dotenv").config();

const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const PAXG = "0x553d3D295e0f695B9228246232eDF400ed3560B5";
const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
const POOL_FEE = 3000;
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";

// ============================================
// Settings: PAXG Amount for Test Purchase
// ============================================
const AMOUNT_PAXG = "0.001"; // PAXG amount for test purchase

async function main() {
  console.log("🧪 Testing FSFOX Purchase with PAXG after enableTrading()\n");
  
  const provider = ethers.provider;
  
  // Check if trading is enabled
  const fsfox = new ethers.Contract(FSFOX, [
    "function tradingEnabled() view returns (bool)"
  ], provider);
  
  const tradingEnabled = await fsfox.tradingEnabled();
  
  console.log("📊 Trading Status:");
  console.log("  tradingEnabled:", tradingEnabled ? "✅ Active" : "❌ Inactive");
  console.log("");
  
  if (!tradingEnabled) {
    console.log("⚠️  Trading is inactive!");
    console.log("");
    console.log("💡 To enable Trading:");
    console.log("  1. Use Gnosis Safe");
    console.log("  2. To: " + FSFOX);
    console.log("  3. Function: enableTrading()");
    console.log("  4. Submit → Sign → Execute");
    console.log("");
    console.log("⚠️  Important Warning:");
    console.log("  After enableTrading(), it cannot be disabled!");
    console.log("  Contract only has enableTrading() and no function to disable!");
    console.log("");
    return;
  }
  
  // Check if we have PRIVATE_KEY
  if (!process.env.PRIVATE_KEY) {
    console.log("❌ Error: PRIVATE_KEY not set in .env!");
    console.log("");
    console.log("💡 For test purchase:");
    console.log("  1. Set PRIVATE_KEY in .env");
    console.log("  2. Or use MetaMask and QuickSwap UI");
    return;
  }
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log("📝 Information:");
  console.log("  Account:", wallet.address);
  console.log("  PAXG:", PAXG);
  console.log("  FSFOX:", FSFOX);
  console.log("  Pool:", POOL_PAXG);
  console.log("");
  
  // Contracts
  const paxg = new ethers.Contract(PAXG, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ], wallet);
  
  const fsfoxContract = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)"
  ], provider);
  
  // Get decimals
  const paxgDecimals = await paxg.decimals();
  
  // Check balance
  const paxgBalance = await paxg.balanceOf(wallet.address);
  const fsfoxBalanceBefore = await fsfoxContract.balanceOf(wallet.address);
  
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
  const allowance = await paxg.allowance(wallet.address, SWAP_ROUTER);
  
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
  
  // Get pool info for price calculation
  const pool = new ethers.Contract(POOL_PAXG, [
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function slot0() view returns (uint160 sqrtPriceX96,int24 tick,uint16 observationIndex,uint16 observationCardinality,uint16 observationCardinalityNext,uint8 feeProtocol,bool unlocked)"
  ], provider);
  
  const token0 = await pool.token0();
  const token1 = await pool.token1();
  
  // Get pool balances for price calculation
  const poolPAXGBalance = await paxg.balanceOf(POOL_PAXG);
  const poolFSFOXBalance = await fsfoxContract.balanceOf(POOL_PAXG);
  
  // Calculate expected output
  let estimatedFSFOX;
  if (poolPAXGBalance > 0n && poolFSFOXBalance > 0n) {
    estimatedFSFOX = (amountPAXG * poolFSFOXBalance) / poolPAXGBalance;
  } else {
    console.log("❌ Error: Pool has no Liquidity!");
    return;
  }
  
  // Apply slippage (5%)
  const amountOutMinimum = (estimatedFSFOX * 95n) / 100n;
  
  console.log("📊 Swap Parameters:");
  console.log("  Token In (PAXG):", PAXG);
  console.log("  Token Out (FSFOX):", FSFOX);
  console.log("  Fee:", POOL_FEE, "(0.3%)");
  console.log("  Amount In:", AMOUNT_PAXG, "PAXG");
  console.log("  Estimated Out:", ethers.formatEther(estimatedFSFOX), "FSFOX");
  console.log("  Amount Out Min:", ethers.formatEther(amountOutMinimum), "FSFOX (with 5% slippage)");
  console.log("");
  
  // Prepare swap params
  const swapRouter = await ethers.getContractAt(
    [
      "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 deadline,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96)) returns (uint256 amountOut)"
    ],
    SWAP_ROUTER,
    wallet
  );
  
  const params = {
    tokenIn: PAXG,
    tokenOut: FSFOX,
    fee: POOL_FEE,
    recipient: wallet.address,
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
    const fsfoxBalanceAfter = await fsfoxContract.balanceOf(wallet.address);
    const fsfoxReceived = fsfoxBalanceAfter - fsfoxBalanceBefore;
    
    console.log("💰 Result:");
    console.log("  FSFOX Received:", ethers.formatEther(fsfoxReceived));
    console.log("  FSFOX New Balance:", ethers.formatEther(fsfoxBalanceAfter));
    console.log("");
    
    console.log("🔗 Polygonscan:");
    console.log("  https://polygonscan.com/tx/" + swapTx.hash);
    console.log("");
    
    console.log("✅ Test successful!");
    console.log("");
    console.log("⚠️  Reminder:");
    console.log("  Trading is active and cannot be disabled!");
    console.log("  Users can buy and sell.");
  } catch (error) {
    console.log("  ❌ Error:", error.message);
    if (error.data) {
      console.log("  Data:", error.data);
    }
    console.log("");
    console.log("💡 Check:");
    console.log("  1. Is Trading active?");
    console.log("  2. Is PAXG balance sufficient?");
    console.log("  3. Is allowance sufficient?");
    console.log("  4. Does Pool have liquidity?");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

