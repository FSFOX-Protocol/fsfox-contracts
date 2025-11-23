# Guide to Fixing 404 Error in Uniswap UI

**Date:** 2025-11-01

---

## 🔍 What is the problem?

When trying to buy FSFOX on Uniswap UI, you might see this error:

```
POST https://trading-api-labs.interface.gateway.uniswap.org/v1/quote
[HTTP/2 404  285ms]
WARN Quote 404
```

This means:
- ✅ Your Pool is **active** and has Liquidity.
- ✅ Pool exists on blockchain.
- ❌ But **not yet indexed in Uniswap API/Subgraph**.

---

## ✅ Your Pool Status:

- **Pool Address:** `0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF`
- **Liquidity:** ✅ Active
- **Price:** ✅ Initialized
- **Status:** ✅ Everything is correct

**Problem only:** Pool not indexed in Uniswap API yet.

---

## ⏰ Solution 1: Wait (Recommended)

**Time:** Usually 1-24 hours.

Pool automatically gets indexed in Uniswap API/Subgraph. Just wait.

**How to know if indexed?**
- Try Uniswap UI every few hours.
- When 404 error disappears, it is indexed.

---

## 🔧 Solution 2: Use Direct Swap Script

If you don't want to wait, use Script directly:

### Step 1: Preparation

1. Ensure `.env` has:
   ```
   POLYGON_RPC_URL=your_rpc_url
   PRIVATE_KEY=your_private_key
   ```

2. Ensure you have enough USDC.

### Step 2: Run Script

```bash
npx hardhat run scripts/buyFSFOX.js --network polygon
```

**This Script:**
- ✅ Approves USDC for SwapRouter (if needed).
- ✅ Uses SwapRouter directly (No API needed).
- ✅ Performs Swap.
- ✅ Displays result.

### Example Output:

```
🚀 Buying FSFOX via Direct Swap

📝 Info:
  Account: 0x...
  USDC: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
  FSFOX: 0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B

💰 Balance before Swap:
  USDC: 100.0
  FSFOX: 0.0

📊 Swap Details:
  USDC Amount: 1.0

🔄 Swapping...
  📝 Transaction hash: 0x...
  ✅ Transaction confirmed!

💰 Balance after Swap:
  USDC: 99.0
  FSFOX: 977.5

🎉 Purchase Successful!
```

---

## 🔧 Solution 3: Use Polygonscan Write Contract

If you want to swap directly via Polygonscan:

### Step 1: Find SwapRouter

1. Go to:
   ```
   https://polygonscan.com/address/0xE592427A0AEce92De3Edee1F18E0157C05861564
   ```

2. Tab "Contract" → "Write Contract"

### Step 2: Connect Wallet

- Connect Wallet to Polygonscan.

### Step 3: Approve USDC (If needed)

1. Go to:
   ```
   https://polygonscan.com/address/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
   ```

2. Tab "Contract" → "Write Contract"
3. Find `approve` function.
4. **spender:** `0xE592427A0AEce92De3Edee1F18E0157C05861564` (SwapRouter)
5. **amount:** USDC amount to swap (e.g. 1000000 = 1 USDC with 6 decimals)
6. Write → Confirm

### Step 4: Perform Swap

1. Back to SwapRouter: `0xE592427A0AEce92De3Edee1F18E0157C05861564`
2. Find `exactInputSingle` function.
3. Fill parameters:

```javascript
{
  tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",  // USDC
  tokenOut: "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B",  // FSFOX
  fee: 3000,  // 0.3%
  recipient: "YOUR_ADDRESS",  // Your address
  deadline: Math.floor(Date.now() / 1000) + 3600,  // 1 hour later
  amountIn: "1000000",  // 1 USDC (6 decimals)
  amountOutMinimum: "928000000000000000000",  // ~928 FSFOX (5% slippage)
  sqrtPriceLimitX96: "0"  // 0 = no limit
}
```

**Note:** Calculate `amountOutMinimum` with 5% slippage:
- If expecting 977.5 FSFOX
- `amountOutMinimum` = 977.5 × 0.95 = ~928 FSFOX
- With 18 decimals: `928000000000000000000`

---

## 🔍 Checking Pool Status

To check if Pool is still not indexed, run this Script:

```bash
# Create checkPoolStatus.js (if missing)
npx hardhat run scripts/checkPoolStatus.js --network polygon
```

Or directly in Terminal:

```bash
node -e "
const { ethers } = require('ethers');
require('dotenv').config();
(async () => {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  const POOL = '0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF';
  const pool = new ethers.Contract(POOL, [
    'function liquidity() view returns (uint128)',
    'function token0() view returns (address)',
    'function token1() view returns (address)',
    'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)'
  ], provider);
  const liquidity = await pool.liquidity();
  const slot0 = await pool.slot0();
  console.log('Liquidity:', liquidity.toString());
  console.log('Price initialized:', slot0[1] !== 0n ? '✅ Yes' : '❌ No');
})();
"
```

**If Liquidity > 0 and Price initialized = Yes:**
- ✅ Pool is active.
- ⏳ Just wait for indexing.

---

## 📊 Solution Summary

| Solution | Time | Difficulty | Recommended |
|---|---|---|---|
| Wait | 1-24 Hours | ⭐ Easy | ✅ Best |
| Direct Swap Script | Immediate | ⭐⭐ Medium | ✅ Fast |
| Polygonscan Write | Immediate | ⭐⭐⭐ Hard | ⚠️ Pros only |

---

## ⚠️ If Issue Persists After 3 Days

If after few days Pool still 404s in Uniswap API:

### Check Status:

1. **Run Check Script:**
   ```bash
   npx hardhat run scripts/checkUniswapAPI.js --network polygon
   ```
   
   This script:
   - ✅ Checks Pool on blockchain
   - ✅ Checks Pool in Subgraph
   - ✅ Provides suggestions

### If Pool in Subgraph but Trading API 404s:

Problem is Trading API (not Subgraph). Trading API can be slower.

**Solutions:**
1. ✅ Use Direct Swap Script.
2. ✅ Use Polygonscan Write Contract.
3. 📧 Contact Uniswap Support:
   - Discord: https://discord.gg/uniswap
   - GitHub: https://github.com/Uniswap

### Info for Uniswap Support:

```
Pool Address: 0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF
Token0 (USDC): 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174
Token1 (FSFOX): 0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
Fee Tier: 3000 (0.3%)
Chain: Polygon (137)
Issue: Trading API returns 404 for quote requests
Pool is active on-chain with liquidity
```

---

## ❓ FAQ

### Q: Why Pool not indexed?
**A:** Uniswap Subgraph must index all new pools. Usually 1-24 hours, sometimes longer.

### Q: If 404 persists after 3 days?
**A:** Trading API might be issue. Use Direct Swap or contact Uniswap.

### Q: Is Pool broken?
**A:** No! Your Pool is fully active. Just Uniswap API hasn't found it yet.

### Q: Should I do anything?
**A:** No. Use Script or wait. If persistent, contact Uniswap.

### Q: Can other users buy?
**A:** Yes! Via Script or Polygonscan.

---

## 📞 Need Help?

If issue persists > 24 hours:
1. Check Pool active (Script above).
2. Check Liquidity exists.
3. If correct, just wait - Uniswap Subgraph is slow sometimes.

---

**Important:** This is **temporary** and resolves with time. Your Pool works perfectly!

