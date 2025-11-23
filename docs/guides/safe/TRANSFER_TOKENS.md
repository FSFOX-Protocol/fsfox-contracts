# Guide to Transferring FSFOX Tokens to Safe

**Date:** 2025-11-01

---

## 📊 Current Status

### Token Holdings:

1. **Pool:** 86,523.48 FSFOX
   - ⚠️ Inside Pool (for Liquidity)
   - ❌ Cannot be transferred directly

2. **Safe:** 3,844.9 FSFOX
   - ✅ Already in Safe

3. **Locked (Unlockable):** 907,706.1 FSFOX
   - ✅ Can be transferred to Safe using `unlockTokens()`

---

## ✅ Option 1: Unlock Locked Tokens (Recommended)

### Use cases:
- Transferring Locked Tokens to Safe
- Distributing to partners
- Using for more Liquidity

### Steps:

#### 1. From Gnosis Safe:

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select your Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
4. **New Transaction** → **Contract interaction**

#### 2. Settings:

- **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
- **Toggle "Custom data":** OFF
- **ABI:**
  ```json
  [{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unlockTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  ```
- **Function:** `unlockTokens`
- **Amount:** Desired amount (with 18 decimals)

#### 3. Example:

**To Unlock 100,000 FSFOX:**
- Amount: `100000000000000000000000` (100,000 * 10^18)

**To Unlock All (907,706.1 FSFOX):**
- Amount: `907706100000000000000000` (907,706.1 * 10^18)

#### 4. Submit → Sign → Execute

---

## ❌ Option 2: Removing Pool Tokens (⚠️ Warning)

### ⚠️ Important Warning:

**This will destroy the Pool!**

- Pool will no longer have Liquidity.
- Users won't be able to Swap.
- You'll have to recreate the Pool.

### If you really want to do this:

#### 1. Remove Liquidity from Uniswap:

1. Go to https://app.uniswap.org/pools
2. Find your Position.
3. Select **Remove Liquidity**.
4. Choose amount.
5. Confirm → Execute

#### 2. Or via Script:

We can create a Script to Remove Liquidity.

---

## 📋 Comparison

| Method | Tokens | Result | Recommendation |
|---|---|---|---|
| **Unlock Locked** | 907,706.1 FSFOX | ✅ Transferred to Safe | ✅ **Recommended** |
| **Remove Liquidity** | 86,523.48 FSFOX | ⚠️ Pool destroyed | ❌ Only if necessary |

---

## 💡 Recommendation

### To transfer tokens to Safe:

✅ **Use `unlockTokens()`:**
- 907,706.1 FSFOX available to Unlock.
- Pool remains healthy.
- Can be done multiple times.

### To remove Pool tokens:

⚠️ **Only if necessary:**
- Pool is destroyed.
- Must add Liquidity again.
- Users cannot Swap.

---

## 🔧 Using Scripts

### Check Status:

```bash
npx hardhat run scripts/checkTokenStatus.js --network polygon
```

### Auto Unlock (Requires PRIVATE_KEY):

You can use `scripts/distributeToPartners.js` as a template.

---

## 📝 Important Notes

1. **Pool Tokens:**
   - Used for Liquidity.
   - Cannot be transferred directly.
   - Must Remove Liquidity to withdraw.

2. **Locked Tokens:**
   - Locked in contract.
   - Transferred to Safe via `unlockTokens()`.
   - Unlock any amount you want.

3. **Total Supply:**
   - 1,000,000 FSFOX (Fixed)
   - 950,000 Locked (Initial)
   - 50,000 Free (Initial)

---

## 🔗 Related Links

- **Partner Distribution Guide:** `docs/PARTNER_DISTRIBUTION_GUIDE.md`
- **Approve Issue Guide:** `docs/APPROVE_ISSUE_GUIDE.md`
- **Unlock ABI:** `ABI_FOR_UNLOCK.json`

---

**Summary: To transfer tokens to Safe, use `unlockTokens()` (907,706.1 FSFOX available).**

