# Guide to Adding Pool PAXG to Allowlist

**Date:** 2025-11-01

---

## ❌ Problem: STF Error

**Error:**
```
execution reverted: "STF"
```

**Cause:**
- The PAXG Pool is not in `allowedPools`.
- In Presale mode, only allowlisted Pools can interact with FSFOX.

---

## ✅ Solution: Adding Pool to Allowlist

### From Gnosis Safe:

#### Step 1: Go to Safe

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select your Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`

#### Step 2: Create Transaction

1. **New Transaction** → **Contract interaction**
2. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
3. **Toggle "Custom data":** OFF
4. **ABI:**
   ```json
   [{"inputs":[{"internalType":"address","name":"pool","type":"address"},{"internalType":"bool","name":"allowed","type":"bool"}],"name":"setPool","outputs":[],"stateMutability":"nonpayable","type":"function"}]
   ```
5. **Function:** `setPool`
6. **Parameters:**
   - **pool:** `0x375c88e92b60e6eafA2369C51065117603B22988` (PAXG Pool)
   - **allowed:** `true`
7. **Submit** → Sign → **Execute**

---

## 🔍 Checking Status

After the transaction, check the status:

```bash
npx hardhat run scripts/checkPAXGPoolAllowed.js --network polygon
```

**Expected Result:**
```
Pool PAXG allowed: true ✅
```

---

## 📋 Required Information

- **FSFOX Contract:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **Pool PAXG:** `0x375c88e92b60e6eafA2369C51065117603B22988`
- **Function:** `setPool`
- **Parameters:** `pool = Pool Address`, `allowed = true`

---

## 💡 Important Notes

### 1. Why is this necessary?

In Presale mode (`tradingEnabled = false`):
- Only allowlisted Pools can transact with FSFOX.
- This prevents unauthorized sales during Presale.

### 2. After Adding Pool:

- ✅ You can add Liquidity.
- ✅ Users can buy FSFOX from the Pool.
- ❌ Users cannot sell FSFOX (until `enableTrading()`).

### 3. NPM:

- NPM is already in `allowedSpenders` ✅.
- No changes needed.

---

## 🔗 Useful Links

- **Safe:** https://app.safe.global
- **Polygonscan:** https://polygonscan.com
- **FSFOX Contract:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B

---

## ✅ Checklist

- [ ] Add Pool PAXG to allowlist (`setPool`)
- [ ] Check status (`checkPAXGPoolAllowed.js`)
- [ ] Add Liquidity

---

**After adding Pool to allowlist, you can proceed to add Liquidity!**

