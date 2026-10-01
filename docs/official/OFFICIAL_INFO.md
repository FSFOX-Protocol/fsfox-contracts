# FSFOX - Official Information

## 🎯 Official Address (Use Only This)

**FSFOX Contract:**
```
0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
```

**Network:** Polygon Mainnet (Chain ID: 137)

**Polygonscan:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B

---

## ⚠️ Old Addresses (Do Not Use)

These addresses are **deprecated**:
- `0x258d004EFEF49c40e716cA02C44CC58D58429cD0`
- `0x3dc05CF96E7f15882BdEA4cf81e466188B3Ae380`

**Always use the official address.**

---

## 📊 Pool Information

### Pool 1: FSFOX / USDC PoS Bridge

**Pool Address:**
```
0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF
```

**Pair:** FSFOX / USDC PoS Bridge
- **USDC PoS Bridge:** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`
- **Fee Tier:** 0.3%
- **Liquidity:** see Live Snapshot below

**Polygonscan Pool:** https://polygonscan.com/address/0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF

---

### Pool 2: FSFOX / PAXG

**Pool Address:**
```
0x375c88e92b60e6eafA2369C51065117603B22988
```

**Pair:** FSFOX / PAXG
- **PAXG:** `0x553d3D295e0f695B9228246232eDF400ed3560B5`
- **Fee Tier:** 0.3%
- **Liquidity:** see Live Snapshot below

**Polygonscan Pool:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988

---

### Pool 3: FSFOX / USDT

**Pool Address:**
```
0x4E06f9f368c27962431c508423263B899f8AF4bD
```

**Pair:** FSFOX / USDT
- **USDT:** `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
- **Fee Tier:** 0.3%
- **Liquidity:** see Live Snapshot below

**Polygonscan Pool:** https://polygonscan.com/address/0x4E06f9f368c27962431c508423263B899f8AF4bD

---

## 📸 Live Snapshot (read from Polygon mainnet, 2026-10-01)

Values below were read directly from the chain (`owner()`, `tradingEnabled()`, `lockedTokens()`, `balanceOf`, pool `slot0()`).
They change with every trade — **always re-check on Polygonscan / DEX Screener before relying on them.**

| Item | Value |
|---|---|
| Owner | Gnosis Safe `0x5Dbf…B130` |
| `tradingEnabled` | `true` |
| Locked in token contract (`lockedTokens`) | 0 — moved to vesting wallet on 2026-10-02 |
| Vesting wallet | 775,506.1 FSFOX in [`0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40`](https://polygonscan.com/address/0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40#code) (cliff 2027-03-30, fully vested 2029-09-30) |
| Safe balance | ~10,199.64 FSFOX |
| USDC pool | ~47,626.72 FSFOX + ~167.62 USDC |
| PAXG pool | ~47,735.20 FSFOX + ~0.0399 PAXG |
| USDT pool | ~47,322.75 FSFOX + ~168.14 USDT |
| Pools in allowlist | USDC ✅ PAXG ✅ USDT ✅ |
| Price (USDC / USDT pools) | ~0.00352 USDC / ~0.00355 USDT per FSFOX |

---

## 🔒 Owner

**Gnosis Safe:**
```
0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130
```

---

## 📋 Token Information

- **Name:** FSFOX
- **Symbol:** FSFOX
- **Decimals:** 18
- **Total Supply:** 1,000,000 tokens
- **Locked (token contract):** 0 FSFOX. The remaining 775,506.1 FSFOX were moved into an on-chain vesting wallet (`0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40`): nothing releasable before 2027-03-30, then linear until 2029-09-30. See `docs/guides/safe/VESTING_PLAN.md`
- **Unlocked from the contract:** 950,000 FSFOX (of which 775,506.1 are in the vesting wallet)
- **Safe (owner):** ~10,199.64 FSFOX

---

## 🔄 Presale Status

- **tradingEnabled:** `true` (Full trading active)
- ✅ **BUY:** Users can buy FSFOX
- ✅ **SELL:** Users can sell FSFOX

---

## ✅ Pool Settings

- ✅ Pool is in allowlist
- ✅ SwapRouter is in allowedSpenders
- ✅ NPM is in allowedSpenders

---

For buying FSFOX, see `docs/guides/general/USER_GUIDE.md`.

---

## 🔗 Price Links

### DEX Screener (Recommended):
https://dexscreener.com/polygon/0xc87a70627546aade880fda3d1fdd07007c60b5ff

### DexTools:
https://www.dextools.io/app/en/polygon/pair-explorer/0xc87a70627546aade880fda3d1fdd07007c60b5ff

### Uniswap Swap:
https://app.uniswap.org/swap?inputCurrency=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&outputCurrency=0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B&chain=polygon

**Complete Guide:** See `docs/guides/general/PRICE_LINKS.md`.
