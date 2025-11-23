# Guide to Adding FSFOX and PAXG to QuickSwap

**Date:** 2025-11-08

---

## 🔍 Problem

In QuickSwap UI (https://quickswap.exchange/swap):
- ❌ PAXG is not shown.
- ❌ FSFOX is not shown.

**Cause:** These tokens are not in the default QuickSwap Token List.

---

## ✅ Solution: Adding Tokens Manually

### Step 1: Adding FSFOX

1. Go to https://quickswap.exchange/swap
2. In the "Select a token" section (where you want to select FSFOX).
3. Click "Manage" or "Token Lists".
4. Or directly paste the token address:
   - In the search box, paste:
     ```
     0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
     ```
5. Select FSFOX.

---

### Step 2: Adding PAXG

1. In the other "Select a token" section.
2. Enter PAXG address:
   ```
   0x553d3D295e0f695B9228246232eDF400ed3560B5
   ```
3. Select PAXG.

---

## 📋 Official Addresses

### FSFOX:
```
0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
```

**Polygonscan:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B

---

### PAXG (Paxos Gold):
```
0x553d3D295e0f695B9228246232eDF400ed3560B5
```

**Polygonscan:** https://polygonscan.com/address/0x553d3D295e0f695B9228246232eDF400ed3560B5

---

## 🔄 Complete Swap Steps

### 1. Open QuickSwap

Go to https://quickswap.exchange/swap

### 2. Connect Wallet

- Connect MetaMask.
- Or any other wallet.

### 3. Select Tokens

**Token In (From):**
- Click "Select a token".
- Enter PAXG address: `0x553d3D295e0f695B9228246232eDF400ed3560B5`
- Select PAXG.

**Token Out (To):**
- Click "Select a token".
- Enter FSFOX address: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- Select FSFOX.

### 4. Enter Amount

- Enter the amount of PAXG to swap.
- The amount of FSFOX you receive will be displayed.

### 5. Approve (First Time)

- If it's the first time, you need to Approve.
- Click "Approve PAXG".
- Confirm in MetaMask.

### 6. Swap

- Click "Swap".
- Confirm in MetaMask.
- Wait for transaction confirmation.

---

## ⚠️ Important Notes

### 1. Check Token Address

**Always verify the token address:**
- FSFOX: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- PAXG: `0x553d3D295e0f695B9228246232eDF400ed3560B5`

**⚠️ Beware of scammers!** Always verify addresses from official sources.

---

### 2. Trading Must Be Enabled

**For Swap PAXG → FSFOX:**
- `tradingEnabled` must be `true`.
- Otherwise, you will get an STF error.

**Check Status:**
```bash
npx hardhat run scripts/checkPresaleState.js --network polygon
```

---

### 3. Sufficient Balance

- Ensure you have sufficient PAXG.
- Ensure you have sufficient MATIC for Gas.

---

## 🔗 Useful Links

- **QuickSwap Swap:** https://quickswap.exchange/swap
- **FSFOX Contract:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
- **PAXG Contract:** https://polygonscan.com/address/0x553d3D295e0f695B9228246232eDF400ed3560B5
- **Pool FSFOX/PAXG:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988

---

## 💡 Visual Guide

### Step 1: Open QuickSwap
1. Go to https://quickswap.exchange/swap
2. Connect wallet.

### Step 2: Select FSFOX
1. Click "Select a token".
2. In the search box, enter FSFOX address:
   ```
   0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
   ```
3. Select FSFOX.

### Step 3: Select PAXG
1. Click "Select a token" again.
2. In the search box, enter PAXG address:
   ```
   0x553d3D295e0f695B9228246232eDF400ed3560B5
   ```
3. Select PAXG.

### Step 4: Swap
1. Enter PAXG amount.
2. Approve (if needed).
3. Swap.

---

## 🆘 Troubleshooting

### Issue 1: Token Not Found

**Solution:**
- Paste the address directly (no extra spaces).
- Ensure you are on Polygon network.
- Clear browser cache.

---

### Issue 2: STF Error

**Cause:** Trading is disabled.

**Solution:**
- Enable `enableTrading()`.
- Or use USDC Pool (if allowed).

---

### Issue 3: Price Not Shown

**Cause:** Low Pool Liquidity or Pool not found.

**Solution:**
- Ensure FSFOX/PAXG Pool exists.
- Pool Address: `0x375c88e92b60e6eafA2369C51065117603B22988`

---

## 📝 Summary

1. **FSFOX:** Enter `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
2. **PAXG:** Enter `0x553d3D295e0f695B9228246232eDF400ed3560B5`
3. **Swap:** Enter amount and Swap.

**⚠️ Reminder:** Trading must be enabled (`tradingEnabled = true`).

---

**For more questions, refer to other docs!**

