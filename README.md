# FSFOX Token - Polygon Mainnet

## 📋 Official Information

### FSFOX Contract:
- **Address:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **Network:** Polygon Mainnet (Chain ID: 137)
- **Polygonscan:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
- **Owner:** `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130` (Gnosis Safe)

### Pool:
- **Address:** `0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF`
- **Pair:** FSFOX / USDC PoS Bridge
- **Fee Tier:** 0.3%
- **Liquidity:** 50,000 FSFOX + 50 USDC

---

## ⚠️ Old Addresses (Do Not Use)

These addresses are **deprecated**:
- `0x258d004EFEF49c40e716cA02C44CC58D58429cD0`
- `0x3dc05CF96E7f15882BdEA4cf81e466188B3Ae380`

**Always use the official address:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`

---

## 🎯 Buying FSFOX

### On CEXs (Binance, Coinbase):
✅ **No Problem** - User just selects "FSFOX/USDC"

### On DEXs (Uniswap):
⚠️ **Use Token List** - Complete guide in `docs/guides/general/TOKEN_LIST_GUIDE.md`

---

## 📚 Documentation

Complete documentation in `docs/` folder:
- 📋 `docs/README.md` - Documentation Index
- 🎯 `docs/official/OFFICIAL_INFO.md` - Official Token and Pool Information
- 👥 `docs/guides/general/USER_GUIDE.md` - User Guide for Buy/Sell
- 📝 `docs/guides/general/TOKEN_LIST_GUIDE.md` - Token List Usage Guide
- 🔐 `docs/guides/safe/GNOSIS_SAFE_TRANSACTIONS.md` - Safe Transactions Guide

---

## 🔧 Development

### Install:
```bash
npm install
```

### Compile:
```bash
npx hardhat compile
```

### Test:
```bash
npx hardhat test
```

### Deploy:
```bash
npx hardhat run scripts/deployNewOwner.js --network polygon
```

---

## 📝 Contract

- **Name:** FSFOX
- **Symbol:** FSFOX
- **Total Supply:** 1,000,000 tokens
- **Locked:** 950,000 tokens (in contract)
- **Free:** 50,000 tokens (in Safe/Owner)

---

**For more information, see the `docs/` folder.**
