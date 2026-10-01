const { ethers, network } = require("hardhat");
require("dotenv").config();

/**
 * Deploys FSFOXVesting (OpenZeppelin VestingWalletCliff wrapper) with the Gnosis Safe as beneficiary.
 *
 * Run with a DEDICATED low-balance gas wallet in PRIVATE_KEY - the deployer gets no privileges:
 * the beneficiary/owner of the vesting wallet is the Safe, set in the constructor.
 *
 *   npx hardhat run scripts/deployment/deployVesting.js --network polygon
 *
 * Schedule (plan agreed 2026-10-02): 6-month cliff, fully vested after 36 months total.
 * Optional: VESTING_START=<unix seconds> to fix the start date (default: deploy time + 1 hour).
 */
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const DAY = 24 * 60 * 60;
const CLIFF = 180 * DAY;
const DURATION = 1095 * DAY;

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) throw new Error("No signer: set PRIVATE_KEY in .env (gas-only wallet)");

  const latest = await ethers.provider.getBlock("latest");
  const start = process.env.VESTING_START ? Number(process.env.VESTING_START) : latest.timestamp + 3600;

  console.log("🚀 Deploying FSFOXVesting on", network.name);
  console.log("  Deployer (gas only):", deployer.address);
  console.log("  Beneficiary/owner  :", SAFE);
  console.log("  Start              :", new Date(start * 1000).toISOString());
  console.log("  Cliff              :", new Date((start + CLIFF) * 1000).toISOString());
  console.log("  Fully vested       :", new Date((start + DURATION) * 1000).toISOString());

  const Factory = await ethers.getContractFactory("FSFOXVesting");
  const vesting = await Factory.deploy(SAFE, start, DURATION, CLIFF);
  await vesting.waitForDeployment();
  const addr = await vesting.getAddress();

  console.log("\n✅ FSFOXVesting deployed:", addr);
  console.log("\nVerify on Polygonscan:");
  console.log(`  npx hardhat verify --network ${network.name} ${addr} ${SAFE} ${start} ${DURATION} ${CLIFF}`);
  console.log("\nNext: VESTING_ADDRESS=" + addr + " npx hardhat run scripts/generate/generateVestingBatch.js --network " + network.name);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
