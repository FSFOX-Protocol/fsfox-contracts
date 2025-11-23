const { ethers } = require("hardhat");
require("dotenv").config();

const POOL = "0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF";
const USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";

async function main() {
  const provider = ethers.provider;
  
  const pool = new ethers.Contract(POOL, [
    "function token0() view returns (address)",
    "function token1() view returns (address)"
  ], provider);
  
  const usdc = new ethers.Contract(USDC, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  const fsfox = new ethers.Contract(FSFOX, [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)"
  ], provider);
  
  try {
    const usdcBalance = await usdc.balanceOf(POOL);
    const fsfoxBalance = await fsfox.balanceOf(POOL);
    const usdcDecimals = await usdc.decimals();
    const fsfoxDecimals = await fsfox.decimals();
    
    console.log("📊 Current Pool Ratio:\n");
    console.log("  USDC in Pool:", ethers.formatUnits(usdcBalance, usdcDecimals));
    console.log("  FSFOX in Pool:", ethers.formatEther(fsfoxBalance));
    
    const usdcFloat = parseFloat(ethers.formatUnits(usdcBalance, usdcDecimals));
    const fsfoxFloat = parseFloat(ethers.formatEther(fsfoxBalance));
    
    const ratio = fsfoxFloat / usdcFloat;
    
    console.log("");
    console.log("📈 Price Ratio:");
    console.log("  FSFOX/USDC:", ratio.toFixed(6), "FSFOX per 1 USDC");
    console.log("  USDC/FSFOX:", (1/ratio).toFixed(6), "USDC per 1 FSFOX");
    console.log("");
    console.log("💡 To Maintain Ratio:");
    console.log("  If you add 10 USDC, must add:", (ratio * 10).toFixed(2), "FSFOX");
    console.log("  If you add 10,000 FSFOX, must add:", (10000 / ratio).toFixed(2), "USDC");
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

