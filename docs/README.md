# FSFOX Documentation

This folder contains all necessary documentation for using FSFOX.

---

## 📚 Documentation Index

### 📖 Official Information

#### 1. [OFFICIAL_INFO.md](official/OFFICIAL_INFO.md)
**Official Token and Pool Information:**
- Official FSFOX Address
- Pool Addresses
- Deprecated Addresses
- Owner Information
- Price Links

#### 2. [PROJECT_STATUS.md](official/PROJECT_STATUS.md)
**Latest Project Status:**
- Complete Contract and Pool Information
- Token List (Updated)
- Completed Transactions
- Uniswap API Status
- Next Steps

---

### 👥 User Guides

#### 3. [USER_GUIDE.md](guides/general/USER_GUIDE.md)
**User Guide for Buy/Sell:**
- Buying on CEX (Binance)
- Buying on DEX (Uniswap)
- Using Token List
- Fixing 404 Error
- Trading Status (Presale)

#### 4. [TOKEN_LIST_GUIDE.md](guides/general/TOKEN_LIST_GUIDE.md)
**Token List Guide:**
- Why Token List is needed?
- How to use?
- Token List URL
- Updating Token List

#### 5. [PRICE_LINKS.md](guides/general/PRICE_LINKS.md)
**Price and Chart Links:**
- DEX Screener
- DexTools
- Uniswap Swap
- Polygonscan
- CoinGecko/CoinMarketCap

#### 6. [LOGO_AND_LISTING.md](guides/general/LOGO_AND_LISTING.md) ⭐
**Logo Addition and Listing Strategy:**
- Adding Logo to Trust Wallet Assets
- Updating Polygonscan
- DEX Listing Strategy
- Using Aggregators

---

### 🔧 Technical Guides (Gnosis Safe)

#### 7. [GNOSIS_SAFE_TRANSACTIONS.md](guides/safe/GNOSIS_SAFE_TRANSACTIONS.md)
**Safe Transaction Guide:**
- Completed Transactions
- Future Transactions (`enableTrading`)
- Using Transaction Builder

#### 8. [USAGE_WITH_SCRIPTS.md](guides/safe/USAGE_WITH_SCRIPTS.md)
**Using Safe with Scripts:**
- Why Safe has no Private Key?
- Different Solutions
- Using Transaction Builder
- Using Safe SDK

#### 9. [APPROVE_FSFOX_STEP_BY_STEP.md](guides/trading/APPROVE_FSFOX_STEP_BY_STEP.md)
**Detailed Approve FSFOX Guide:**
- Step-by-step Instructions
- Using Transaction Builder
- ABI and Calldata
- Troubleshooting

#### 10. [TRANSFER_TOKENS.md](guides/safe/TRANSFER_TOKENS.md)
**Transfer Tokens to Safe:**
- Using `unlockTokens()`
- Transfer Methods
- Checklist

#### 11. [TRANSFER_NFT.md](guides/safe/TRANSFER_NFT.md)
**Transfer NFT Positions to Safe:**
- Finding NFT Positions
- Transfer Methods
- Using Scripts

#### 12. [TRANSFER_POOL_OWNERSHIP.md](guides/safe/TRANSFER_POOL_OWNERSHIP.md)
**Transfer Pool Ownership to Safe:**
- Finding NFT Position
- Transfer Process

#### 13. [PARTNER_DISTRIBUTION.md](guides/safe/PARTNER_DISTRIBUTION.md)
**Partner Token Distribution:**
- Using `unlockTokens()`
- Transfer to Partners
- Using Auto Script
- Checklist

---

### 💧 Liquidity Management Guides

#### 14. [MECHANISM.md](guides/liquidity/MECHANISM.md)
**Liquidity Addition Mechanism:**
- Why can't you add just one token?
- Constant Product Formula
- Swap + Add Liquidity
- Price Impact

#### 15. [INCREASE_LIQUIDITY.md](guides/liquidity/INCREASE_LIQUIDITY.md)
**Guide to Increasing Liquidity Pool:**
- How to increase Liquidity?
- Complete Steps (Approve + Mint)
- Using Safe Transaction Builder
- Using Scripts
- Result of Increasing Liquidity

#### 16. [ADD_PAXG.md](guides/liquidity/ADD_PAXG.md)
**Guide to Adding FSFOX/PAXG Liquidity:**
- Unlock FSFOX
- Transfer PAXG to Safe
- Add Liquidity

#### 17. [INCREASE_SUPPLY.md](guides/liquidity/INCREASE_SUPPLY.md)
**Guide to Increasing Total Supply:**
- Is it possible?
- Solutions (New Deploy vs unlockTokens)
- Method Comparison
- Warnings and Notes

---

### 🏊 Pool Guides

#### 18. [FIND_ADDRESS.md](guides/pools/FIND_ADDRESS.md)
**How to Find Pool Address:**
- Using Scripts
- From Transaction Receipt
- From Polygonscan
- From QuickSwap UI

#### 19. [CREATE_PAXG_POOL.md](guides/pools/CREATE_PAXG_POOL.md)
**Guide to Creating FSFOX/PAXG Pool:**
- Calculate Price and Amounts
- Create Pool
- Add Liquidity
- Manage Liquidity

#### 20. [CREATE_PAXG_WITH_SAFE.md](guides/pools/CREATE_PAXG_WITH_SAFE.md)
**Guide to Creating Pool with Gnosis Safe:**
- Generate Calldata
- Create Pool in Safe
- Initialize Pool
- Add Liquidity

#### 21. [ADD_TO_ALLOWLIST.md](guides/pools/ADD_TO_ALLOWLIST.md)
**Guide to Adding Pool to Allowlist:**
- Fixing STF Error
- Adding Pool to Allowlist
- Checking Status

---

### 💰 Trading Guides

#### 22. [BUY_WITH_PAXG.md](guides/trading/BUY_WITH_PAXG.md)
**Guide to Buying FSFOX with PAXG:**
- STF Error in Presale Mode
- Solutions
- Using QuickSwap UI
- Enable Full Trading

#### 23. [TEST_TRADING_PAXG.md](guides/trading/TEST_TRADING_PAXG.md)
**Guide to Testing Trading with PAXG:**
- Enable Trading
- Test Buying with PAXG
- Important Warnings

#### 24. [ENABLE_PAXG_BUY_ONLY.md](guides/trading/ENABLE_PAXG_BUY_ONLY.md)
**Guide to Enabling PAXG Buy Without Sell:**
- Current Contract Limitations
- Possible Solutions
- Recommendations

#### 25. [ADD_TOKEN_TO_QUICKSWAP.md](guides/trading/ADD_TOKEN_TO_QUICKSWAP.md)
**Guide to Adding FSFOX and PAXG to QuickSwap:**
- Adding Tokens Manually
- Complete Swap Steps
- Troubleshooting

---

### 🛠️ Troubleshooting

#### 26. [UNISWAP_404.md](troubleshooting/UNISWAP_404.md)
**Guide to Fixing 404 Error in Uniswap:**
- Why do we see 404 error?
- Different Solutions (Wait, Script, Polygonscan)
- Checking Pool Status
- If issue persists after 3 days
- FAQ

#### 27. [APPROVE_ISSUE.md](troubleshooting/APPROVE_ISSUE.md)
**Guide to Fixing Approve FSFOX Issue:**
- Problem: Safe has no balance
- Solution: Unlock Tokens
- Correct Transaction Order
- Exact Amounts

#### 28. [GS013_ERROR.md](troubleshooting/GS013_ERROR.md)
**Guide to Fixing GS013 Error in Gnosis Safe:**
- Error Cause
- Checking Status
- Solutions
- Checklist

---

### 📜 Scripts Guide

#### 29. [SCRIPTS.md](guides/general/SCRIPTS.md) ⭐
**Complete Guide to All Scripts:**
- Complete List of All Scripts
- Explanation of Each Script
- How to Use
- Settings
- Categorization

**This file includes guide for 20+ Scripts!**

---

### 📊 General Guides

#### 30. [VALUE_CALCULATION.md](guides/general/VALUE_CALCULATION.md)
**Guide to FSFOX Value Calculation:**
- How is value calculated?
- Each Pool has separate Price
- Total Value = Sum of Values
- Using Scripts

---

## 🚀 Quick Start

### For Users:
1. Start with [USER_GUIDE.md](guides/general/USER_GUIDE.md) - Buy/Sell Guide
2. [PRICE_LINKS.md](guides/general/PRICE_LINKS.md) - View Price
3. [TOKEN_LIST_GUIDE.md](guides/general/TOKEN_LIST_GUIDE.md) - Use Token List

### For Developers:
1. Start with [OFFICIAL_INFO.md](official/OFFICIAL_INFO.md) - Official Information
2. [SCRIPTS.md](guides/general/SCRIPTS.md) - Scripts Guide
3. [PROJECT_STATUS.md](official/PROJECT_STATUS.md) - Project Status

### For Safe Managers:
1. Start with [GNOSIS_SAFE_TRANSACTIONS.md](guides/safe/GNOSIS_SAFE_TRANSACTIONS.md) - Safe Transactions
2. [USAGE_WITH_SCRIPTS.md](guides/safe/USAGE_WITH_SCRIPTS.md) - Safe and Scripts
3. [APPROVE_FSFOX_STEP_BY_STEP.md](guides/trading/APPROVE_FSFOX_STEP_BY_STEP.md) - Detailed Approve

### For Troubleshooting:
1. [UNISWAP_404.md](troubleshooting/UNISWAP_404.md) - 404 Error
2. [APPROVE_ISSUE.md](troubleshooting/APPROVE_ISSUE.md) - Approve Issue
3. [SCRIPTS.md](guides/general/SCRIPTS.md) - Status Check Scripts

---

## 📂 File Organization

### Directory Structure:

```
docs/
├── guides/
│   ├── general/          # General guides
│   ├── liquidity/        # Liquidity guides
│   ├── pools/            # Pool guides
│   ├── safe/             # Safe guides
│   └── trading/          # Trading guides
├── official/             # Official information
└── troubleshooting/      # Troubleshooting guides
```

### Categories:

**📖 Official Information:**
- [OFFICIAL_INFO.md](official/OFFICIAL_INFO.md)
- [PROJECT_STATUS.md](official/PROJECT_STATUS.md)

**👥 User Guides:**
- [USER_GUIDE.md](guides/general/USER_GUIDE.md)
- [TOKEN_LIST_GUIDE.md](guides/general/TOKEN_LIST_GUIDE.md)
- [PRICE_LINKS.md](guides/general/PRICE_LINKS.md)
- [LOGO_AND_LISTING.md](guides/general/LOGO_AND_LISTING.md)

**🔧 Technical (Safe):**
- [GNOSIS_SAFE_TRANSACTIONS.md](guides/safe/GNOSIS_SAFE_TRANSACTIONS.md)
- [USAGE_WITH_SCRIPTS.md](guides/safe/USAGE_WITH_SCRIPTS.md)
- [APPROVE_FSFOX_STEP_BY_STEP.md](guides/trading/APPROVE_FSFOX_STEP_BY_STEP.md)

**💧 Liquidity:**
- [MECHANISM.md](guides/liquidity/MECHANISM.md)
- [INCREASE_LIQUIDITY.md](guides/liquidity/INCREASE_LIQUIDITY.md)
- [ADD_PAXG.md](guides/liquidity/ADD_PAXG.md)

**🎁 Token Management:**
- [PARTNER_DISTRIBUTION.md](guides/safe/PARTNER_DISTRIBUTION.md)
- [INCREASE_SUPPLY.md](guides/liquidity/INCREASE_SUPPLY.md)

**🛠️ Troubleshooting:**
- [UNISWAP_404.md](troubleshooting/UNISWAP_404.md)
- [APPROVE_ISSUE.md](troubleshooting/APPROVE_ISSUE.md)
- [GS013_ERROR.md](troubleshooting/GS013_ERROR.md)

**📜 Scripts:**
- [SCRIPTS.md](guides/general/SCRIPTS.md) ⭐

---

## 🔍 Quick Search

### I want to...
- **Buy FSFOX:** [USER_GUIDE.md](guides/general/USER_GUIDE.md)
- **View Price:** [PRICE_LINKS.md](guides/general/PRICE_LINKS.md)
- **Increase Liquidity:** [INCREASE_LIQUIDITY.md](guides/liquidity/INCREASE_LIQUIDITY.md)
- **Distribute Tokens:** [PARTNER_DISTRIBUTION.md](guides/safe/PARTNER_DISTRIBUTION.md)
- **Use Safe:** [GNOSIS_SAFE_TRANSACTIONS.md](guides/safe/GNOSIS_SAFE_TRANSACTIONS.md)
- **Scripts Guide:** [SCRIPTS.md](guides/general/SCRIPTS.md) ⭐
- **Fix 404 Error:** [UNISWAP_404.md](troubleshooting/UNISWAP_404.md)
- **Fix Approve Issue:** [APPROVE_ISSUE.md](troubleshooting/APPROVE_ISSUE.md)

---

**All necessary information is available in this folder!**
