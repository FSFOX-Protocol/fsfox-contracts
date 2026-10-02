# Guide to Buying FSFOX with PAXG

**Date:** 2025-11-01

---

## ⚠️ Problem: STF Error in Presale Mode

### Cause of Problem:

In Presale mode (`tradingEnabled = false`):
- ✅ **Buying from Pool allowed:** Pool → User (FSFOX)
- ❌ **Selling to Pool NOT allowed:** User → Pool (PAXG)

**In PAXG → FSFOX Swap:**
- User → Pool (PAXG): This is considered a **PAXG Sale** ❌
- Pool → User (FSFOX): This is an **FSFOX Buy** ✅

**Result:** SwapRouter cannot take PAXG from User because it's considered a sale.

---

## ✅ Solutions

### Solution 1: Use QuickSwap UI (Recommended)

QuickSwap might use a different method or bypass Presale limits:

1. Go to https://quickswap.exchange/swap
2. Swap PAXG to FSFOX
3. Connect MetaMask
4. Execute Swap

---

### Solution 2: Enable Full Trading

If you want users to be able to Swap with PAXG too:

**From Gnosis Safe:**
1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
2. **Function:** `enableTrading()`
3. **Submit** → Sign → **Execute**

**After `enableTrading()`:**
- ✅ Users can buy with USDC
- ✅ Users can buy with PAXG
- ✅ Users can sell

---

### Solution 3: Use USDC Pool

If you want to buy FSFOX:

1. **Swap PAXG to USDC** (on QuickSwap or Uniswap)
2. **Buy FSFOX with USDC** (from FSFOX/USDC Pool)

**Script for Buying with USDC:**
```bash
npx hardhat run scripts/operations/buyFSFOX.js --network polygon
```

---

## 📊 Current Status

### FSFOX/PAXG Pool:
- ✅ Created
- ✅ Initialized
- ✅ In Allowlist
- ✅ Has Liquidity (0.011485 PAXG + 43,261.74 FSFOX)

### Problem:
- ❌ In Presale mode, PAXG → FSFOX Swap is not allowed
- ❌ SwapRouter cannot take PAXG from User

---

## 💡 Recommendation

### To Buy FSFOX:

**Option 1 (Recommended):**
1. Convert PAXG to USDC
2. Buy FSFOX with USDC (from FSFOX/USDC Pool)

**Option 2:**
1. Use QuickSwap UI (Might work)
2. Try direct PAXG → FSFOX

**Option 3:**
1. Enable `enableTrading()`
2. Then you can Swap with PAXG too

---

## 🔗 Useful Links

- **QuickSwap:** https://quickswap.exchange/swap
- **PAXG Pool:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **USDC Pool:** https://polygonscan.com/address/0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF

---

## 📝 Important Notes

1. **Presale Mode:** Only buying from Pool is allowed
2. **Swap PAXG → FSFOX:** This is considered a PAXG sale
3. **Solution:** Use USDC or enable `enableTrading()`

---

**For more questions, check `buyFSFOXWithPAXG.js`!**

