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
- **Liquidity:** see live status in `docs/official/OFFICIAL_INFO.md` (changes with trading)

---

### Other Pools:
- **FSFOX / PAXG:** `0x375c88e92b60e6eafA2369C51065117603B22988`
- **FSFOX / USDT:** `0x4E06f9f368c27962431c508423263B899f8AF4bD`

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
- 🔑 `docs/official/OWNER_POWERS.md` - What the owner can and cannot do (answers "Contract Not Renounced" flags)
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
npx hardhat run scripts/deployment/deployNewOwner.js --network polygon
```

---

## 📝 Contract

- **Name:** FSFOX
- **Symbol:** FSFOX
- **Total Supply:** 1,000,000 tokens
- **Initial allocation:** 950,000 locked + 50,000 free (owner). The locked part has since been released; the last 775,506.1 FSFOX sit in a verified vesting wallet (`0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40`, cliff 2027-03-30, linear until 2029-09-30)
- **Current locked / unlocked amounts:** see `docs/official/OFFICIAL_INFO.md`

---

**For more information, see the `docs/` folder.**
