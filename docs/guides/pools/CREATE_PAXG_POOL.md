# Guide to Creating FSFOX/PAXG Pool on QuickSwap V3

**Date:** 2025-11-01

---

## 📋 Summary

This guide is for creating FSFOX/PAXG Pool on QuickSwap V3 with:
- **Initial Price:** Equal to current USDC Pool price (~$0.001063 per FSFOX)
- **Initial Liquidity:** Equal to current USDC Pool liquidity ($91.997634)

---

## 📊 Initial Information

### Addresses:
- **FSFOX:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **PAXG:** `0x553d3D295e0f695B9228246232eDF400ed3560B5`
- **QuickSwap V3 Factory:** `0x1F98431c8aD98523631AE4a59f267346ea31F984`
- **NPM (NonfungiblePositionManager):** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`

### Prices:
- **FSFOX/USDC:** $0.001063 (From current Pool)
- **PAXG/USD:** ~$1,800 (Please check exact price)
- **FSFOX/PAXG:** 0.0000005907 PAXG per 1 FSFOX

### Initial Liquidity Amounts:
- **FSFOX:** 43,261.74 FSFOX
- **PAXG:** 0.025555 PAXG
- **Total Value:** $91.997634

---

## 🚀 Pool Creation Steps

### Step 1: Calculate Price and Amounts

```bash
npx hardhat run scripts/calculatePAXGPoolPrice.js --network polygon
```

**Output:**
- FSFOX/PAXG Price
- Exact FSFOX and PAXG amounts
- sqrtPriceX96 for Initialize

**Note:** If PAXG price changes, update in Script.

---

### Step 2: Create Pool

```bash
npx hardhat run scripts/createPAXGPool.js --network polygon
```

**This Script:**
1. Creates Pool in Factory.
2. Initializes Pool with correct price.
3. Displays Pool Address.

**Note:** After execution, enter Pool Address in `addPAXGLiquidity.js`.

---

### Step 3: Add Liquidity

**Option 1: From Script (Recommended)**

1. Enter Pool Address in `addPAXGLiquidity.js`:
   ```javascript
   const POOL_PAXG = "0x..."; // Pool Address
   ```

2. Set amounts:
   ```javascript
   const AMOUNT_PAXG = "0.025555";
   const AMOUNT_FSFOX = "43261.740279";
   ```

3. Run:
   ```bash
   npx hardhat run scripts/addPAXGLiquidity.js --network polygon
   ```

**Option 2: From QuickSwap UI**

1. Go to https://quickswap.exchange/pools
2. Select **New Position**.
3. Select FSFOX and PAXG.
4. Enter amounts.
5. Click **Add Liquidity**.

---

## 🔧 Managing Liquidity

### Adding More Liquidity:

**Method 1: From Script**
- Enter new amounts in `addPAXGLiquidity.js`
- Run Script

**Method 2: From QuickSwap UI**
- Go to **Pools**
- Find your Position
- Click **Add Liquidity**

### Removing Liquidity:

**From QuickSwap UI:**
1. Go to **Pools**
2. Find your Position
3. Click **Remove Liquidity**
4. Select percentage

### Changing Price Range:

**To change range:**
1. Remove current Position.
2. Mint new Position with new range.

**Or from Script:**
- Use `managePAXGLiquidity.js` (In development).

---

## 📊 Calculating Amounts for More/Less Liquidity

### Formula:

To maintain price ratio:
- If `token0 = PAXG` and `token1 = FSFOX`:
  - `FSFOX = PAXG × (FSFOX per PAXG)`
- If `token0 = FSFOX` and `token1 = PAXG`:
  - `PAXG = FSFOX × (PAXG per FSFOX)`

### Example:

**To add $50 Liquidity:**
- PAXG: $25 / $1,800 = 0.013889 PAXG
- FSFOX: $25 / $0.001063 = 23,533.4 FSFOX

**To remove 10% Liquidity:**
- Use QuickSwap UI.
- Or Remove Position.

---

## ⚙️ Script Settings

### `calculatePAXGPoolPrice.js`:
```javascript
const TARGET_LIQUIDITY_USD = 91.997634; // Target Liquidity
const PAXG_PRICE_USD = 1800; // PAXG Price (Update)
```

### `createPAXGPool.js`:
```javascript
const FEE = 3000; // 0.3% (Can use 500 = 0.05%)
const FSFOX_PRICE_USDC = 0.001062; // FSFOX Price
const PAXG_PRICE_USD = 1800; // PAXG Price
```

### `addPAXGLiquidity.js`:
```javascript
const POOL_PAXG = ""; // Pool Address (After creation)
const AMOUNT_PAXG = "0.025555";
const AMOUNT_FSFOX = "43261.740279"; // Or empty = Auto
const TICK_LOWER = -887220; // Full range
const TICK_UPPER = 887220;  // Full range
```

---

## 🎯 Important Notes

### 1. PAXG Price:
- PAXG price varies.
- Check exact price before creating Pool.
- Update in Scripts.

### 2. Price Ratio:
- Always maintain price ratio.
- Changing ratio causes Slippage.

### 3. Fee Tier:
- **0.3% (3000):** For medium volatility pairs.
- **0.05% (500):** For stable pairs.
- Can try both.

### 4. Price Range:
- **Full Range (-887220 to 887220):** For starting.
- **Concentrated:** For optimization (later).

---

## 🔗 Useful Links

- **QuickSwap:** https://quickswap.exchange/
- **Polygonscan:** https://polygonscan.com/
- **PAXG Contract:** https://polygonscan.com/token/0x553d3D295e0f695B9228246232eDF400ed3560B5

---

## 📝 Checklist

- [ ] Check and update PAXG price
- [ ] Run `calculatePAXGPoolPrice.js`
- [ ] Run `createPAXGPool.js`
- [ ] Enter Pool Address in `addPAXGLiquidity.js`
- [ ] Check PAXG and FSFOX balances
- [ ] Run `addPAXGLiquidity.js`
- [ ] Check Pool in QuickSwap UI

---

**For more questions, check the Scripts!**

