# FSFOX Protocol Whitepaper

**Version:** 1.1  
**Date:** October 2026 (v1.0: December 2025)  
**Network:** Polygon Mainnet  

---

## 1. Executive Summary

FSFOX is a fixed-supply (1,000,000) ERC-20 token deployed on the Polygon Mainnet. Unlike many tokens that rely on a single trading pair, FSFOX provides liquidity through a **Tri-Pool Strategy**, pairing the token with **USDC**, **USDT**, and **PAX Gold (PAXG)** on Uniswap V3, so users can buy it with whichever of these assets they hold.

**FSFOX is not a stablecoin and is not backed by gold or any other asset.** Its price floats freely on the market and is not pegged to the US Dollar or to gold. The PAXG pool lets holders of tokenized gold trade into FSFOX; it does not give FSFOX any gold backing. Ownership of the contract is held by a multi-signature Gnosis Safe.

---

## 2. Introduction

### 2.1 The Ecosystem
Built on the Polygon Network, FSFOX leverages low transaction fees and high speeds to facilitate seamless trading. The project addresses a common issue in the DeFi space: liquidity fragmentation and reliance on volatile assets.

### 2.2 The Solution
FSFOX establishes a robust liquidity foundation by creating equal depth across three major pools. This allows arbitrage opportunities that keep the price stable across different asset classes (Fiat and Commodities).

---

## 3. Tokenomics

The FSFOX supply is fixed at 1,000,000 tokens. The former locked reserve is held in an on-chain vesting wallet with a fixed release schedule.

### 3.1 Key Metrics
- **Token Name:** FSFOX
- **Symbol:** FSFOX
- **Decimals:** 18
- **Network:** Polygon (Matic)
- **Contract Address:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **Total Supply:** 1,000,000 FSFOX

### 3.2 Allocation & Distribution
Snapshot read from Polygon mainnet on 2 October 2026 (figures change with trading; always re-check on-chain, see `docs/official/OFFICIAL_INFO.md`):

| Category | Amount (FSFOX) | Percentage | Status |
|----------|---------------:|-----------:|:-------|
| **Vesting wallet** | 775,506.1 | 77.55% | Locked on a fixed schedule (see 3.3) |
| **Liquidity pools** | ~142,700 | 14.27% | Active on Uniswap V3 (USDC, USDT, PAXG) |
| **Treasury (Safe)** | ~10,200 | 1.02% | Operational reserves |
| **Held by traders / others** | remainder | ~7.16% | Circulating |
| **Total** | **1,000,000** | **100%** | |

### 3.3 Vesting of the Reserve
On 2 October 2026 the entire remaining locked supply (775,506.1 FSFOX) was moved into an on-chain vesting wallet
([`0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40`](https://polygonscan.com/address/0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40#code), source verified).
- Nothing is releasable before the cliff on **30 March 2027**.
- At the cliff the amount accrued linearly since the start (about 127,500 FSFOX) becomes releasable, then release continues linearly until **30 September 2029**.
- Released tokens can only go to the project Safe. The schedule cannot be accelerated.
- `unlockTokens()` in the token contract now has nothing left to release (`lockedTokens() == 0`).

Details: `docs/guides/safe/VESTING_PLAN.md`. What the owner can and cannot do: `docs/official/OWNER_POWERS.md`.

---

## 4. Liquidity Architecture (The Tri-Pool Strategy)

FSFOX maintains three pools of roughly equal size, all Uniswap V3 pools on Polygon (any Uniswap V3-compatible interface or aggregator can route through them).

### 4.1 The Pools
1.  **FSFOX / USDC (PoS Bridge):**
    -   Provides direct access to the most widely used stablecoin on Polygon.
    -   *Venue:* Uniswap V3.
2.  **FSFOX / USDT:**
    -   Ensures accessibility for users holding Tether.
    -   *Venue:* Uniswap V3.
3.  **FSFOX / PAXG (Pax Gold):**
    -   Lets holders of tokenized gold (PAXG) trade into FSFOX. This does not back FSFOX with gold.
    -   *Venue:* Uniswap V3.

### 4.2 Strategic Advantage
Balancing liquidity across three pools allows for:
-   **Access:** users can buy FSFOX with USDC, USDT or PAXG.
-   **Arbitrage:** traders can close price differences between the pools, which keeps the three prices close to each other (it does not fix the FSFOX price).
-   **Resilience:** the token is not solely dependent on a single pair or stablecoin.

**Liquidity is currently small** (on the order of a few hundred US dollars per pool; all positions are full-range). Large trades will move the price significantly. See `docs/official/OFFICIAL_INFO.md` for current figures.

---

## 5. Security & Governance

Security is the cornerstone of the FSFOX Protocol.

### 5.1 Ownership
The owner of the FSFOX contract and of all liquidity positions (NFTs) is a **Gnosis Safe (multi-signature wallet)**. The owner address is immutable in the contract (it can be neither changed nor formally renounced).
-   **Safe Address:** `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`

### 5.2 Trustless Operations
-   **No single private key:** every owner action requires the Safe's signers (2 of 2 at the time of writing; the signer set can change).
-   **Minimal contract:** the token has no mint, burn, blacklist, fee or pause function and is not upgradeable. See `docs/official/OWNER_POWERS.md` for every owner-only function and its current effect.
-   **Liquidity positions are held by the Safe, not time-locked.** They cannot be moved by a single key, but the signers could remove liquidity.
-   **Verified contracts:** the token and the vesting wallet are source-verified on Polygonscan.
-   **No independent audit yet.**

---

## 6. Roadmap

### Phase 1: Foundation (Completed) ✅
-   Smart Contract Deployment & Verification.
-   Creation of FSFOX/USDC Pool.
-   Initial Liquidity Provision.

### Phase 2: Expansion (Completed) ✅
-   Creation of FSFOX/PAXG Pool.
-   Creation of FSFOX/USDT Pool.
-   Balancing Liquidity across all three pools.
-   Locked reserve moved into an on-chain vesting wallet (October 2026).
-   Full Public Trading Enabled.
-   Token List Integration (Github).

### Phase 3: Growth (Current Focus) 🚀
-   Listing on CoinGecko & CoinMarketCap.
-   Listing on Centralized Exchanges (CEX).
-   Community Building and Marketing.
-   Strategic Partnerships.

---

## 7. Disclaimer

*This Whitepaper is for informational purposes only and does not constitute financial advice. FSFOX is not a stablecoin, is not backed by any asset, and its price can fall to zero. Liquidity is thin and the contracts have not been independently audited. Cryptocurrency investments carry inherent risks. Users should conduct their own research (DYOR) before interacting with the protocol.*

