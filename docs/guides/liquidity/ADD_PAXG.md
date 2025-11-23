# Guide to Adding FSFOX/PAXG Liquidity

**Date:** 2025-11-01

---

## 📊 Current Status

### Safe Balance:
- **FSFOX:** 3,844.9 FSFOX
- **PAXG:** 0 PAXG
- **Locked FSFOX:** 907,706.1 FSFOX (Unlockable)

### Liquidity Needs:
- **FSFOX:** 43,261.74 FSFOX
- **PAXG:** 0.011500 PAXG

### Shortage:
- **FSFOX:** 39,416.84 FSFOX
- **PAXG:** 0.011500 PAXG

---

## ✅ Solution: 3 Steps

### Step 1: Unlock FSFOX

To release FSFOX from Locked Tokens:

**From Gnosis Safe:**

1. **New Transaction** → **Contract interaction**
2. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
3. **Toggle "Custom data":** OFF
4. **ABI:**
   ```json
   [{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unlockTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]
   ```
5. **Function:** `unlockTokens`
6. **Amount:** `39416840000000000000000` (39,416.84 FSFOX)
7. **Submit** → Sign → **Execute**

**Note:** You can unlock more (e.g., 50,000) for future use.

---

### Step 2: Transfer PAXG to Safe

To transfer PAXG from MetaMask to Safe:

**From MetaMask:**

1. Select PAXG.
2. Click **Send**.
3. **To:** `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130` (Safe)
4. **Amount:** `0.011500` PAXG (or more for future use).
5. **Confirm** → **Send**.

**Note:** Ensure you have PAXG in MetaMask.

---

### Step 3: Add Liquidity

After FSFOX and PAXG are in Safe:

#### Option 1: From QuickSwap UI (Recommended)

1. Go to https://quickswap.exchange/pools
2. Select **New Position**.
3. Select FSFOX and PAXG.
4. Enter amounts:
   - **PAXG:** 0.011500
   - **FSFOX:** 43,261.74
5. Click **Add Liquidity**.
6. Connect MetaMask to Safe (or use Wallet Connect).

#### Option 2: From Safe Transaction Builder

```bash
# Generate Calldata
npx hardhat run scripts/generatePAXGLiquidityCalldata.js --network polygon
```

Then from Safe:
1. **New Transaction** → **Contract interaction**
2. Execute Approve and Mint transactions.

---

## 📋 Checklist

- [ ] Unlock FSFOX (39,416.84 FSFOX)
- [ ] Transfer PAXG to Safe (0.011500 PAXG)
- [ ] Check Safe Balance
- [ ] Add Liquidity (from QuickSwap or Safe)

---

## 💡 Important Notes

### 1. Unlock Amount:

You can unlock more:
- **50,000 FSFOX:** For future use.
- **100,000 FSFOX:** For multiple Liquidity additions.

### 2. PAXG Amount:

You can transfer more:
- **0.05 PAXG:** For future use.
- **0.1 PAXG:** For multiple Liquidity additions.

### 3. Using QuickSwap:

- **Simpler:** Use UI.
- **Automatic:** Handles Approve and Mint automatically.
- **Easier:** Just enter amounts.

---

## 🔧 Scripts

### Check Balance:

```bash
npx hardhat run scripts/checkPoolStatus.js --network polygon
```

### Generate Calldata:

```bash
npx hardhat run scripts/generatePAXGLiquidityCalldata.js --network polygon
```

---

## 🔗 Useful Links

- **Safe:** https://app.safe.global
- **QuickSwap:** https://quickswap.exchange/pools
- **Polygonscan:** https://polygonscan.com

---

**For more questions, check the Scripts!**

