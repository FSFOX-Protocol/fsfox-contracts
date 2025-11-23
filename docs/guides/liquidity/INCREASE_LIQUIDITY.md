# Guide to Increasing Pool Liquidity

**Date:** 2025-11-01

---

## 📊 Current Pool Status

### Pool Balance:
- **USDC:** ~51 USDC
- **FSFOX:** ~49,000 FSFOX
- **Liquidity:** Active

### Safe Balance:
- **USDC:** Check balance
- **FSFOX:** ~0 FSFOX (Use `unlockTokens()` to get more)

---

## 🎯 How to Increase Liquidity?

### General Approach:

1. **Prepare Tokens** (USDC + FSFOX in Safe).
2. **Approve** for NPM.
3. **Add Liquidity** via NPM.mint().

---

## 📋 Complete Steps

### Step 1: Prepare Tokens

#### For USDC:
- USDC must be in Safe.
- Can be bought from CEX and transferred to Safe.

#### For FSFOX:
- If Safe has no balance, use `unlockTokens()`.
- Release required amount.

**Ratio:** Must maintain current Pool ratio to avoid price impact:
- Currently: ~1000 FSFOX per 1 USDC.
- Or: ~1 FSFOX per 0.001 USDC.

---

### Step 2: Approve

#### Approve USDC for NPM:

**From Gnosis Safe:**

1. **To:** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` (USDC)
2. **Function:** `approve(address spender, uint256 amount)`
3. **Spender:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
4. **Amount:** USDC Amount (with 6 decimals)

**Example:** 100 USDC:
- Amount: `100000000` (100 * 10^6)

#### Approve FSFOX for NPM:

**From Gnosis Safe:**

1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
2. **Function:** `approve(address spender, uint256 amount)`
3. **Spender:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
4. **Amount:** FSFOX Amount (with 18 decimals)

**Example:** 100,000 FSFOX:
- Amount: `100000000000000000000000` (100,000 * 10^18)

---

### Step 3: Add Liquidity

#### From Gnosis Safe:

1. **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NonfungiblePositionManager)
2. **Function:** `mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline))`
3. **Parameters:**

```javascript
{
  token0: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",  // USDC (token0)
  token1: "0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B",  // FSFOX (token1)
  fee: 3000,  // 0.3%
  tickLower: -887220,  // Full range lower
  tickUpper: 887220,   // Full range upper
  amount0Desired: "100000000",  // 100 USDC (6 decimals)
  amount1Desired: "100000000000000000000000",  // 100,000 FSFOX (18 decimals)
  amount0Min: 0,  // Minimum USDC (slippage tolerance)
  amount1Min: 0,  // Minimum FSFOX (slippage tolerance)
  recipient: "0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130",  // Safe address
  deadline: Math.floor(Date.now() / 1000) + 3600  // 1 hour from now
}
```

**Or via Transaction Builder:**

1. Toggle "Custom data" OFF.
2. ABI:
   ```json
   [{"inputs":[{"components":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.MintParams","name":"params","type":"tuple"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"}]
   ```
3. Function: `mint`
4. Fill Parameters.
5. Submit → Sign → Execute

---

## 🔄 How many times can you add?

### ✅ Unlimited!

**You can add Liquidity as many times as you want:**
- ✅ Daily.
- ✅ Hourly.
- ✅ Different amounts.
- ✅ New NFT Position each time.

**Note:** Each `mint()`:
- Creates a NEW NFT Position.
- Adds Liquidity to Pool.
- Can be removed later.

---

## 📈 Result of Increasing Liquidity

### Benefits:

1. **More Liquidity:**
   - Lower Slippage.
   - Larger trades possible.
   - More stable price.

2. **Higher Volume:**
   - Easier for users to buy/sell.
   - Higher user trust.

3. **More Fees:**
   - 0.3% fee per trade.
   - Fees go to LP Providers (You).
   - Can be collected later.

4. **Market Depth:**
   - Deeper market.
   - Less price volatility.

---

## 💰 Practical Example

### Adding 100 USDC + 100,000 FSFOX:

**Step 1: Approve USDC**
- To: `0x2791...4174` (USDC)
- Amount: `100000000`

**Step 2: Approve FSFOX**
- To: `0xe5C7...5e2B` (FSFOX)
- Amount: `100000000000000000000000`

**Step 3: Mint**
- To: `0xC364...11FE88` (NPM)
- Parameters: (As above)
- Receive NFT Position.

---

## ⚠️ Important Notes

### 1. Price Ratio:

**Crucial:** Must maintain current Pool ratio. If wrong:
- May consume all USDC and leave FSFOX.
- Or vice versa.

**Solution:**
- Check current ratio (Pool balance).
- Or use `amount0Min` and `amount1Min`.

### 2. Slippage Tolerance:

- Set `amount0Min` and `amount1Min`.
- Protects against price changes during transaction.

### 3. Range:

- Currently using Full Range (`-887220` to `887220`).
- Can choose narrower range (Concentrated Liquidity).

### 4. NFT Positions:

- You get an NFT each time.
- Can manage later.
- Can collect Fees.
- Can remove Position.

---

## 🔧 Using Scripts

I can write a Script to:
1. Check balance.
2. Approve.
3. Add Liquidity.
4. Show result.

**Note:** Requires Private Key or Gnosis Safe Signature.

---

## 📊 Check After Adding

After adding Liquidity:

1. **Polygonscan Pool:** Check new balance.
2. **DEX Screener:** See new Liquidity.
3. **NFT Position:** See new NFT in Safe.

---

## ✅ Summary

**To Increase Liquidity:**

1. ✅ USDC and FSFOX in Safe.
2. ✅ Approve NPM.
3. ✅ `mint()` via NPM.

**Frequency:**
- ✅ Unlimited!

**Result:**
- ✅ More Liquidity.
- ✅ Less Slippage.
- ✅ More Volume.
- ✅ More Fees for you.

---

**For more help or scripts, let me know!**

