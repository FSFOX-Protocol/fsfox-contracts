# Gnosis Safe Transactions Guide

## 📋 Information

- **Network:** Polygon Mainnet
- **Safe Address:** `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
- **FSFOX Contract:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`

---

## ✅ Completed Transactions

1. ✅ **Create Pool** - Pool created
2. ✅ **Initialize Pool** - Pool initialized
3. ✅ **Approve FSFOX** - FSFOX approved for NPM
4. ✅ **Approve USDC** - USDC approved for NPM
5. ✅ **setSpender (NPM)** - NPM added to allowedSpenders
6. ✅ **setSpender (SwapRouter)** - SwapRouter added to allowedSpenders
7. ✅ **setPool** - Pool added to allowlist
8. ✅ **Add Liquidity** - Liquidity added

---

## 🔧 Future Transactions

### Enable Full Trading:

**To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`

**Function:** `enableTrading()`

**Data:** `0x3fab9a08`

**Or via Transaction Builder:**
1. ABI: `[{"inputs":[],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"}]`
2. Function: `enableTrading`
3. Submit → Sign → Execute

---

## 📝 Using Transaction Builder

1. In Safe → **Transaction Builder**
2. **"Add transaction"**
3. **Toggle "Custom data" OFF**
4. **Contract address:** FSFOX address
5. **ABI:** Related to desired function
6. **Select Function**
7. **Enter Parameters**
8. **Submit** → Sign → Execute

---

**For detailed transactions, refer to Gist or complete documentation.**
