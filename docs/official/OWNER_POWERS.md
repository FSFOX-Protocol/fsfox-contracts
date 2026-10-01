# FSFOX Owner Powers

**Purpose:** a precise, verifiable statement of what the contract owner can and cannot do. Wallet/scanner
tools often flag *"Contract Not Renounced"*. That flag is technically true — `owner()` is not the zero address —
but it says nothing about what the owner can actually do. This document does.

**Snapshot date:** 2026-10-02 (values below were read from Polygon mainnet on that date; re-check before relying on them).

- Token: [`0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`](https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B#code) (source verified)
- Owner: Gnosis Safe [`0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`](https://polygonscan.com/address/0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130) — threshold **2 of 2** signers on 2026-10-02
- Vesting wallet: [`0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40`](https://polygonscan.com/address/0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40#code) (source verified)

## Every owner-only function

The contract has exactly four `onlyOwner` functions (`contracts/FSFOXToken.sol`):

| Function | What it does | Effect on holders today |
|---|---|---|
| `enableTrading()` | Sets `tradingEnabled = true` | **None.** Already `true`. There is no function to set it back to `false`. |
| `setPool(pool, allowed)` | Edits the pool allowlist | **None.** The allowlist is only consulted while `tradingEnabled == false` (see `_transfer`). |
| `setSpender(spender, allowed)` | Edits the protocol-spender allowlist | **None.** Same: only consulted while `tradingEnabled == false`. |
| `unlockTokens(amount)` | Moves tokens from the contract's locked balance to the owner | **None.** `lockedTokens() == 0` since 2026-10-02, so any `amount > 0` reverts with `Amount exceeds locked tokens`. |

## What does not exist in the contract

- **No mint** — total supply is a compile-time constant (`1,000,000 FSFOX`), the function `totalSupply()` is `pure`.
- **No burn** (and transfers to the zero address revert).
- **No blacklist / whitelist of holders**, no per-address limits.
- **No transfer fee / tax**, no max-transaction or max-wallet limit.
- **No pause** function.
- **No proxy / upgrade mechanism** — the deployed code is final.
- **No way to move other people's tokens** — `transferFrom` requires the holder's own allowance.
- `transferOwnership` and `renounceOwnership` **do not exist**: `owner` is `immutable`. The owner can neither be changed nor formally renounced.

## The former locked supply

The 950,000 FSFOX that were originally locked in the contract have been fully released from it. The last
775,506.1 FSFOX were moved on 2026-10-02 into the vesting wallet above
([transaction](https://polygonscan.com/tx/0x39518084f61776758213996d605747a983c4401cc07ec1216ffaf1c24a8a146c)):
nothing is releasable before 2027-03-30, then linear until 2029-09-30, paid only to the Safe. See `docs/guides/safe/VESTING_PLAN.md`.

## What the owner still *is*

- A normal holder: the Safe holds ≈10.2k FSFOX and can trade them like anyone else (this is a market-supply fact, not a contract power).
- The beneficiary of the vesting wallet (future releases only, on its fixed schedule; the Safe can transfer that wallet's ownership but cannot accelerate it).
- The owner of the Uniswap V3 liquidity positions (NFTs) held by the Safe — i.e. the project can remove or change its **own** pool liquidity. This is a property of the liquidity position, not of the token contract, and it is not locked.

## Why the contract is not "renounced"

Formal renouncement would require a different contract. Because `owner` is immutable and no renounce function
exists, the only way to get `owner() == address(0)` would be to deploy and migrate to a new token, which would change the
token address, break all existing pools/listings and force every holder to migrate. Given that the four functions above have
no remaining effect on holders, this was judged not worth the risk. This is a trade-off, not an oversight.

## Verify it yourself

1. Polygonscan → token → **Contract → Read Contract**: `owner`, `tradingEnabled` (true), `lockedTokens` (0).
2. **Write Contract** / the verified source: confirm there are only the four owner functions listed above.
3. Vesting wallet → Read Contract: `owner`, `start`, `cliff`, `duration`, `releasable(token)`, `released(token)`.
4. Gnosis Safe → Settings: current signers and threshold (these can change over time).

## Limits of this statement

- The token contract and the vesting wrapper have **not been independently audited** (the vesting wallet inherits
  OpenZeppelin's audited `VestingWalletCliff`; the wrapper is a 3-line constructor).
- Safe signers and threshold can change; only the *token contract's* behaviour is immutable.
- Liquidity is thin; see `docs/official/OFFICIAL_INFO.md` for the current snapshot.
