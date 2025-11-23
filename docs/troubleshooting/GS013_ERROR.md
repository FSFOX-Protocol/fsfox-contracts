# Guide to Fixing GS013 Error in Gnosis Safe

**Date:** 2025-11-01

---

## ❌ Error: GS013

**Error Message:**
```
This transaction will most likely fail. To save gas costs, reject this transaction.
execution reverted: "GS013"
```

---

## 🔍 Cause of Error

The `GS013` error in Gnosis Safe usually means:

1. **Transaction Execution Failure** (Safe cannot execute the transaction)
2. **Calldata Issue** (Incorrect Calldata)
3. **Safe Settings Issue** (Threshold or owners)
4. **Insufficient Funds** (MATIC or tokens)

---

## ✅ Checking Status

### 1. Check MATIC Balance:

```bash
npx hardhat run scripts/checkSafeBalance.js --network polygon
```

**Check Result:**
- ✅ MATIC Balance: 60 MATIC (Sufficient)
- ✅ Threshold: 2 of 2 (Correct)
- ✅ Owners: 2 (Correct)

**Result:** Not a balance or settings issue.

---

## 🔧 Solutions

### Solution 1: Check Calldata

Possible Issue: Incorrect Calldata or Factory cannot create Pool.

**Check:**
1. Does the Pool already exist?
2. Are token addresses correct?
3. Is Fee tier correct?

**Solution:**
```bash
# Check existing Pool
npx hardhat run scripts/generatePAXGPoolCalldata.js --network polygon
```

---

### Solution 2: Use Transaction Builder (Recommended)

Instead of direct Calldata, use **Transaction Builder**:

#### Step 1: Create Pool

1. Go to https://app.safe.global
2. **New Transaction** → **Contract interaction**
3. **To:** `0x1F98431c8aD98523631AE4a59f267346ea31F984` (Factory)
4. **Toggle "Custom data":** OFF
5. **ABI:**
   ```json
   [{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"}],"name":"createPool","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"nonpayable","type":"function"}]
   ```
6. **Function:** `createPool`
7. **Parameters:**
   - **tokenA:** `0x553d3D295e0f695B9228246232eDF400ed3560B5` (PAXG)
   - **tokenB:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
   - **fee:** `3000`
8. **Submit** → Sign → **Execute**

**Note:** If Pool already exists, skip this step.

---

### Solution 3: Check Existing Pool

If Pool already exists, you must Initialize directly:

```bash
# Check Pool
npx hardhat run scripts/generatePAXGPoolCalldata.js --network polygon
```

If Pool exists, just perform Initialize.

---

### Solution 4: Use MetaMask (If possible)

If you can use MetaMask:

1. Set PRIVATE_KEY in `.env`
2. Run Script:
   ```bash
   npx hardhat run scripts/createPAXGPool.js --network polygon
   ```

**Note:** This method only works if you are an Owner.

---

## 🔍 Deeper Check

### Checking Existing Pool:

```javascript
// In Hardhat Console
const factory = await ethers.getContractAt(
  ["function getPool(address,address,uint24) view returns (address)"],
  "0x1F98431c8aD98523631AE4a59f267346ea31F984"
);

const pool = await factory.getPool(
  "0x553d3D295e0f695B9228246232eDF400ed3560B5", // PAXG
  "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B", // FSFOX
  3000 // Fee
);

console.log("Pool:", pool);
```

If Pool exists (`pool !== 0x0000...`), you should only Initialize.

---

## 📋 Checklist

- [ ] MATIC Balance sufficient? (✅ 60 MATIC)
- [ ] Threshold correct? (✅ 2 of 2)
- [ ] Pool already exists? (Check)
- [ ] Calldata correct? (Check)
- [ ] Using Transaction Builder? (Recommended)

---

## 💡 Important Notes

1. **Always use Transaction Builder** (Not direct Calldata)
2. **Check if Pool already exists**
3. **If Pool exists, only Initialize**
4. **If issue persists, try using MetaMask**

---

## 🔗 Useful Links

- **Safe:** https://app.safe.global
- **Polygonscan:** https://polygonscan.com
- **Factory:** https://polygonscan.com/address/0x1F98431c8aD98523631AE4a59f267346ea31F984

---

**If issue persists, please provide more info:**
- Does the Pool already exist?
- What transaction are you trying to execute?
- Are you using Transaction Builder?

