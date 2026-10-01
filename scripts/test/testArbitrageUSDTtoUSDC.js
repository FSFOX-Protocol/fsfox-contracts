const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC PoS Bridge
const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; // USDT
const SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 SwapRouter
const QUOTER = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"; // Uniswap V3 Quoter
const POOL_USDC = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF"; // FSFOX/USDC Pool
const POOL_USDT = "0x4E06f9f368c27962431c508423263B899f8AF4bD"; // FSFOX/USDT Pool
const POOL_FEE = 3000; // 0.3%

// ============================================
// Settings: FSFOX Amount to Buy/Sell
// ============================================
const TARGET_FSFOX = "200"; // Amount of FSFOX to buy and then sell

// Slippage tolerance (5%)
const SLIPPAGE_TOLERANCE = 5; // 5%

async function main() {
  console.log("🔄 Arbitrage Test: Buy FSFOX with USDT, Sell to USDC\n");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Account:", signer.address);
  console.log("  Target FSFOX:", TARGET_FSFOX);
  console.log("  Pool USDT:", POOL_USDT);
  console.log("  Pool USDC:", POOL_USDC);
  console.log("  SwapRouter:", SWAP_ROUTER);
  console.log("");
  
  // Contracts
  const usdt = new ethers.Contract(USDT, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ], signer);
  
  const usdc = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], signer);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], signer);
  
  // Get decimals
  const usdtDecimals = await usdt.decimals();
  const usdcDecimals = await usdc.decimals();
  const fsfoxDecimals = await fsfox.decimals();
  
  // Get initial balances
  const usdtBalanceBefore = await usdt.balanceOf(signer.address);
  const usdcBalanceBefore = await usdc.balanceOf(signer.address);
  const fsfoxBalanceBefore = await fsfox.balanceOf(signer.address);
  
  console.log("💰 Initial Balances:");
  console.log("  USDT:", ethers.formatUnits(usdtBalanceBefore, usdtDecimals));
  console.log("  USDC:", ethers.formatUnits(usdcBalanceBefore, usdcDecimals));
  console.log("  FSFOX:", ethers.formatUnits(fsfoxBalanceBefore, fsfoxDecimals));
  console.log("");
  
  // ============================================
  // Step 1: Get quote for buying FSFOX with USDT
  // ============================================
  console.log("📊 Step 1: Getting quote for buying FSFOX with USDT...");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const targetFSFOXWei = ethers.parseUnits(TARGET_FSFOX, fsfoxDecimals);
  
  // Calculate USDT needed from pool balance
  let usdtNeeded;
  try {
    // Get pool balances
    const poolUSDT = new ethers.Contract(POOL_USDT, [
      "function token0() view returns (address)",
      "function token1() view returns (address)"
    ], provider);
    
    const token0 = await poolUSDT.token0();
    const token1 = await poolUSDT.token1();
    
    const poolUSDTContract = new ethers.Contract(POOL_USDT, [
      "function balanceOf(address) view returns (uint256)"
    ], provider);
    
    const poolUSDTBalance = await usdt.balanceOf(POOL_USDT);
    const poolFSFOXBalance = await fsfox.balanceOf(POOL_USDT);
    
    console.log("  📊 Pool USDT Balances:");
    console.log("    USDT:", ethers.formatUnits(poolUSDTBalance, usdtDecimals));
    console.log("    FSFOX:", ethers.formatUnits(poolFSFOXBalance, fsfoxDecimals));
    
    if (poolUSDTBalance > 0n && poolFSFOXBalance > 0n) {
      // Calculate ratio: USDT per FSFOX
      // For exactOutput, we need to calculate backwards
      // Using constant product formula: (x + Δx) * (y - Δy) = k
      // For small swaps, we can approximate: Δx ≈ (Δy * x) / y
      // But for exact output, we need: Δx = (Δy * x) / (y - Δy)
      const ratio = (poolUSDTBalance * targetFSFOXWei) / (poolFSFOXBalance - targetFSFOXWei);
      usdtNeeded = ratio;
      console.log("  ✅ Calculated from pool:");
      console.log("    USDT needed:", ethers.formatUnits(usdtNeeded, usdtDecimals));
      console.log("    FSFOX to receive:", TARGET_FSFOX);
    } else {
      throw new Error("Pool is empty");
    }
  } catch (error) {
    console.log("  ⚠️  Could not calculate from pool, using estimate...");
    // Estimate: Based on current pool liquidity ~144.17 USDT / ~55,206.97 FSFOX
    // Price ≈ 144.17 / 55,206.97 ≈ 0.002611 USDT per FSFOX
    // For 200 FSFOX: 200 * 0.002611 ≈ 0.5222 USDT
    usdtNeeded = ethers.parseUnits("0.6", usdtDecimals); // Conservative estimate with buffer
    console.log("    Estimated USDT needed:", ethers.formatUnits(usdtNeeded, usdtDecimals));
  }
  
  // Add slippage buffer (20% to be safe for exactOutput)
  const usdtAmountWithSlippage = usdtNeeded * (100n + 20n) / 100n;
  
  console.log("    USDT with slippage:", ethers.formatUnits(usdtAmountWithSlippage, usdtDecimals));
  console.log("");
  
  // Check USDT balance
  if (usdtBalanceBefore < usdtAmountWithSlippage) {
    console.log("❌ Error: Insufficient USDT balance!");
    console.log("  Required:", ethers.formatUnits(usdtAmountWithSlippage, usdtDecimals));
    console.log("  Available:", ethers.formatUnits(usdtBalanceBefore, usdtDecimals));
    process.exit(1);
  }
  
  // Approve USDT if needed
  const usdtAllowance = await usdt.allowance(signer.address, SWAP_ROUTER);
  if (usdtAllowance < usdtAmountWithSlippage) {
    console.log("🔐 Approving USDT for SwapRouter...");
    const approveTx = await usdt.approve(SWAP_ROUTER, ethers.MaxUint256);
    console.log("  📝 Transaction hash:", approveTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    await approveTx.wait();
    console.log("  ✅ USDT approved!");
    console.log("");
  } else {
    console.log("  ✅ USDT allowance sufficient");
    console.log("");
  }
  
  // ============================================
  // Step 2: Buy FSFOX with USDT
  // ============================================
  console.log("🛒 Step 2: Buying FSFOX with USDT...");
  console.log("═══════════════════════════════════════════════════════════\n");
  
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  const minFSFOX = targetFSFOXWei * (100n - BigInt(SLIPPAGE_TOLERANCE)) / 100n;
  
  const swapRouter = new ethers.Contract(SWAP_ROUTER, [
    "function exactOutputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)"
  ], signer);
  
  const buyParams = {
    tokenIn: USDT,
    tokenOut: FSFOX,
    fee: POOL_FEE,
    recipient: signer.address,
    deadline: deadline,
    amountOut: targetFSFOXWei,
    amountInMaximum: usdtAmountWithSlippage,
    sqrtPriceLimitX96: 0
  };
  
  console.log("📊 Buy Parameters:");
  console.log("  Token In (USDT):", USDT);
  console.log("  Token Out (FSFOX):", FSFOX);
  console.log("  Pool:", POOL_USDT);
  console.log("  Fee:", POOL_FEE, "(0.3%)");
  console.log("  Amount Out (FSFOX):", TARGET_FSFOX);
  console.log("  Amount In Max (USDT):", ethers.formatUnits(usdtAmountWithSlippage, usdtDecimals));
  console.log("  Slippage:", SLIPPAGE_TOLERANCE + "%");
  console.log("");
  
  try {
    console.log("🔄 Executing buy swap...");
    const gasEstimate = await swapRouter.exactOutputSingle.estimateGas(buyParams);
    console.log("  ⛽ Gas estimate:", gasEstimate.toString());
    
    const buyTx = await swapRouter.exactOutputSingle(buyParams, {
      gasLimit: gasEstimate * 120n / 100n // 20% buffer
    });
    
    console.log("  📝 Transaction hash:", buyTx.hash);
    console.log("  🔗 Polygonscan:", `https://polygonscan.com/tx/${buyTx.hash}`);
    console.log("  ⏳ Waiting for confirmation...");
    
    const buyReceipt = await buyTx.wait();
    console.log("  ✅ Buy transaction confirmed!");
    console.log("  📊 Block:", buyReceipt.blockNumber);
    console.log("  ⛽ Gas used:", buyReceipt.gasUsed.toString());
    console.log("");
    
    // Get balances after buy
    const usdtBalanceAfterBuy = await usdt.balanceOf(signer.address);
    const fsfoxBalanceAfterBuy = await fsfox.balanceOf(signer.address);
    
    const usdtSpent = usdtBalanceBefore - usdtBalanceAfterBuy;
    const fsfoxReceived = fsfoxBalanceAfterBuy - fsfoxBalanceBefore;
    
    console.log("💰 Balances After Buy:");
    console.log("  USDT:", ethers.formatUnits(usdtBalanceAfterBuy, usdtDecimals));
    console.log("  FSFOX:", ethers.formatUnits(fsfoxBalanceAfterBuy, fsfoxDecimals));
    console.log("");
    console.log("📊 Buy Result:");
    console.log("  USDT Spent:", ethers.formatUnits(usdtSpent, usdtDecimals));
    console.log("  FSFOX Received:", ethers.formatUnits(fsfoxReceived, fsfoxDecimals));
    console.log("");
    
    if (fsfoxReceived === 0n) {
      console.log("❌ Error: No FSFOX received!");
      process.exit(1);
    }
    
    // ============================================
    // Step 3: Get quote for selling FSFOX to USDC
    // ============================================
    console.log("📊 Step 3: Getting quote for selling FSFOX to USDC...");
    console.log("═══════════════════════════════════════════════════════════\n");
    
    // Use the actual FSFOX received
    const fsfoxToSell = fsfoxReceived;
    
    let usdcExpected;
    try {
      // Get pool balances
      const poolUSDCBalance = await usdc.balanceOf(POOL_USDC);
      const poolFSFOXBalanceUSDC = await fsfox.balanceOf(POOL_USDC);
      
      console.log("  📊 Pool USDC Balances:");
      console.log("    USDC:", ethers.formatUnits(poolUSDCBalance, usdcDecimals));
      console.log("    FSFOX:", ethers.formatUnits(poolFSFOXBalanceUSDC, fsfoxDecimals));
      
      if (poolUSDCBalance > 0n && poolFSFOXBalanceUSDC > 0n) {
        // Calculate expected USDC using constant product formula
        // For exactInput: (x - Δx) * (y + Δy) = k
        // Δy = (Δx * y) / (x - Δx)
        const usdcOut = (fsfoxToSell * poolUSDCBalance) / (poolFSFOXBalanceUSDC + fsfoxToSell);
        usdcExpected = usdcOut;
        console.log("  ✅ Calculated from pool:");
        console.log("    FSFOX to sell:", ethers.formatUnits(fsfoxToSell, fsfoxDecimals));
        console.log("    USDC expected:", ethers.formatUnits(usdcExpected, usdcDecimals));
      } else {
        throw new Error("Pool is empty");
      }
    } catch (error) {
      console.log("  ⚠️  Could not calculate from pool, using estimate...");
      // Estimate: Based on current pool liquidity ~92 USDC / ~86,523 FSFOX
      // Price ≈ 92 / 86,523 ≈ 0.001063 USDC per FSFOX
      // For 200 FSFOX: 200 * 0.001063 ≈ 0.2126 USDC
      usdcExpected = ethers.parseUnits("0.2", usdcDecimals); // Conservative estimate
      console.log("    Estimated USDC:", ethers.formatUnits(usdcExpected, usdcDecimals));
    }
    
    const minUSDC = usdcExpected * (100n - BigInt(SLIPPAGE_TOLERANCE)) / 100n;
    console.log("    USDC minimum (with slippage):", ethers.formatUnits(minUSDC, usdcDecimals));
    console.log("");
    
    // Approve FSFOX if needed
    const fsfoxContract = new ethers.Contract(FSFOX, [
      "function balanceOf(address) view returns (uint256)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)"
    ], signer);
    
    const fsfoxAllowance = await fsfoxContract.allowance(signer.address, SWAP_ROUTER);
    if (fsfoxAllowance < fsfoxToSell) {
      console.log("🔐 Approving FSFOX for SwapRouter...");
      const approveTx = await fsfoxContract.approve(SWAP_ROUTER, ethers.MaxUint256);
      console.log("  📝 Transaction hash:", approveTx.hash);
      console.log("  ⏳ Waiting for confirmation...");
      await approveTx.wait();
      console.log("  ✅ FSFOX approved!");
      console.log("");
    } else {
      console.log("  ✅ FSFOX allowance sufficient");
      console.log("");
    }
    
    // ============================================
    // Step 4: Sell FSFOX to USDC
    // ============================================
    console.log("💰 Step 4: Selling FSFOX to USDC...");
    console.log("═══════════════════════════════════════════════════════════\n");
    
    const sellParams = {
      tokenIn: FSFOX,
      tokenOut: USDC,
      fee: POOL_FEE,
      recipient: signer.address,
      deadline: deadline,
      amountIn: fsfoxToSell,
      amountOutMinimum: minUSDC,
      sqrtPriceLimitX96: 0
    };
    
    console.log("📊 Sell Parameters:");
    console.log("  Token In (FSFOX):", FSFOX);
    console.log("  Token Out (USDC):", USDC);
    console.log("  Pool:", POOL_USDC);
    console.log("  Fee:", POOL_FEE, "(0.3%)");
    console.log("  Amount In (FSFOX):", ethers.formatUnits(fsfoxToSell, fsfoxDecimals));
    console.log("  Amount Out Min (USDC):", ethers.formatUnits(minUSDC, usdcDecimals));
    console.log("  Slippage:", SLIPPAGE_TOLERANCE + "%");
    console.log("");
    
    const swapRouter2 = new ethers.Contract(SWAP_ROUTER, [
      "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)"
    ], signer);
    
    console.log("🔄 Executing sell swap...");
    const gasEstimate2 = await swapRouter2.exactInputSingle.estimateGas(sellParams);
    console.log("  ⛽ Gas estimate:", gasEstimate2.toString());
    
    const sellTx = await swapRouter2.exactInputSingle(sellParams, {
      gasLimit: gasEstimate2 * 120n / 100n // 20% buffer
    });
    
    console.log("  📝 Transaction hash:", sellTx.hash);
    console.log("  🔗 Polygonscan:", `https://polygonscan.com/tx/${sellTx.hash}`);
    console.log("  ⏳ Waiting for confirmation...");
    
    const sellReceipt = await sellTx.wait();
    console.log("  ✅ Sell transaction confirmed!");
    console.log("  📊 Block:", sellReceipt.blockNumber);
    console.log("  ⛽ Gas used:", sellReceipt.gasUsed.toString());
    console.log("");
    
    // Get final balances
    const usdtBalanceFinal = await usdt.balanceOf(signer.address);
    const usdcBalanceFinal = await usdc.balanceOf(signer.address);
    const fsfoxBalanceFinal = await fsfox.balanceOf(signer.address);
    
    console.log("💰 Final Balances:");
    console.log("  USDT:", ethers.formatUnits(usdtBalanceFinal, usdtDecimals));
    console.log("  USDC:", ethers.formatUnits(usdcBalanceFinal, usdcDecimals));
    console.log("  FSFOX:", ethers.formatUnits(fsfoxBalanceFinal, fsfoxDecimals));
    console.log("");
    
    // Calculate results
    const usdtNetChange = usdtBalanceFinal - usdtBalanceBefore;
    const usdcNetChange = usdcBalanceFinal - usdcBalanceBefore;
    const fsfoxNetChange = fsfoxBalanceFinal - fsfoxBalanceBefore;
    
    console.log("📊 Arbitrage Test Results:");
    console.log("═══════════════════════════════════════════════════════════\n");
    console.log("  USDT Change:", ethers.formatUnits(usdtNetChange, usdtDecimals), "(negative = spent)");
    console.log("  USDC Change:", ethers.formatUnits(usdcNetChange, usdcDecimals), "(positive = received)");
    console.log("  FSFOX Change:", ethers.formatUnits(fsfoxNetChange, fsfoxDecimals), "(should be ~0)");
    console.log("");
    
    // Calculate profit/loss
    // Convert USDC to USDT equivalent (assuming 1:1 for simplicity)
    const totalCostUSDT = -Number(ethers.formatUnits(usdtNetChange, usdtDecimals));
    const totalReceivedUSDC = Number(ethers.formatUnits(usdcNetChange, usdcDecimals));
    
    console.log("💵 Profit/Loss Analysis:");
    console.log("  Cost (USDT):", totalCostUSDT.toFixed(6));
    console.log("  Received (USDC):", totalReceivedUSDC.toFixed(6));
    console.log("  Net (USDC - USDT):", (totalReceivedUSDC - totalCostUSDT).toFixed(6));
    console.log("");
    
    if (Math.abs(Number(ethers.formatUnits(fsfoxNetChange, fsfoxDecimals))) > 1) {
      console.log("⚠️  Warning: FSFOX balance changed significantly!");
      console.log("  Expected: ~0 FSFOX");
      console.log("  Actual:", ethers.formatUnits(fsfoxNetChange, fsfoxDecimals));
    } else {
      console.log("✅ Test completed successfully!");
      console.log("  All FSFOX tokens were swapped as expected.");
    }
    
  } catch (error) {
    console.error("❌ Error in buy transaction:");
    if (error.reason) {
      console.error("  Reason:", error.reason);
    }
    if (error.data) {
      console.error("  Data:", error.data);
    }
    console.error("  Message:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

