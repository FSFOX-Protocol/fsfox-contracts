# Guide to Fixing Approve FSFOX Issue in Safe

**Date:** 2025-11-01

> **Note:** For step-by-step Approve FSFOX guide, see `guides/trading/APPROVE_FSFOX_STEP_BY_STEP.md`.

---

## ❌ Problem: FSFOX Approve Transaction Failed

### Cause:

**Safe has no FSFOX balance!**

- **Safe Balance:** ~0 FSFOX
- **Required for Approve:** 42,293.9 FSFOX

**Result:** Safe cannot Approve because it has no balance.

---

## ✅ Solution: Unlock FSFOX from Locked Tokens

Before Approve, you must release FSFOX from Locked Tokens.

### Step 1: Unlock Tokens

**From Gnosis Safe:**

1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
2. **Function:** `unlockTokens(uint256 amount)`
3. **Amount:** Required amount (with 18 decimals)

**Example:** For 42,293.9 FSFOX:
- Amount: `42293900000000000000000` (42,293.9 * 10^18)

**Or via Transaction Builder:**
1. Toggle "Custom data" OFF
2. ABI:
   ```json
   [{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unlockTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]
   ```
3. Function: `unlockTokens`
4. Amount: `42293900000000000000000`
5. Submit → Sign → Execute

---

### Step 2: Approve FSFOX (After Unlock)

After FSFOX is in Safe:

1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
2. **Function:** `approve(address spender, uint256 amount)`
3. **Spender:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
4. **Amount:** `42293900000000000000000` (42,293.9 FSFOX)

---

## 🔄 Correct Transaction Order:

1. ✅ **Approve USDC** (Done)
2. ⏳ **Unlock Tokens** (To be done)
3. ⏳ **Approve FSFOX** (After Unlock)
4. ⏳ **Mint** (Add Liquidity)

---

## 📝 Important Notes:

### 1. Locked Balance:

- **Locked Tokens:** 950,000 FSFOX
- **Required:** ~42,293.9 FSFOX
- **Result:** Sufficient balance ✅

### 2. Unlock ABI:

```json
[{
  "inputs": [{
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "unlockTokens",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]
```

### 3. Unit Conversion:

- 42,293.9 FSFOX = `42293900000000000000000` wei (18 decimals)

---

## 🔧 Quick Fix:

### From Transaction Builder:

**Unlock Tokens:**
- To: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- Function: `unlockTokens`
- Amount: `42293900000000000000000`

**Then Approve:**
- To: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- Function: `approve`
- Spender: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- Amount: `42293900000000000000000`

---

## ✅ Summary:

**Problem:** Safe has no FSFOX balance  
**Solution:** Run `unlockTokens()` first  
**Then:** Perform Approve FSFOX  

---

**For more help, let me know!**

