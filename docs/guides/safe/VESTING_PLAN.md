# Locked Supply Release Plan (Vesting)

**Status:** prepared, **not executed on-chain yet.** Until the Safe batch below is signed and executed,
the remaining locked supply is still releasable by the owner at any time via `unlockTokens()`.

## Why

`FSFOXToken` holds the locked supply itself and lets the owner release any amount at any time
(`unlockTokens`, no timelock). The token contract is not upgradeable, so that function cannot be removed.
The only way to make the lock *enforceable* is to move every remaining token into a contract that
releases on a fixed schedule and has no way out ahead of schedule.

## Plan

| Item | Value |
|---|---|
| Amount | the entire remaining `lockedTokens()` (775,506.1 FSFOX at 2026-10-01) |
| Contract | `contracts/FSFOXVesting.sol` — thin wrapper over OpenZeppelin v5 `VestingWalletCliff` |
| Beneficiary / owner | Gnosis Safe `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130` |
| Cliff | 180 days from start — nothing releasable before |
| Duration | 1095 days (36 months) from start, **including** the cliff |
| At the cliff | linear amount accrued since start becomes releasable at once: 180/1095 ≈ 16.4% (≈127.5k FSFOX) |
| After the cliff | linear, per second, until fully vested at month 36 (≈ 21.5k FSFOX / month) |
| Release | `release(token)` — permissionless, always pays the beneficiary (Safe) |

Properties (covered by `test/FSFOXVesting.test.js` and a mainnet-fork dry run):
- tokens can only leave via `release()` and only the vested part;
- no withdraw / rescue / sweep function exists;
- works regardless of `tradingEnabled` (the Safe is always an allowed recipient in `FSFOXToken._transfer`);
- the Safe may transfer ownership of the vesting wallet (changes who receives *future* releases) but cannot accelerate the schedule.

The token contract itself is unchanged and not redeployed.

## Execution runbook

1. **Deploy** the vesting wallet from a dedicated gas-only wallet (deployer gets no privileges):
   ```bash
   npx hardhat run scripts/deployment/deployVesting.js --network polygon
   ```
   Note the printed address and start time. Verify on Polygonscan with the printed command.
2. **Check it on Polygonscan**: `owner()` = Safe, `start()`, `cliff()`, `duration()` match the table.
3. **Generate the Safe batch** (it refuses to build unless the contract on-chain matches the plan):
   ```bash
   VESTING_ADDRESS=0x... npx hardhat run scripts/generate/generateVestingBatch.js --network polygon
   ```
4. In the Safe: **Apps → Transaction Builder → upload `vesting-safe-batch.json`**, confirm both calls
   (`unlockTokens(all)` then `transfer(vesting, all)`), collect signatures and execute as **one batch** so the
   tokens are never loose in the Safe.
5. **Verify after:** `lockedTokens()` = 0, `balanceOf(vesting)` = the amount, then update
   `docs/official/OFFICIAL_INFO.md` and announce the vesting address publicly.

## Dry run (no real transactions)

```bash
FORK_URL=<archive-capable Polygon RPC> npx hardhat run scripts/simulate/forkVestingPlan.js
```
(Some free RPCs are not archive nodes and fail with "historical state not available"; `polygon.drpc.org` worked on 2026-10-02.)

## Caveats

- Unlocked supply already in circulation (≈174.5k, plus ≈10.2k in the Safe) is unaffected.
- This does **not** fix thin liquidity or make the Safe itself trustless (Safe signers are still trusted
  for the ≈10.2k they hold and for any future releases). It removes the ability to dump or move the locked 775k early.
- Not independently audited; the only custom code is the 3-line constructor wrapper around OpenZeppelin.
