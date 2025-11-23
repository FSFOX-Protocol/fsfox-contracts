const { ethers } = require("hardhat");
require("dotenv").config();

const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const NPM = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

async function main() {
  const provider = ethers.provider;
  
  const pool = new ethers.Contract(POOL, [
    "function liquidity() view returns (uint128)",
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function fee() view returns (uint24)"
  ], provider);
  
  const usdcContract = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function allowance(address owner, address spender) view returns (uint256)"
  ], provider);
  
  const fsfoxContract = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function lockedTokens() view returns (uint256)"
  ], provider);
  
  try {
    const liquidity = await pool.liquidity();
    const token0 = await pool.token0();
    const token1 = await pool.token1();
    const fee = await pool.fee();
    const usdcBalance = await usdcContract.balanceOf(POOL);
    const fsfoxBalance = await fsfoxContract.balanceOf(POOL);
    const safeUSDC = await usdcContract.balanceOf(SAFE);
    const safeFSFOX = await fsfoxContract.balanceOf(SAFE);
    const usdcDecimals = await usdcContract.decimals();
    const fsfoxDecimals = await fsfoxContract.decimals();
    const usdcAllowance = await usdcContract.allowance(SAFE, NPM);
    const fsfoxAllowance = await fsfoxContract.allowance(SAFE, NPM);
    const lockedTokens = await fsfoxContract.lockedTokens();
    
    console.log("📊 Current Pool Status:\n");
    console.log("💰 Pool Balance:");
    console.log("  USDC:", ethers.formatUnits(usdcBalance, usdcDecimals));
    console.log("  FSFOX:", ethers.formatEther(fsfoxBalance));
    console.log("  Liquidity (raw):", liquidity.toString());
    console.log("");
    console.log("💵 Safe Balance:");
    console.log("  USDC:", ethers.formatUnits(safeUSDC, usdcDecimals));
    console.log("  FSFOX:", ethers.formatEther(safeFSFOX));
    console.log("  Locked FSFOX:", ethers.formatEther(lockedTokens), "(can be unlocked)");
    console.log("");
    console.log("✅ Allowance (for NPM):");
    console.log("  USDC Allowance:", ethers.formatUnits(usdcAllowance, usdcDecimals));
    console.log("  FSFOX Allowance:", ethers.formatEther(fsfoxAllowance));
    console.log("");
    console.log("💡 To Increase Liquidity:");
    console.log("  1. USDC and FSFOX must be in Safe");
    console.log("  2. Must Approve for NPM");
    console.log("  3. You can add multiple times");
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

