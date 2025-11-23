# Latest FSFOX Project Status

**Updated:** 2025-11-23 (Latest Update)

---

## ✅ Overall Status: Full Trading Enabled

The FSFOX project is successfully deployed on Polygon Mainnet and ready for use.

---

## 📋 FSFOX Contract Info

### Official Address:
```
0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
```

**Important:** Always use this address. Older addresses are invalid.

- **Network:** Polygon Mainnet (Chain ID: 137)
- **Owner:** `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130` (Gnosis Safe)
- **Status:** ✅ Deployed and Verified
- **Polygonscan:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B

---

## 📊 Pool Info

### Pool 1: FSFOX / USDC PoS Bridge

**Pool Address:**
```
0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF
```

- **Pair:** FSFOX / USDC PoS Bridge
- **Fee Tier:** 0.3%
- **Token0:** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` (USDC PoS Bridge)
- **Token1:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
- **Liquidity:** ✅ Active
  - **USDC:** 91.997634
  - **FSFOX:** 86,523.48
- **Polygonscan:** https://polygonscan.com/address/0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF

---

### Pool 2: FSFOX / PAXG (New)

**Pool Address:**
```
0x375c88e92b60e6eafA2369C51065117603B22988
```

- **Pair:** FSFOX / PAXG
- **Fee Tier:** 0.3%
- **Token0:** `0x553d3D295e0f695B9228246232eDF400ed3560B5` (PAXG)
- **Token1:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
- **Status:** ✅ Created, Initialized, Has Liquidity
- **In Allowlist:** ✅ Yes
- **Liquidity:** ✅ Active
  - **PAXG:** 0.01148599308929987
  - **FSFOX:** 43,261.740278999999998598
- **NFT Position:** ✅ In Safe (Token ID: 2751156)
- **Polygonscan:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **QuickSwap:** https://quickswap.exchange/pools/0x375c88e92b60e6eafA2369C51065117603B22988

---

## 🔐 Presale Status

### Current Settings:

- **tradingEnabled:** `true` ✅ (Full Trading Active)
- **USDC Pool allowed:** ✅ Yes
- **PAXG Pool allowed:** ✅ Yes (New)
- **SwapRouter allowed:** ✅ Yes
- **NPM allowed:** ✅ Yes

### Result:

✅ **BUY:** Users can buy FSFOX from Pool  
✅ **SELL:** Users can sell FSFOX (Full Trading Active)

---

## 📦 Token Distribution

- **Safe (Owner):** 10,000.9 FSFOX
- **USDC Pool:** 86,523.48 FSFOX (For trading)
- **PAXG Pool:** 43,261.74 FSFOX (For trading)
- **Contract (Locked):** 857,706.1 FSFOX (Locked - unlockable)
- **Unlocked so far:** 92,293.9 FSFOX

**Total Supply:** 1,000,000 FSFOX

**Note:** Use `unlockTokens()` to release Locked Tokens.

---

## ✅ Completed Transactions

All necessary transactions completed successfully:

1. ✅ **Deploy FSFOX Token** - Deployed
2. ✅ **Verify on Polygonscan** - Verified
3. ✅ **Create Pool** - Uniswap V3 Pool created
4. ✅ **Initialize Pool** - Initialized
5. ✅ **Approve FSFOX** - Approved for NPM
6. ✅ **Approve USDC** - Approved for NPM
7. ✅ **setSpender (NPM)** - Added to allowedSpenders
8. ✅ **setSpender (SwapRouter)** - Added to allowedSpenders
9. ✅ **setPool (USDC)** - Added to allowlist
10. ✅ **Add Liquidity (USDC)** - 50,000 FSFOX + 50 USDC added
11. ✅ **Test Buy** - Bought 1 USDC = 977.5 FSFOX
12. ✅ **Increase Liquidity (USDC)** - Increased to 86,523.48 FSFOX + 91.997634 USDC
13. ✅ **Create PAXG Pool** - QuickSwap V3 Pool created
14. ✅ **Initialize PAXG Pool** - Initialized
15. ✅ **setPool (PAXG)** - Added to allowlist
16. ✅ **Unlock Tokens** - 92,293.9 FSFOX unlocked
17. ✅ **Add Liquidity PAXG Pool** - Added (0.011485 PAXG + 43,261.74 FSFOX)
18. ✅ **Approve NFT Pool PAXG** - Approved for Safe
19. ✅ **Transfer NFT Pool PAXG to Safe** - Transferred to Safe (Token ID: 2751156)

**Test Buy Transaction Hash:**
```
0x813e583e5ad9ef95d29aac4ef799d19563195f1dffc24321ebadbfc00cdb0c6b
```

**Polygonscan:** https://polygonscan.com/tx/0x813e583e5ad9ef95d29aac4ef799d19563195f1dffc24321ebadbfc00cdb0c6b

**PAXG Pool Transactions:**
- **Approve NFT:** `0xb0dc4e44894e3d92e251dee2e42d7f23bd53efa3485af4e2729cc6ccb3cf2525`
- **Transfer NFT:** `0xa17c0c856cfa3311bce968c34cbc7beb62ae4c8f7d1864883d090ff5468cb4c7`

**Polygonscan:**
- Approve: https://polygonscan.com/tx/0xb0dc4e44894e3d92e251dee2e42d7f23bd53efa3485af4e2729cc6ccb3cf2525
- Transfer: https://polygonscan.com/tx/0xa17c0c856cfa3311bce968c34cbc7beb62ae4c8f7d1864883d090ff5468cb4c7
- NFT: https://polygonscan.com/token/0xC36442b4a4522E871399CD717aBDD847Ab11FE88?a=2751156

---

## ⚠️ Uniswap API Status

### 404 Issue on Uniswap UI:

3 days after creation, Pool is not indexed in Uniswap Subgraph.

**Status:**
- ✅ Active on blockchain
- ✅ Has Liquidity
- ❌ Not in Uniswap Subgraph

**Solution:**
- ✅ Use Direct Swap Script: `npx hardhat run scripts/buyFSFOX.js --network polygon`
- 📧 Contact Uniswap Support

**Guide:** See `guides/troubleshooting/UNISWAP_404.md`

---

## 📝 Token List

### Status:
✅ **Token List Updated** (File and Gist)

### Content:
1. **FSFOX:** 
   - Address: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
   - Symbol: FSFOX
   - Decimals: 18

2. **USDC PoS Bridge:** 
   - Address: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
   - Symbol: USDC
   - Decimals: 6
   - **Correct USDC for Pool**

### Files:
- **File:** `token-list.json` (Root)
- **Status:** ✅ Updated

### Gist (GitHub):
- **URL:** https://gist.github.com/smehdikermani/bb6563d5b9246488791c640bc742cb7d
- **Raw URL:** https://gist.githubusercontent.com/smehdikermani/bb6563d5b9246488791c640bc742cb7d/raw/token-list.json
- **Status:** ✅ Updated

### How to use:

**In Uniswap:**
1. Settings (⚙️) → Token Lists
2. "Add List" or "Import List"
3. Paste URL:
   ```
   https://gist.githubusercontent.com/smehdikermani/bb6563d5b9246488791c640bc742cb7d/raw/token-list.json
   ```
4. Import

**Result:**
- ✅ Users see correct FSFOX
- ✅ Users see correct USDC PoS Bridge
- ✅ No confusion
- ✅ Easy Buy

---

## 💰 Buy/Sell

### In CEXs (Binance, Coinbase):
✅ **No Issue!**

User selects "FSFOX/USDC". Exchange handles USDC.

---

### In DEXs (Uniswap):

#### With Token List (Recommended):
✅ **No Issue!**

User sees correct tokens.

#### Without Token List:
⚠️ **Must select correct USDC**

User must select USDC PoS Bridge (`0x2791...4174`), not Native USDC.

---

## 🎯 Next Steps

### 1. ✅ Token List (Done):
- ✅ `token-list.json` updated
- ✅ Gist updated
- ✅ Contains FSFOX + USDC PoS Bridge

### 2. ✅ Add Liquidity to PAXG Pool (Done):
- ✅ Pool Created/Initialized
- ✅ Pool allowed
- ✅ Liquidity Added (PAXG: 0.011485 + FSFOX: 43,261.74)
- ✅ NFT Position in Safe (Token ID: 2751156)

**Guide:** See `guides/liquidity/ADD_PAXG.md`

### 3. ✅ Enable Full Trading (Done):
**From Gnosis Safe:**
- **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **Function:** `enableTrading()`
- **Data:** `0x3fab9a08`

**Status:** ✅ Done. Users can Buy and Sell.

---

### 4. List on CEX:

Request listing on Binance/Coinbase.

In CEXs, users just select "FSFOX/USDC".

---

## 📚 Documentation

All docs organized in `docs/`:

- 📋 `docs/README.md` - Index
- 🎯 `docs/official/OFFICIAL_INFO.md` - Official Info
- 👥 `docs/USER_GUIDE.md` - User Guide
- 📝 `docs/guides/general/TOKEN_LIST_GUIDE.md` - Token List Guide
- 🔐 `docs/guides/safe/GNOSIS_SAFE_TRANSACTIONS.md` - Safe Guide

---

## 🔗 Important Links

- **FSFOX Contract:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
- **USDC Pool:** https://polygonscan.com/address/0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF
- **PAXG Pool:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **Safe:** https://app.safe.global/polygon:0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130
- **Uniswap:** https://app.uniswap.org
- **QuickSwap:** https://quickswap.exchange
- **Token List Gist:** https://gist.github.com/smehdikermani/bb6563d5b9246488791c640bc742cb7d

---

## ⚠️ Old Addresses (Do Not Use)

**Deprecated:**

- ❌ `0x258d004EFEF49c40e716cA02C44CC58D58429cD0`
- ❌ `0x3dc05CF96E7f15882BdEA4cf81e466188B3Ae380`

**Always use Official Address:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`

---

## 🎉 Achievements

1. ✅ FSFOX Deployed & Verified
2. ✅ FSFOX/USDC Pool Created
3. ✅ USDC Liquidity Added (86,523.48 FSFOX + 91.997634 USDC)
4. ✅ FSFOX/PAXG Pool Created
5. ✅ PAXG Pool Initialized
6. ✅ PAXG Pool allowed
7. ✅ PAXG Liquidity Added (0.011485 PAXG + 43,261.74 FSFOX)
8. ✅ PAXG NFT Position Transferred to Safe (Token ID: 2751156)
9. ✅ Presale logic working
10. ✅ Test Buy successful
11. ✅ Token List Updated
12. ✅ Gist Updated
13. ✅ Documentation Organized
14. ✅ 92,293.9 FSFOX Unlocked
15. ✅ 3 NFT Positions in Safe (2 USDC + 1 PAXG)
16. ✅ Full Trading Enabled (`enableTrading` called)

---

## ✅ Final Result

**FSFOX Project is Fully Live!**

- ✅ Users can Buy & Sell (Trading Enabled)
- ✅ Two Active Pools: FSFOX/USDC & FSFOX/PAXG
- ✅ All NFT Positions in Safe
- ✅ Token List Ready
- ✅ Docs Complete
- ✅ Settings Correct

**NFT Positions in Safe:**
- NFT #2740509: Pool FSFOX/USDC
- NFT #2743939: Pool FSFOX/USDC
- NFT #2751156: Pool FSFOX/PAXG

**Final Status:** Project is fully launched and Presale restrictions are lifted.

---

**For more info, see docs in `docs/` folder.**

