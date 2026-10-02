# Guide to Testing Trading with PAXG

**Date:** 2025-11-08

---

## ⚠️ Important Warning

**The FSFOX contract only has `enableTrading()` function and NO function to disable it!**

**This means:**
- ✅ You can activate `enableTrading()`.
- ❌ **You CANNOT deactivate it!**
- ⚠️ Once activated, Trading remains active forever.

---

## 📋 Test Steps

### Step 1: Enable Trading

**From Gnosis Safe:**

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select your Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
4. **New Transaction** → **Contract interaction**

**Settings:**
- **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
- **Toggle "Custom data":** OFF
- **ABI:**
  ```json
  [{"inputs":[],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  ```
- **Function:** `enableTrading`

5. **Submit** → Sign → **Execute**

**⚠️ Warning:** After this, Trading is active forever!

---

### Step 2: Test Buying with PAXG

#### Method 1: Use Script

```bash
npx hardhat run scripts/test/testTradingWithPAXG.js --network polygon
```

This Script:
- Checks if Trading is enabled.
- Buys FSFOX with PAXG.
- Displays result.

#### Method 2: Use QuickSwap UI

1. Go to https://quickswap.exchange/swap
2. Select PAXG → FSFOX.
3. Connect MetaMask.
4. Swap.

---

### Step 3: Check Result

After testing:
- ✅ If Swap successful: Trading works.
- ❌ If error: Check the issue.

**⚠️ Reminder:** Trading is active and cannot be disabled!

---

## 🔍 Checking Trading Status

To check Trading status:

```bash
npx hardhat run scripts/check/checkPresaleState.js --network polygon
```

**Expected Result after enableTrading():**
```
tradingEnabled: true ✅
```

---

## ⚠️ Important Notes

### 1. Trading is Irreversible

After `enableTrading()`:
- ✅ Users can buy.
- ✅ Users can sell.
- ❌ Trading cannot be disabled.

### 2. If you just want to test

**Option 1:** Use Testnet
- Deploy contract on Testnet.
- Test.
- Deploy on Mainnet.

**Option 2:** Accept that Trading stays active
- If you want users to buy with PAXG.
- You must enable Trading.
- And keep it active.

---

## 📊 Result

### After enableTrading():

- ✅ Users can buy with USDC.
- ✅ Users can buy with PAXG.
- ✅ Users can sell FSFOX.
- ❌ Trading cannot be disabled.

---

## 💡 Recommendation

### If you just want to test:

**Option 1:** Use Testnet
- Deploy contract on Testnet.
- Test.
- Deploy on Mainnet.

**Option 2:** Accept that Trading stays active
- If you want users to buy with PAXG.
- You must enable Trading.
- And keep it active.

---

## 🔗 Useful Links

- **FSFOX Contract:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
- **Safe:** https://app.safe.global/polygon:0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130
- **QuickSwap:** https://quickswap.exchange/swap

---

**⚠️ Final Warning: Trading is Irreversible!**

