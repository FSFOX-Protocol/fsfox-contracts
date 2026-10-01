const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();

/**
 * Builds a Safe "Transaction Builder" batch (import JSON) that, atomically:
 *   1. FSFOX.unlockTokens(lockedTokens)         - release the whole remaining locked supply to the Safe
 *   2. FSFOX.transfer(vesting, lockedTokens)    - move it straight into the vesting wallet
 * so the tokens are never loose in the Safe after the batch executes.
 *
 *   VESTING_ADDRESS=0x... npx hardhat run scripts/generate/generateVestingBatch.js --network polygon
 *
 * It refuses to build the batch unless the vesting contract on-chain matches the plan
 * (beneficiary = Safe, 180d cliff, 1095d duration, start not in the past by more than a day).
 * Output: vesting-safe-batch.json (git-ignored). Import it in Safe -> Transaction Builder.
 */
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const DAY = 24 * 60 * 60;

async function main() {
  const vestingAddr = process.env.VESTING_ADDRESS;
  if (!vestingAddr || !ethers.isAddress(vestingAddr)) throw new Error("Set VESTING_ADDRESS=0x...");

  const provider = ethers.provider;
  const net = await provider.getNetwork();
  if (net.chainId !== 137n) throw new Error(`Expected Polygon (137), got ${net.chainId}. Use --network polygon`);

  const vesting = new ethers.Contract(vestingAddr, [
    "function owner() view returns (address)",
    "function start() view returns (uint256)",
    "function cliff() view returns (uint256)",
    "function duration() view returns (uint256)",
  ], provider);
  const token = new ethers.Contract(FSFOX, [
    "function owner() view returns (address)",
    "function lockedTokens() view returns (uint256)",
  ], provider);

  if ((await provider.getCode(vestingAddr)) === "0x") throw new Error("No contract at VESTING_ADDRESS");
  const [vOwner, start, cliff, duration, tOwner, locked, block] = await Promise.all([
    vesting.owner(), vesting.start(), vesting.cliff(), vesting.duration(),
    token.owner(), token.lockedTokens(), provider.getBlock("latest"),
  ]);

  const problems = [];
  if (vOwner.toLowerCase() !== SAFE.toLowerCase()) problems.push(`vesting owner/beneficiary is ${vOwner}, expected the Safe`);
  if (tOwner.toLowerCase() !== SAFE.toLowerCase()) problems.push(`token owner is ${tOwner}, expected the Safe`);
  if (cliff - start !== BigInt(180 * DAY)) problems.push("cliff is not 180 days");
  if (duration !== BigInt(1095 * DAY)) problems.push("duration is not 1095 days");
  if (start < BigInt(block.timestamp - DAY)) problems.push("start is more than a day in the past");
  if (locked === 0n) problems.push("nothing left to unlock");
  if (problems.length) throw new Error("Refusing to build batch:\n - " + problems.join("\n - "));

  const iface = new ethers.Interface([
    "function unlockTokens(uint256 amount)",
    "function transfer(address to, uint256 amount) returns (bool)",
  ]);
  const batch = {
    version: "1.0",
    chainId: "137",
    createdAt: Date.now(),
    meta: {
      name: "FSFOX locked supply -> vesting wallet",
      description: `Unlock ${ethers.formatEther(locked)} FSFOX and move it into the vesting wallet ${vestingAddr} (6m cliff, 36m linear).`,
    },
    transactions: [
      { to: FSFOX, value: "0", data: iface.encodeFunctionData("unlockTokens", [locked]) },
      { to: FSFOX, value: "0", data: iface.encodeFunctionData("transfer", [vestingAddr, locked]) },
    ],
  };

  fs.writeFileSync("vesting-safe-batch.json", JSON.stringify(batch, null, 2));
  console.log("✅ Wrote vesting-safe-batch.json");
  console.log("  Amount            :", ethers.formatEther(locked), "FSFOX");
  console.log("  Vesting wallet    :", vestingAddr);
  console.log("  Start / cliff / end:", new Date(Number(start) * 1000).toISOString(), "/",
    new Date(Number(cliff) * 1000).toISOString(), "/", new Date(Number(start + duration) * 1000).toISOString());
  console.log("\nIn Safe: Apps -> Transaction Builder -> upload JSON -> check both calls -> sign & execute as ONE batch.");
  console.log("NOTE: lockedTokens is read now; if anyone changes it before execution the amount here is stale (re-generate).");
}

main().catch((e) => { console.error(e.message || e); process.exitCode = 1; });
