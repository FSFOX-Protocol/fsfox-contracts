const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // Bridged USDC (USDC.e)
const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 SwapRouter
const POOL_FEE = 3000; // 0.3%

async function main() {
  console.log("🚀 Buying FSFOX via Direct Swap\n");
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Account:", signer.address);
  console.log("  USDC:", USDC);
  console.log("  FSFOX:", FSFOX);
  console.log("  SwapRouter:", SWAP_ROUTER);
  console.log("");
  
  // Get balances before
  const usdcContract = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ], signer);
  
  const fsfoxContract = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const usdcDecimals = await usdcContract.decimals();
  const fsfoxDecimals = await fsfoxContract.decimals();
  
  const usdcBalanceBefore = await usdcContract.balanceOf(signer.address);
  const fsfoxBalanceBefore = await fsfoxContract.balanceOf(signer.address);
  
  console.log("💰 Balance Before Swap:");
  console.log("  USDC:", ethers.formatUnits(usdcBalanceBefore, usdcDecimals));
  console.log("  FSFOX:", ethers.formatUnits(fsfoxBalanceBefore, fsfoxDecimals));
  console.log("");
  
  // Amount to swap (1 USDC)
  const swapAmountUSDC = ethers.parseUnits("1", usdcDecimals);
  
  console.log("📊 Swap Details:");
  console.log("  USDC Amount:", ethers.formatUnits(swapAmountUSDC, usdcDecimals));
  console.log("");
  
  // Check allowance
  const allowance = await usdcContract.allowance(signer.address, SWAP_ROUTER);
  console.log("✅ Checking Allowance:");
  console.log("  Current allowance:", ethers.formatUnits(allowance, usdcDecimals));
  
  if (allowance < swapAmountUSDC) {
    console.log("  ⚠️  Insufficient allowance. Approving...");
    
    // Approve (with 10% buffer)
    const approveAmount = swapAmountUSDC * 110n / 100n;
    const approveTx = await usdcContract.approve(SWAP_ROUTER, approveAmount);
    console.log("  📝 Transaction hash:", approveTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    await approveTx.wait();
    console.log("  ✅ Approve successful!");
    console.log("");
  } else {
    console.log("  ✅ Allowance is sufficient");
    console.log("");
  }
  
  // Prepare swap parameters
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  
  // Calculate minimum output (with 5% slippage)
  // We'll use a rough estimate: 1 USDC = ~975 FSFOX (based on your UI)
  const expectedFSFOX = ethers.parseUnits("975", fsfoxDecimals);
  const minFSFOX = expectedFSFOX * 95n / 100n; // 5% slippage
  
  console.log("📊 Swap Parameters:");
  console.log("  Token In (USDC):", USDC);
  console.log("  Token Out (FSFOX):", FSFOX);
  console.log("  Fee:", POOL_FEE, "(0.3%)");
  console.log("  Amount In:", ethers.formatUnits(swapAmountUSDC, usdcDecimals), "USDC");
  console.log("  Amount Out Min:", ethers.formatUnits(minFSFOX, fsfoxDecimals), "FSFOX");
  console.log("  Recipient:", signer.address);
  console.log("  Deadline:", new Date(deadline * 1000).toISOString());
  console.log("");
  
  // SwapRouter interface
  const swapRouter = new ethers.Contract(SWAP_ROUTER, [
    "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
  ], signer);
  
  // Prepare swap params
  const swapParams = {
    tokenIn: USDC,
    tokenOut: FSFOX,
    fee: POOL_FEE,
    recipient: signer.address,
    deadline: deadline,
    amountIn: swapAmountUSDC,
    amountOutMinimum: minFSFOX,
    sqrtPriceLimitX96: 0
  };
  
  console.log("🔄 Executing Swap...");
  console.log("");
  
  try {
    // Estimate gas
    const gasEstimate = await swapRouter.exactInputSingle.estimateGas(swapParams);
    console.log("  ⛽ Gas estimate:", gasEstimate.toString());
    
    // Execute swap
    const swapTx = await swapRouter.exactInputSingle(swapParams, {
      gasLimit: gasEstimate * 120n / 100n // 20% buffer
    });
    
    console.log("  📝 Transaction hash:", swapTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    console.log("");
    console.log("  🔗 Polygonscan:", `https://polygonscan.com/tx/${swapTx.hash}`);
    console.log("");
    
    const receipt = await swapTx.wait();
    console.log("  ✅ Transaction confirmed!");
    console.log("  📊 Block:", receipt.blockNumber);
    console.log("  ⛽ Gas used:", receipt.gasUsed.toString());
    console.log("");
    
    // Get balances after
    const usdcBalanceAfter = await usdcContract.balanceOf(signer.address);
    const fsfoxBalanceAfter = await fsfoxContract.balanceOf(signer.address);
    
    const usdcSpent = usdcBalanceBefore - usdcBalanceAfter;
    const fsfoxReceived = fsfoxBalanceAfter - fsfoxBalanceBefore;
    
    console.log("💰 Balance After Swap:");
    console.log("  USDC:", ethers.formatUnits(usdcBalanceAfter, usdcDecimals));
    console.log("  FSFOX:", ethers.formatUnits(fsfoxBalanceAfter, fsfoxDecimals));
    console.log("");
    
    console.log("📊 Swap Result:");
    console.log("  USDC Spent:", ethers.formatUnits(usdcSpent, usdcDecimals));
    console.log("  FSFOX Received:", ethers.formatUnits(fsfoxReceived, fsfoxDecimals));
    console.log("");
    
    if (fsfoxReceived > 0n) {
      console.log("🎉 Purchase successful!");
      console.log("");
      console.log("✅ You received", ethers.formatUnits(fsfoxReceived, fsfoxDecimals), "FSFOX!");
    } else {
      console.log("⚠️  No FSFOX received. Please check Transaction on Polygonscan.");
    }
    
  } catch (error) {
    console.error("❌ Error in Swap:");
    if (error.reason) {
      console.error("  Reason:", error.reason);
    }
    if (error.data) {
      console.error("  Data:", error.data);
    }
    console.error("  Message:", error.message);
    console.log("");
    console.log("💡 Check:");
    console.log("  1. Is USDC balance sufficient?");
    console.log("  2. Is allowance sufficient?");
    console.log("  3. Does Pool have liquidity?");
    console.log("  4. Is slippage sufficient?");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

