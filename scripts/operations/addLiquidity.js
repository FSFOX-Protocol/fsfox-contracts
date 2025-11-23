const { ethers } = require("hardhat");
require("dotenv").config();

// Addresses
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const FEE = 3000; // 0.3%

// ============================================
// Settings: Enter your desired amounts
// ============================================
const AMOUNT_USDC = "40"; // USDC amount (without decimals)
const AMOUNT_FSFOX = ""; // FSFOX amount (without decimals) - if empty, will be calculated automatically
// If you want to only specify USDC and have FSFOX calculated automatically, leave AMOUNT_FSFOX empty

// Full range ticks for 0.3% fee (tickSpacing = 60)
const TICK_LOWER = -887220;
const TICK_UPPER = 887220;

async function main() {
  console.log("🚀 Adding Liquidity to Pool\n");
  
  const [signer] = await ethers.getSigners();
  const provider = ethers.provider;
  
  console.log("📝 Information:");
  console.log("  Signer:", signer.address);
  console.log("  Safe (Owner):", SAFE);
  console.log("  Pool:", POOL);
  console.log("");
  
  // Check that signer is the owner
  const fsfox = new ethers.Contract(FSFOX, [
    "function owner() view returns (address)",
    "function balanceOf(address) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ], provider);
  
  const usdc = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)"
  ], provider);
  
  const owner = await fsfox.owner();
  console.log("👤 Contract Owner:", owner);
  console.log("");
  
  // Determine token0 and token1 (lexical order)
  const token0 = FSFOX.toLowerCase() < USDC.toLowerCase() ? FSFOX : USDC;
  const token1 = FSFOX.toLowerCase() < USDC.toLowerCase() ? USDC : FSFOX;
  
  console.log("📊 Token Order (lexical order):");
  console.log("  token0:", token0 === FSFOX ? "FSFOX" : "USDC", `(${token0})`);
  console.log("  token1:", token1 === FSFOX ? "FSFOX" : "USDC", `(${token1})`);
  console.log("");
  
  // Convert decimals
  const usdcDecimals = await usdc.decimals();
  const fsfoxDecimals = 18;
  
  // Calculate current Pool ratio
  const pool = new ethers.Contract(POOL, [
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ], provider);
  
  const poolUSDCBalance = await usdc.balanceOf(POOL);
  const poolFSFOXBalance = await fsfox.balanceOf(POOL);
  
  const poolUSDC = parseFloat(ethers.formatUnits(poolUSDCBalance, usdcDecimals));
  const poolFSFOX = parseFloat(ethers.formatEther(poolFSFOXBalance));
  const currentRatio = poolFSFOX / poolUSDC; // FSFOX per 1 USDC
  
  console.log("📊 Current Pool Ratio:");
  console.log("  USDC:", poolUSDC.toFixed(2));
  console.log("  FSFOX:", poolFSFOX.toFixed(2));
  console.log("  Ratio:", currentRatio.toFixed(6), "FSFOX per 1 USDC");
  console.log("");
  
  // Check if we should auto-calculate FSFOX
  let finalAmountUSDC = AMOUNT_USDC;
  let finalAmountFSFOX = AMOUNT_FSFOX;
  let autoCalculated = false;
  
  if (!AMOUNT_FSFOX || AMOUNT_FSFOX.trim() === "" || parseFloat(AMOUNT_FSFOX) === 0) {
    // Auto-calculate FSFOX based on USDC
    const desiredUSDC = parseFloat(AMOUNT_USDC);
    const calculatedFSFOX = desiredUSDC * currentRatio;
    finalAmountFSFOX = Math.floor(calculatedFSFOX).toString(); // Round down
    autoCalculated = true;
    
    console.log("🔢 Auto-calculating FSFOX:");
    console.log("  USDC:", AMOUNT_USDC);
    console.log("  Calculated FSFOX:", finalAmountFSFOX, "(" + calculatedFSFOX.toFixed(6) + ")");
    console.log("  Based on ratio:", currentRatio.toFixed(6), "FSFOX per 1 USDC");
    console.log("");
  }
  
  // Convert amounts to wei
  const desiredUSDC = parseFloat(finalAmountUSDC);
  const desiredFSFOX = parseFloat(finalAmountFSFOX);
  const amountUSDC = ethers.parseUnits(finalAmountUSDC, usdcDecimals);
  const amountFSFOX = ethers.parseUnits(finalAmountFSFOX, fsfoxDecimals);
  
  // Check ratio
  const desiredRatio = desiredFSFOX / desiredUSDC;
  const ratioDifference = Math.abs((desiredRatio - currentRatio) / currentRatio) * 100;
  
  console.log("💰 Final Amounts:");
  console.log("  USDC:", finalAmountUSDC, "(" + ethers.formatUnits(amountUSDC, usdcDecimals) + ")");
  console.log("  FSFOX:", finalAmountFSFOX, (autoCalculated ? "(calculated)" : ""), "(" + ethers.formatEther(amountFSFOX) + ")");
  console.log("  Ratio:", desiredRatio.toFixed(6), "FSFOX per 1 USDC");
  console.log("");
  
  if (ratioDifference > 1 && !autoCalculated) { // If difference is more than 1% and not auto-calculated
    console.log("⚠️  Warning: Desired ratio differs from current Pool ratio!");
    console.log("  Difference:", ratioDifference.toFixed(2), "%");
    console.log("  Current ratio:", currentRatio.toFixed(6), "FSFOX per 1 USDC");
    console.log("  Desired ratio:", desiredRatio.toFixed(6), "FSFOX per 1 USDC");
    console.log("");
    console.log("💡 Recommendation:");
    console.log("  To maintain ratio, add:", (desiredUSDC * currentRatio).toFixed(2), "FSFOX");
    console.log("  Or add:", (desiredFSFOX / currentRatio).toFixed(2), "USDC");
    console.log("");
    console.log("⚠️  If ratio is wrong:");
    console.log("  - One token may be fully consumed");
    console.log("  - Pool price will change");
    console.log("");
    console.log("❓ Do you want to continue? (Script stopped)");
    console.log("   To continue, correct the amounts");
    return;
  } else {
    if (autoCalculated) {
      console.log("✅ FSFOX auto-calculated (difference:", ratioDifference.toFixed(2), "%)");
    } else {
      console.log("✅ Ratio is correct (difference < 1%)");
    }
    console.log("");
  }
  
  // Determine amount0 and amount1 based on order
  const amount0 = token0 === USDC ? amountUSDC : amountFSFOX;
  const amount1 = token1 === USDC ? amountUSDC : amountFSFOX;
  
  // Check balance
  const safeUSDCBalance = await usdc.balanceOf(SAFE);
  const safeFSFOXBalance = await fsfox.balanceOf(SAFE);
  
  console.log("💵 Safe Balance:");
  console.log("  USDC:", ethers.formatUnits(safeUSDCBalance, usdcDecimals));
  console.log("  FSFOX:", ethers.formatEther(safeFSFOXBalance));
  console.log("");
  
  // Check sufficient balance
  if (safeUSDCBalance < amountUSDC) {
    console.log("❌ Error: Insufficient USDC!");
    console.log("  Required:", ethers.formatUnits(amountUSDC, usdcDecimals), "USDC");
    console.log("  Available:", ethers.formatUnits(safeUSDCBalance, usdcDecimals), "USDC");
    console.log("");
    console.log("💡 Solution: Transfer more USDC to Safe");
    return;
  }
  
  if (safeFSFOXBalance < amountFSFOX) {
    console.log("⚠️  Warning: Insufficient FSFOX!");
    console.log("  Required:", ethers.formatEther(amountFSFOX), "FSFOX");
    console.log("  Available:", ethers.formatEther(safeFSFOXBalance), "FSFOX");
    console.log("");
    console.log("💡 Solution: Use unlockTokens()");
    
    // If signer is not owner, just warn
    if (signer.address.toLowerCase() !== owner.toLowerCase()) {
      console.log("⚠️  Note: Signer is not the Owner!");
      console.log("   To execute unlockTokens, you need to use Safe");
      return;
    }
    
    // If owner, suggest unlock
    const unlockNeeded = amountFSFOX - safeFSFOXBalance;
    console.log("🔓 Amount needed to unlock:", ethers.formatEther(unlockNeeded), "FSFOX");
    console.log("   You can execute unlockTokens");
    return;
  }
  
  // Check Allowance
  const usdcAllowance = await usdc.allowance(SAFE, NPM);
  const fsfoxAllowance = await fsfox.allowance(SAFE, NPM);
  
  console.log("✅ Current Allowance (for NPM):");
  console.log("  USDC Allowance:", ethers.formatUnits(usdcAllowance, usdcDecimals));
  console.log("  FSFOX Allowance:", ethers.formatEther(fsfoxAllowance));
  console.log("");
  
  // If signer is not owner, just provide information
  // Check if Signer is the Owner or one of Safe's Signers
  const isOwner = signer.address.toLowerCase() === owner.toLowerCase();
  const isSafeOwner = owner.toLowerCase() === SAFE.toLowerCase();
  
  if (!isOwner && isSafeOwner) {
    console.log("ℹ️  Note: Owner = Safe");
    console.log("   Your wallet is one of Safe's Signers");
    console.log("   You can use this wallet for Approve");
    console.log("   but Mint must be done from Safe");
    console.log("");
    console.log("💡 Recommendation:");
    console.log("   Use generateLiquidityCalldata.js for Calldata");
    console.log("   Then use Calldata in Safe");
    console.log("");
    console.log("❓ Do you want to only Approve and do Mint from Safe?");
    console.log("   Or stop the Script? (Script stopped)");
    console.log("");
    console.log("📖 Full Guide: docs/guides/liquidity/INCREASE_LIQUIDITY.md");
    return;
  } else if (!isOwner && !isSafeOwner) {
    console.log("⚠️  Note: Signer is not the Owner!");
    console.log("   This Script requires Owner Private Key to execute from Safe");
    console.log("   Or manually execute transactions from Gnosis Safe");
    console.log("");
    console.log("📖 Manual Guide: docs/guides/liquidity/INCREASE_LIQUIDITY.md");
    return;
  }
  
  console.log("✅ You are the Owner - continuing");
  console.log("");
  
  const contractWithSigner = ethers.provider;
  
  // Approve USDC (if needed)
  if (usdcAllowance < amountUSDC) {
    console.log("🔓 Approving USDC...");
    
    try {
      const usdcWithSigner = usdc.connect(signer);
      // Approve with 10% buffer
      const approveAmount = amountUSDC * 110n / 100n;
      const approveTx = await usdcWithSigner.approve(NPM, approveAmount);
      console.log("  📝 Transaction hash:", approveTx.hash);
      console.log("  ⏳ Waiting for confirmation...");
      await approveTx.wait();
      console.log("  ✅ Approve successful!");
      console.log("");
    } catch (error) {
      console.error("  ❌ Error approving USDC:", error.message);
      return;
    }
  } else {
    console.log("✅ USDC Allowance is sufficient");
    console.log("");
  }
  
  // Approve FSFOX (if needed)
  if (fsfoxAllowance < amountFSFOX) {
    console.log("🔓 Approving FSFOX...");
    
    try {
      const fsfoxWithSigner = fsfox.connect(signer);
      // Approve with 10% buffer
      const approveAmount = amountFSFOX * 110n / 100n;
      const approveTx = await fsfoxWithSigner.approve(NPM, approveAmount);
      console.log("  📝 Transaction hash:", approveTx.hash);
      console.log("  ⏳ Waiting for confirmation...");
      await approveTx.wait();
      console.log("  ✅ Approve successful!");
      console.log("");
    } catch (error) {
      console.error("  ❌ Error approving FSFOX:", error.message);
      return;
    }
  } else {
    console.log("✅ FSFOX Allowance is sufficient");
    console.log("");
  }
  
  // Adding Liquidity
  console.log("💧 Adding Liquidity...");
  console.log("");
  
  const npm = new ethers.Contract(NPM, [
    "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
  ], signer);
  
  const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  
  const mintParams = {
    token0: token0,
    token1: token1,
    fee: FEE,
    tickLower: TICK_LOWER,
    tickUpper: TICK_UPPER,
    amount0Desired: amount0,
    amount1Desired: amount1,
    amount0Min: 0, // Minimum amount (0 = no slippage protection)
    amount1Min: 0, // Minimum amount (0 = no slippage protection)
    recipient: SAFE,
    deadline: deadline
  };
  
    console.log("📊 Mint Parameters:");
  console.log("  token0:", token0 === USDC ? "USDC" : "FSFOX");
  console.log("  token1:", token1 === USDC ? "USDC" : "FSFOX");
  console.log("  fee:", FEE, "(0.3%)");
  console.log("  tickLower:", TICK_LOWER);
  console.log("  tickUpper:", TICK_UPPER);
  console.log("  amount0Desired:", token0 === USDC ? ethers.formatUnits(amount0, usdcDecimals) + " USDC" : ethers.formatEther(amount0) + " FSFOX");
  console.log("  amount1Desired:", token1 === USDC ? ethers.formatUnits(amount1, usdcDecimals) + " USDC" : ethers.formatEther(amount1) + " FSFOX");
  console.log("  recipient:", SAFE);
  console.log("  deadline:", new Date(deadline * 1000).toISOString());
  console.log("");
  
  try {
    // Estimate gas
    const gasEstimate = await npm.mint.estimateGas(mintParams);
    console.log("  ⛽ Gas estimate:", gasEstimate.toString());
    console.log("");
    
    // Execute mint
    const mintTx = await npm.mint(mintParams, {
      gasLimit: gasEstimate * 120n / 100n // 20% buffer
    });
    
    console.log("  📝 Transaction hash:", mintTx.hash);
    console.log("  ⏳ Waiting for confirmation...");
    console.log("");
    console.log("  🔗 Polygonscan:", `https://polygonscan.com/tx/${mintTx.hash}`);
    console.log("");
    
    const receipt = await mintTx.wait();
    console.log("  ✅ Transaction confirmed!");
    console.log("  📊 Block:", receipt.blockNumber);
    console.log("  ⛽ Gas used:", receipt.gasUsed.toString());
    console.log("");
    
    // Parse events to get tokenId and liquidity
    const mintInterface = new ethers.Interface([
      "event IncreaseLiquidity(uint256 indexed tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
    ]);
    
    let tokenId = null;
    let liquidityAdded = null;
    
    // Try to parse from events
    for (const log of receipt.logs) {
      try {
        const parsed = mintInterface.parseLog(log);
        if (parsed && parsed.name === "IncreaseLiquidity") {
          tokenId = parsed.args.tokenId.toString();
          liquidityAdded = parsed.args.liquidity.toString();
        }
      } catch (e) {
        // Not the event we're looking for
      }
    }
    
    // Also try to get from the return value (if available)
    // Note: This might not work if the transaction was called through a proxy
    if (tokenId === null) {
      console.log("  ℹ️  To view NFT Position, please check on Polygonscan");
    } else {
      console.log("  🎨 NFT Token ID:", tokenId);
      console.log("  💧 Liquidity Added:", liquidityAdded);
    }
    
    console.log("");
    console.log("═══════════════════════════════════════");
    console.log("✅ Liquidity added successfully!");
    console.log("═══════════════════════════════════════");
    console.log("");
    
    // Check final Pool balance
    const pool = new ethers.Contract(POOL, [
      "function token0() view returns (address)",
      "function token1() view returns (address)",
      "function liquidity() view returns (uint128)"
    ], provider);
    
    const poolToken0 = await pool.token0();
    const poolToken1 = await pool.token1();
    const poolLiquidity = await pool.liquidity();
    
    const poolUSDCBalance = await usdc.balanceOf(POOL);
    const poolFSFOXBalance = await fsfox.balanceOf(POOL);
    
    console.log("📊 Pool Status After Adding:");
    console.log("  USDC:", ethers.formatUnits(poolUSDCBalance, usdcDecimals));
    console.log("  FSFOX:", ethers.formatEther(poolFSFOXBalance));
    console.log("  Liquidity (raw):", poolLiquidity.toString());
    console.log("");
    
    console.log("🎉 Success!");
    console.log("");
    console.log("📝 Notes:");
    console.log("  - You received a new NFT Position");
    console.log("  - You can view NFT in Safe");
    console.log("  - You can collect Fees later");
    console.log("  - You can remove Position");
    
  } catch (error) {
    console.error("❌ Error adding Liquidity:");
    if (error.reason) {
      console.error("  Reason:", error.reason);
    }
    if (error.data) {
      console.error("  Data:", error.data);
    }
    console.error("  Message:", error.message);
    console.log("");
    console.log("💡 Check:");
    console.log("  1. Is balance sufficient?");
    console.log("  2. Is allowance sufficient?");
    console.log("  3. Is Pool active?");
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

