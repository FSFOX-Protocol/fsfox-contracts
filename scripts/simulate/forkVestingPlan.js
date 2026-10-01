const { ethers, network } = require("hardhat");

/**
 * Dry-run of the vesting plan against a FORK of Polygon mainnet (no real transactions).
 *   FORK_URL=<polygon rpc> npx hardhat run scripts/simulate/forkVestingPlan.js
 */
const FSFOX = "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B";
const SAFE = "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130";
const DAY = 24 * 60 * 60;

async function main() {
  if (!process.env.FORK_URL) throw new Error("Set FORK_URL to a Polygon RPC");
  const [deployer] = await ethers.getSigners();
  const token = await ethers.getContractAt(
    ["function owner() view returns (address)", "function lockedTokens() view returns (uint256)",
     "function balanceOf(address) view returns (uint256)", "function unlockTokens(uint256)",
     "function transfer(address,uint256) returns (bool)", "function tradingEnabled() view returns (bool)"], FSFOX);

  await network.provider.send("hardhat_impersonateAccount", [SAFE]);
  await network.provider.send("hardhat_setBalance", [SAFE, "0x56BC75E2D63100000"]);
  const safe = await ethers.getSigner(SAFE);

  const now = (await ethers.provider.getBlock("latest")).timestamp;
  const V = await ethers.getContractFactory("FSFOXVesting");
  const vesting = await V.deploy(SAFE, now + 3600, 1095 * DAY, 180 * DAY);
  const vAddr = await vesting.getAddress();

  const locked = await token.lockedTokens();
  const safeBefore = await token.balanceOf(SAFE);
  console.log("tradingEnabled:", await token.tradingEnabled(), "| locked before:", ethers.formatEther(locked));

  await (await token.connect(safe).unlockTokens(locked)).wait();
  await (await token.connect(safe).transfer(vAddr, locked)).wait();
  console.log("after batch  -> locked:", ethers.formatEther(await token.lockedTokens()),
    "| vesting:", ethers.formatEther(await token.balanceOf(vAddr)),
    "| safe delta:", ethers.formatEther((await token.balanceOf(SAFE)) - safeBefore));

  const rel = async () => ethers.formatEther(await vesting["releasable(address)"](FSFOX));
  await network.provider.send("evm_setNextBlockTimestamp", [now + 3600 + 180 * DAY - 5]);
  await network.provider.send("evm_mine");
  console.log("just before cliff releasable:", await rel());
  await network.provider.send("evm_setNextBlockTimestamp", [now + 3600 + 180 * DAY + 5]);
  await network.provider.send("evm_mine");
  console.log("at cliff releasable        :", await rel());
  await (await vesting["release(address)"](FSFOX)).wait();
  console.log("safe received at cliff     :", ethers.formatEther((await token.balanceOf(SAFE)) - safeBefore));
  await network.provider.send("evm_setNextBlockTimestamp", [now + 3600 + 1095 * DAY + 5]);
  await network.provider.send("evm_mine");
  await (await vesting["release(address)"](FSFOX)).wait();
  console.log("after full vesting: safe delta", ethers.formatEther((await token.balanceOf(SAFE)) - safeBefore),
    "| vesting left:", ethers.formatEther(await token.balanceOf(vAddr)));
}
main().catch((e) => { console.error(e.message || e); process.exitCode = 1; });
