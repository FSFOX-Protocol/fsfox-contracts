# Guide to Creating FSFOX/PAXG Pool with Gnosis Safe

**Date:** 2025-11-01

---

## ⚠️ Problem: Pending Transaction

If you ran the Script and the transaction is stuck in "Pending":

1. **Script uses PRIVATE_KEY** (for MetaMask).
2. **You are using Safe** (doesn't need PRIVATE_KEY).
3. **Safe cannot send transaction directly from Script.**

---

## ✅ Solution: Using Safe Transaction Builder

To create a Pool with Safe, you must use the **Transaction Builder**.

---

## 📋 Complete Steps

### Step 1: Generate Calldata

```bash
npx hardhat run scripts/generatePAXGPoolCalldata.js --network polygon
```

This Script:
- Generates Calldata for `createPool`.
- Shows usage instructions for Safe.

---

### Step 2: Create Pool in Safe

#### 2.1. Go to Safe

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select your Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`

#### 2.2. Create Transaction

1. **New Transaction** → **Contract interaction**
2. **To:** `0x1F98431c8aD98523631AE4a59f267346ea31F984` (QuickSwap V3 Factory)
3. **Toggle "Custom data":** OFF
4. **ABI:**
   ```json
   [{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"}],"name":"createPool","outputs":[{"internalType":"address","name":"pool","type":"address"}],"stateMutability":"nonpayable","type":"function"}]
   ```
5. **Function:** `createPool`
6. **Parameters:**
   - **tokenA:** `0x553d3D295e0f695B9228246232eDF400ed3560B5` (PAXG)
   - **tokenB:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
   - **fee:** `3000` (0.3%)

#### 2.3. Submit and Execute

1. **Submit** → Sign → **Execute**
2. After Execution, check **Transaction Receipt**.
3. Get **Pool Address** from Receipt (or Logs).

---

### Step 3: Initialize Pool

After creating Pool, you must Initialize it.

#### 3.1. Get Pool Address

**Method 1: From Transaction Receipt**
- Go to Polygonscan.
- Find Transaction.
- Find Pool address in Logs.

**Method 2: From Script**
```bash
# Enter Pool Address in Script
# Then run again
npx hardhat run scripts/generatePAXGPoolCalldata.js --network polygon
```

#### 3.2. Initialize in Safe

1. **New Transaction** → **Contract interaction**
2. **To:** [Pool Address] (from previous step)
3. **Toggle "Custom data":** OFF
4. **ABI:**
   ```json
   [{"inputs":[{"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]
   ```
5. **Function:** `initialize`
6. **Parameters:**
   - **sqrtPriceX96:** `153669699123539714401991025091221` (Get from Script)

**Note:** Get `sqrtPriceX96` from `generatePAXGPoolCalldata.js` output.

#### 3.3. Submit and Execute

1. **Submit** → Sign → **Execute**

---

### Step 4: Add Liquidity

After Initialize, you can add Liquidity.

**From Script:**
```bash
# Enter Pool Address in addPAXGLiquidity.js
# Then run (but this also uses PRIVATE_KEY)
```

**Or from QuickSwap UI:**
1. Go to https://quickswap.exchange/pools
2. Select **New Position**.
3. Select FSFOX and PAXG.
4. Enter amounts:
   - **PAXG:** 0.011500
   - **FSFOX:** 43,261.74
5. Click **Add Liquidity**.

---

## 🔧 Using Direct Calldata

If you want to use Calldata directly:

### For createPool:

1. **New Transaction** → **Contract interaction**
2. **To:** `0x1F98431c8aD98523631AE4a59f267346ea31F984`
3. **Toggle "Custom data":** ON
4. **Data:**
   ```
   0xa1671295000000000000000000000000553d3d295e0f695b9228246232edf400ed3560b5000000000000000000000000e5c72a59981d3c19a74dc6144e13f6b244ee5e2b0000000000000000000000000000000000000000000000000000000000000bb8
   ```
5. **Submit** → Sign → **Execute**

---

## 📊 Required Information

### Addresses:
- **Factory:** `0x1F98431c8aD98523631AE4a59f267346ea31F984`
- **PAXG:** `0x553d3D295e0f695B9228246232eDF400ed3560B5`
- **FSFOX:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **Fee:** `3000` (0.3%)

### Liquidity Amounts:
- **PAXG:** 0.011500
- **FSFOX:** 43,261.74
- **Total Value:** $91.997634

---

## ⏱️ Wait Times

- **Create Pool:** Usually 1-2 minutes
- **Initialize:** Usually 1-2 minutes
- **Add Liquidity:** Usually 2-3 minutes

**If transaction stuck:**
- Check if you have enough Gas.
- Check pending transactions on Polygonscan.
- Retry with higher Gas.

---

## 🔗 Useful Links

- **Safe:** https://app.safe.global
- **Polygonscan:** https://polygonscan.com
- **QuickSwap:** https://quickswap.exchange/

---

## 💡 Important Notes

1. **Always use Safe Transaction Builder** (Not direct Script).
2. **Save Pool Address after createPool**.
3. **Get sqrtPriceX96 from Script** (For Initialize).
4. **Ensure Pool is created before Initialize**.

---

**For more questions, check `generatePAXGPoolCalldata.js`!**

