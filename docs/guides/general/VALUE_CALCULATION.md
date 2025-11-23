# Guide to FSFOX Value Calculation

**Date:** 2025-11-08

---

## ❓ Main Question

**Since each pair has its own pool, is the FSFOX token value equal to the sum of pool values, or is each pair calculated separately?**

---

## ✅ Short Answer

**Each pair (Pool) has a separate price for FSFOX, but the total value of FSFOX supply is the sum of FSFOX value across all Pools.**

---

## 📊 How it is Calculated

### 1️⃣ Each Pool has a separate Price

Each Pool determines FSFOX price based on the ratio of tokens in it:

```
FSFOX Price in Pool = (Amount of Other Token) / (Amount of FSFOX)
```

**Example:**

- **FSFOX/USDC Pool:**
  - 94.99 USDC ÷ 83,806.78 FSFOX = **0.00113342 USD per FSFOX**

- **FSFOX/PAXG Pool:**
  - 0.01185790 PAXG ÷ 41,908.83 FSFOX = **0.00113178 USD per FSFOX**

### 2️⃣ FSFOX Value in Each Pool

FSFOX value in each pool is calculated as:

```
FSFOX Value in Pool = (Amount of FSFOX in Pool) × (FSFOX Price in that Pool)
```

**Example:**

- **FSFOX/USDC Pool:**
  - 83,806.78 FSFOX × 0.00113342 USD = **94.99 USD**

- **FSFOX/PAXG Pool:**
  - 41,908.83 FSFOX × 0.00113178 USD = **47.43 USD**

### 3️⃣ Total FSFOX Value

Total FSFOX value is the **sum of FSFOX values in all Pools**:

```
Total FSFOX Value = Σ (FSFOX Value in Each Pool)
```

**Example:**

```
Total Value = 94.99 USD + 47.43 USD = 142.42 USD
```

---

## 📈 Current Status (2025-11-08)

### Pool 1: FSFOX / USDC

- **Address:** `0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF`
- **Balance:**
  - USDC: 94.99 USDC
  - FSFOX: 83,806.78 FSFOX
- **FSFOX Price:** 0.00113342 USD per FSFOX
- **FSFOX Value in this Pool:** 94.99 USD

### Pool 2: FSFOX / PAXG

- **Address:** `0x375c88e92b60e6eafA2369C51065117603B22988`
- **Balance:**
  - PAXG: 0.01185790 PAXG
  - FSFOX: 41,908.83 FSFOX
- **FSFOX Price:** 0.00113178 USD per FSFOX
- **FSFOX Value in this Pool:** 47.43 USD

### Summary

- **Total FSFOX in all Pools:** 125,715.61 FSFOX
- **Total FSFOX Value:** 142.42 USD
- **Weighted Average Price:** 0.00113288 USD per FSFOX
- **Price Difference between Pools:** 0.15% (Almost identical)

---

## ⚠️ Important Notes

### 1. Price Difference between Pools

- FSFOX price might differ between Pools.
- This difference causes **Arbitrage**.
- Arbitrageurs buy from cheaper Pool and sell to expensive Pool, bringing prices closer.

### 2. Price in Each Pool is Independent

- Each Pool is an independent market.
- Price in each Pool is determined by supply and demand in that Pool.
- Changes in one Pool don't necessarily affect the other directly.

### 3. Total Value = Sum of Values

- To calculate Total FSFOX Value, consider all Pools.
- Total Value = Sum (Amount of FSFOX in Pool × Price of FSFOX in that Pool)

---

## 🔧 Using Script

To automatically calculate FSFOX value across all pools:

```bash
npx hardhat run scripts/calculateFSFOXValue.js --network polygon
```

This Script:
- Checks balance of each Pool.
- Calculates FSFOX price in each Pool.
- Calculates FSFOX value in each Pool.
- Displays Total Value.
- Shows price difference between Pools.

---

## 📊 Manual Calculation Example

Suppose:

1. **FSFOX/USDC Pool:**
   - 100 USDC
   - 100,000 FSFOX
   - Price: 100 ÷ 100,000 = 0.001 USD per FSFOX
   - Value: 100,000 × 0.001 = 100 USD

2. **FSFOX/PAXG Pool:**
   - 0.05 PAXG (≈ 200 USD)
   - 200,000 FSFOX
   - Price: 0.05 ÷ 200,000 = 0.00000025 PAXG per FSFOX
   - USD Price: 0.00000025 × 4000 = 0.001 USD per FSFOX
   - Value: 200,000 × 0.001 = 200 USD

**Total Value:** 100 USD + 200 USD = **300 USD**

---

## 🔗 Useful Links

- **USDC Pool:** https://polygonscan.com/address/0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF
- **PAXG Pool:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **FSFOX Contract:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B

---

## 📝 Summary

✅ **Each Pool has separate Price**  
✅ **Total Value = Sum of Values**  
✅ **Prices might differ (Arbitrage)**  
✅ **Consider all Pools for Total Value calculation**

---

**Note:** These calculations are based on current Pool balances and change with every transaction (buy/sell).

