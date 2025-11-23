# Guide to Enabling PAXG Buy Without Sell

**Date:** 2025-11-08

---

## ❌ Problem: Current Contract Limitation

### Current Status:

- ✅ **Buy with USDC:** Enabled
- ❌ **Buy with PAXG:** Disabled
- ❌ **Sell FSFOX:** Disabled

### Request:

- ✅ **Buy with USDC:** Remain enabled
- ✅ **Buy with PAXG:** Enable
- ❌ **Sell FSFOX:** Remain disabled

---

## 🔍 Problem Analysis

### Why Buying with PAXG doesn't work?

In Presale Mode (`tradingEnabled = false`):

**The contract can only distinguish between:**
- ✅ **Pool → User (FSFOX):** Buying allowed
- ❌ **User → Pool (FSFOX):** Selling prohibited

**For Buying with PAXG:**
- User → Pool (PAXG): This is a **"User → Pool"** ❌
- Pool → User (FSFOX): This is a **"Pool → User"** ✅

**Issue:**
The contract cannot distinguish that:
- `User → Pool (PAXG)` = Buying FSFOX with PAXG ✅
- `User → Pool (FSFOX)` = Selling FSFOX ❌

**Both involve `User → Pool` and are prohibited in Presale mode!**

---

## 💡 Possible Solutions

### Solution 1: ❌ Change Contract (Impossible)

FSFOX Contract is **immutable** and cannot be changed.

---

### Solution 2: ❌ SwapRouter in allowedSpenders (Doesn't work)

`allowedSpenders` only works for **FSFOX**, not **PAXG**.

When SwapRouter tries to take PAXG from User:
- This is a **PAXG** transaction (not FSFOX)
- `allowedSpenders` only applies to FSFOX
- So it won't work ❌

---

### Solution 3: ✅ Custom Router (Complex)

Create a Custom Router that:
1. Takes PAXG from User
2. Pulls FSFOX from Pool
3. Gives to User

**Issues:**
- Requires deploying new contract
- Requires Audit
- Complex and costly

---

### Solution 4: ✅ enableTrading() (Easiest)

Enable `enableTrading()` which:
- ✅ Keeps Buy with USDC enabled
- ✅ Enables Buy with PAXG
- ❌ Enables Sell FSFOX too

**This is exactly what you don't want!**

---

## 🎯 Recommendation

### Option 1: Use USDC (Recommended)

Users can:
1. Convert PAXG to USDC (on QuickSwap)
2. Buy FSFOX with USDC (from FSFOX/USDC Pool)

**Pros:**
- ✅ No contract change
- ✅ No enabling Sell
- ✅ Simple and fast

---

### Option 2: Custom Router

If you really want Buy with PAXG without Sell:

1. Create a Custom Router
2. Deploy
3. Audit
4. Give to users

**Cost:** High  
**Time:** Long  
**Complexity:** High

---

### Option 3: enableTrading() (If Selling is OK)

If Selling FSFOX is acceptable:

1. Enable `enableTrading()`
2. Users can buy with USDC and PAXG
3. Users can sell

**Easiest Solution!**

---

## 📊 Comparison of Solutions

| Solution | Complexity | Cost | Time | Sell Enabled? |
|---|---|---|---|---|
| Use USDC | ✅ Low | ✅ Free | ✅ Immediate | ❌ No |
| Custom Router | ❌ High | ❌ High | ❌ Long | ❌ No |
| enableTrading() | ✅ Low | ✅ Free | ✅ Immediate | ✅ Yes |

---

## 💡 Conclusion

**With the current contract, you cannot enable Buy with PAXG without enabling Sell.**

**Best Solution:**
- Users convert PAXG to USDC
- Buy FSFOX with USDC

**Or:**
- If Selling is OK, enable `enableTrading()`

---

## 🔗 Useful Links

- **USDC Pool:** https://polygonscan.com/address/0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF
- **PAXG Pool:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **QuickSwap:** https://quickswap.exchange/swap

---

**For more questions, check `FSFOXToken.sol` contract!**

