# Guide to Adding Logo and Listing Strategy for FSFOX

> **Status (2026-10-02):** the FSFOX logo is in https://github.com/FSFOX-Protocol/fsfox-token-list (`logo/fsfox-256.png`, 256x256, and `logo/fsfox-512.png`).
> The official token list (v1.1.0) uses it and validates against the Uniswap token-lists schema; it includes FSFOX, USDC (PoS), PAXG and USDT.
> The Trust Wallet / CoinGecko / CoinMarketCap submissions below are still to be done.

This guide is divided into two parts:
1. **How to add a Logo (Icon) to FSFOX token?**
2. **Strategy for introducing the token to DEXs and Exchanges**

---

## 🎨 Part 1: Adding Logo (Token Icon)

Currently, FSFOX token has no logo because it is not registered in repository references. To display the logo on Polygonscan, Uniswap, Metamask, and Trust Wallet, follow these steps.

### 1. Register in Trust Wallet Assets (Most Important) 🌟

Most Decentralized Exchanges (DEXs) and Wallets (like Metamask and Uniswap) read logos from the Trust Wallet repository.

**Cost:** 🆓 **Completely Free**

You only need a GitHub account. Note that Trust Wallet suggests a "TWT Requirement" (holding their token) to speed up the process for listing tokens, but **registering in the GitHub repository (to display logo on DEXs) is free.**

**Steps:**
1. Go to [Trust Wallet Assets](https://github.com/trustwallet/assets) repository on GitHub.
2. Read the Guidelines (PNG format, 256x256 size, small file size).
3. Create a Pull Request (PR) to add FSFOX token to `blockchains/polygon/assets` folder.
   - Filename must be the contract address: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
   - Characters must be **Checksummed** (Mixed Case).
4. After Merge, the logo will gradually appear on Uniswap and Metamask.

### 2. Register on Polygonscan 🟣

To display the logo on Polygonscan:

**Cost:** 🆓 **Completely Free**

The process of Updating Token Info on Polygonscan is free.

1. Go to the contract page on [Polygonscan](https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B).
2. Find the **Social Profiles / Update** tab.
3. The contract owner must login and verify ownership.
4. Fill out the form to add logo and social info (Website, Twitter, etc.).
5. Usually takes 1-2 weeks for approval.

### 3. Register on Coingecko and CoinMarketCap 🦎

Listing on these sites will make your logo appear on many other platforms.

**Cost:** 🆓 **Free (But Strict)**

Listing itself is free, but there are no shortcuts. If someone offers "I will list you for money", it is a **Scam**. These sites only list projects with real volume and community.

**Prerequisites:**
- Active Website
- Whitepaper
- Real Trading Volume (Usually > $100k daily)
- Active Community (Twitter, Telegram)

---

## 💰 Part 3: Costs

Most of these steps are **Free**, but some side services might have costs:

| Service | Cost | Status |
| :--- | :--- | :--- |
| **Trust Wallet Assets (GitHub)** | 🆓 Free | Enough for logo display on DEXs. |
| **Polygonscan Profile** | 🆓 Free | Only needs ownership verification. |
| **CoinGecko / CMC Listing** | 🆓 Free | Beware of scammers; no dollar cost. |
| **Polygon Token List** | 🆓 Free | Official Polygon list. |
| **1inch / Uniswap List** | 🆓 Free | Done via GitHub. |
| **CEX Listing (e.g., MEXC, KuCoin)** | 💰 Costly | CEXs usually charge "Listing Fee" ($5k to $100k). |
| **Market Making** | 💰 Costly | Required to maintain volume on CEXs. |

**Result:** For your current status (DEX Listing), **No cost is required.** Just spend time filling forms/PRs.

---

## 📈 Part 4: Strategy for DEX Introduction

You are currently listed on **Uniswap V3** and **QuickSwap**. Next strategy for more visibility:

### 1. Listing in "Default Token Lists" 📜

Users usually see tokens that are in default lists.
- **Polygon Token List:** Request addition to official Polygon list.
- **Uniswap Default List:** Requires high volume and reputation.
- **1inch & Aggregators:** If you have good liquidity, Aggregators like 1inch will automatically find the path through your token, but for name/logo display, you need to PR in their GitHub lists.

### 2. Increase Liquidity and Volume 💧
- **Liquidity:** Higher liquidity means lower Price Impact, attracting larger traders.
- **Volume:** Arbitrage Bots trade when they see price difference between Uniswap and QuickSwap, increasing Volume.

### 3. Use Aggregators (Best Approach) 🚀

Instead of focusing on just one DEX, focus on Aggregators:
- **1inch:** Largest Aggregator.
- **ParaSwap:** Popular on Polygon network.
- **KyberSwap:** Good tool for analysis.

**How?**
Just have good Liquidity. Aggregators will find you automatically. For logo display, do Step 1 (Trust Wallet Assets).

### 4. Yield Farming (Advanced) 🌾

You can set up incentive programs for users to provide Liquidity (LP Staking). This increases market depth.

---

## ✅ Summary of Action Plan

1. **Logo:** Prepare logo (PNG 256x256) today and PR to Trust Wallet GitHub.
2. **Polygonscan:** Update token profile info on Polygonscan.
3. **Marketing:** Share Uniswap and QuickSwap links on social media.
4. **Coingecko:** Fill Coingecko request form as soon as volume reaches acceptable level.

These actions will transform FSFOX from an "Unknown Token" to a "Verified Token".

---

## 🧭 Part 5: Practical Playbook for TrustWallet + Token Lists

This section is an execution checklist so users can discover FSFOX faster in wallets and swaps.

### A) Trust Wallet Assets (Primary Source for Logo)

**Token Contract (Polygon):** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`  
**Network Folder:** `blockchains/polygon/assets/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B/`

**Required files:**
- `logo.png` (exactly 256x256, PNG, transparent background recommended)
- `info.json` (token metadata)

**Suggested `info.json` template:**

```json
{
  "name": "FSFOX",
  "website": "https://YOUR_WEBSITE",
  "description": "FSFOX token on Polygon",
  "explorer": "https://polygonscan.com/token/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B",
  "type": "ERC20",
  "symbol": "FSFOX",
  "decimals": 18,
  "status": "active",
  "id": "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B",
  "links": [
    {
      "name": "twitter",
      "url": "https://twitter.com/YOUR_HANDLE"
    },
    {
      "name": "telegram",
      "url": "https://t.me/YOUR_GROUP"
    }
  ]
}
```

**Execution steps:**
1. Fork `trustwallet/assets`.
2. Add the folder and files above.
3. Ensure address is checksum format (already valid in this guide).
4. Open PR with clear title: `Add FSFOX token assets on Polygon`.
5. Respond to reviewer comments quickly to avoid stale PR.

### B) Token Lists (Critical for Discoverability)

Adding logo is not enough. You should also submit FSFOX to token lists used by wallets, DEX frontends, and aggregators.

#### 1) Uniswap Token Lists

- Standard format is JSON, each token entry includes:
  - `chainId`: `137`
  - `address`: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
  - `symbol`: `FSFOX`
  - `name`: `FSFOX`
  - `decimals`: `18`
  - `logoURI`: raw link to your `logo.png`

**Token object example:**

```json
{
  "chainId": 137,
  "address": "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B",
  "symbol": "FSFOX",
  "name": "FSFOX",
  "decimals": 18,
  "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B/logo.png"
}
```

#### 2) 1inch / Aggregator Lists

- Submit to their token list repositories/forms.
- Requirements are usually:
  - verified contract,
  - enough on-chain liquidity,
  - functioning logo URI,
  - no suspicious token behavior.

#### 3) Polygon Ecosystem Lists

- Submit FSFOX to Polygon-focused list repos and discovery portals.
- Use the same metadata as Uniswap entry to avoid mismatch across sources.

#### 4) CoinGecko (for broad indexing)

- Cost is free, but review is strict.
- Prepare before submission:
  - official website,
  - socials,
  - active market pair(s),
  - consistent token info across all platforms.

### C) Recommended Submission Order

1. Trust Wallet PR (logo + metadata)  
2. Polygonscan token info update  
3. Uniswap-compatible token list PR  
4. 1inch / aggregator listing request  
5. CoinGecko request when liquidity/volume is stable

### D) Fast Validation Checklist (Before Any PR/Form)

- Contract address is exactly the same everywhere (checksum).
- Symbol/name/decimals are consistent in all forms and JSON files.
- `logo.png` is 256x256 and accessible via direct URL.
- `logoURI` resolves publicly (no private GitHub link).
- Explorer link points to Polygon token page.
- Project website and socials are live.

If these are consistent, wallet discovery and UI logo rendering becomes much faster and with fewer rejections.

