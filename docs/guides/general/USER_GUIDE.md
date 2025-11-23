# User Guide: Buying FSFOX

## 🎯 Buying on Different Exchanges

### 1. On Binance and Other CEXs:

✅ **No Problem!**

- User just selects "FSFOX/USDC"
- Exchange manages USDC itself
- No need to select USDC type

---

### 2. On Uniswap (DEX):

⚠️ **Must Use Token List**

#### ⚠️ If You See 404 Error:

If you see this error when swapping:
```
POST https://trading-api-labs.interface.gateway.uniswap.org/v1/quote
[HTTP/2 404]
```

**This means:** Pool not yet indexed in Uniswap API (usually takes 1-24 hours)

**Quick Solution:** Use Script `buyFSFOX.js`:
```bash
npx hardhat run scripts/buyFSFOX.js --network polygon
```

**Or:** Wait for Pool to be indexed in API (usually 1-24 hours)

📖 **Complete Guide:** See `docs/troubleshooting/UNISWAP_404.md`

---

#### Method 1: Using Token List (Recommended):

1. **Add Token List:**
   - In Uniswap → Settings → Token Lists
   - Paste URL: `https://gist.githubusercontent.com/smehdikermani/bb6563d5b9246488791c640bc742cb7d/raw/token-list.json`
   - Import

2. **Now you only see correct tokens:**
   - FSFOX (Official Address)
   - USDC PoS Bridge (that Pool was created with)

3. **Swap** - Without confusion! ✅

---

#### Method 2: Manual Selection (Without Token List):

If not using Token List:

1. **Select USDC PoS Bridge:**
   - Address: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
   - **Not** USDC Native (`0x3c49...3359`)

2. **Select FSFOX:**
   - Address: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`

3. **Swap**

---

## ⚠️ Why Are There Two Types of USDC?

On Polygon, there are two types of USDC:
- **USDC Native:** `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`
- **USDC PoS Bridge:** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`

**FSFOX Pool was created with USDC PoS Bridge.**

**Solution:** Use Token List to only see correct USDC! ✅

---

## 🔄 Trading Status

### Currently (Presale):

- ✅ **BUY:** Users can buy FSFOX
- ❌ **SELL:** Users cannot sell FSFOX

### After `enableTrading()`:

- ✅ **BUY:** Users can buy
- ✅ **SELL:** Users can sell

---

## 📝 Important Notes

1. **Always use official FSFOX address:**
   - `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
   - Do not use old addresses

2. **Use Token List in Uniswap:**
   - Prevents confusion
   - Only see correct tokens

3. **No problem in CEXs:**
   - Just select "FSFOX/USDC"

---

**For more information, see `docs/official/OFFICIAL_INFO.md`.**
