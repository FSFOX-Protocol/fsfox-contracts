# How to Find FSFOX/PAXG Pool Address

**Date:** 2025-11-01

---

## 🔍 Method 1: Use Script (Easiest)

```bash
npx hardhat run scripts/getPAXGPoolAddress.js --network polygon
```

This script:
- Retrieves the Pool address from the Factory.
- Checks the Pool status.
- Displays useful links.

---

## 🔍 Method 2: From Transaction Receipt

If you created the Pool with Safe:

1. Go to https://polygonscan.com
2. Find the Transaction Hash for the `createPool` transaction.
3. In the **Logs** section, find the `PoolCreated` event.
4. The Pool address is in the `pool` parameter.

**Example:**
```
Event: PoolCreated
pool: 0x375c88e92b60e6eafA2369C51065117603B22988
```

---

## 🔍 Method 3: From Polygonscan (Factory Search)

1. Go to https://polygonscan.com/address/0x1F98431c8aD98523631AE4a59f267346ea31F984
2. Open **Contract** → **Read Contract**.
3. Find the `getPool` function.
4. Enter Parameters:
   - **tokenA:** `0x553d3D295e0f695B9228246232eDF400ed3560B5` (PAXG)
   - **tokenB:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
   - **fee:** `3000`
5. Click **Query**.
6. The Pool address will be displayed.

---

## 🔍 Method 4: From QuickSwap UI

1. Go to https://quickswap.exchange/pools
2. Click **Find other pools**.
3. Select FSFOX and PAXG.
4. If the Pool exists, its address will be displayed.

---

## 📋 Current Pool Address

**Pool Address:** `0x375c88e92b60e6eafA2369C51065117603B22988`

**For use in Scripts:**
```javascript
const POOL_PAXG = "0x375c88e92b60e6eafA2369C51065117603B22988";
```

---

## 🔗 Useful Links

- **Polygonscan:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **QuickSwap:** https://quickswap.exchange/pools/0x375c88e92b60e6eafA2369C51065117603B22988

---

## ✅ Checking Pool Status

After finding the address, you can check the Pool status:

```bash
npx hardhat run scripts/checkPAXGPoolExists.js --network polygon
```

This script:
- Checks if the Pool is initialized.
- Displays Pool information.

---

## 💡 Important Notes

1. **Pool Address is Constant** - It does not change after creation.
2. **Separate Pools for each Fee Tier** - 0.3% and 0.05% are different pools.
3. **Token Order Matters** - The Factory uses lexical order for tokens.

---

**For more questions, check the `getPAXGPoolAddress.js` script!**

