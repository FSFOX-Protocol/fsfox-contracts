# Guide to Partner Token Distribution

**Date:** 2025-11-01

---

## 📊 Current Token Status

- **Total Supply:** 1,000,000 FSFOX
- **Free Tokens:** 50,000 FSFOX (in Safe/Owner)
- **Locked Tokens:** 950,000 FSFOX (Locked in contract)
- **Pool:** ~49,000 FSFOX (For user trading)
- **Safe Balance:** ~0 FSFOX (After adding Liquidity)

---

## 🎯 Solutions for Partner Distribution

### Method 1: Use Locked Tokens (Recommended)

If Safe does not have enough balance, you can use Locked Tokens.

#### Step 1: Unlock Tokens with `unlockTokens()`

**Function:**
```solidity
function unlockTokens(uint256 amount) external onlyOwner
```

**Example:**
If you want to give 100,000 FSFOX to partners:
- Amount: `100000 * 10^18` (with decimals)

#### Step 2: Transfer to Partners with `transfer()`

After unlocking, you can transfer to partners.

---

### Method 2: Directly from Safe (If sufficient balance)

If Safe has balance, you can transfer directly.

---

## 🔧 Execution Steps

### Step 1: Unlock Locked Tokens

#### From Gnosis Safe:

1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
2. **Function:** `unlockTokens(uint256 amount)`
3. **Amount:** Amount in wei (e.g., for 100,000 tokens: `100000000000000000000000`)

**Example:**
- To unlock 100,000 FSFOX:
  - Amount: `100000 * 10^18 = 100000000000000000000000`

**Or via Transaction Builder:**
1. Toggle "Custom data" OFF
2. ABI:
   ```json
   [{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"unlockTokens","outputs":[],"stateMutability":"nonpayable","type":"function"}]
   ```
3. Function: `unlockTokens`
4. Amount: `100000000000000000000000` (100,000 FSFOX)
5. Submit → Sign → Execute

---

### Step 2: Transfer to Partners

After unlocking, tokens will be in Safe. Now you can transfer to partners.

#### From Gnosis Safe:

1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
2. **Function:** `transfer(address to, uint256 amount)`
3. **To:** Partner Address
4. **Amount:** Amount in wei

**Example:**
- To give 50,000 FSFOX to a partner:
  - To: `0x1234...5678` (Partner Address)
  - Amount: `50000000000000000000000` (50,000 FSFOX)

**Or via Transaction Builder:**
1. Toggle "Custom data" OFF
2. ABI:
   ```json
   [{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
   ```
3. Function: `transfer`
4. To: Partner Address
5. Amount: Amount in wei
6. Submit → Sign → Execute

---

### Use Script (Easier Way)

You can write a Script to do everything:

```javascript
// unlockTokens + transfer
const amount = ethers.parseUnits("100000", 18); // 100,000 FSFOX

// Step 1: Unlock
await fsfox.unlockTokens(amount);

// Step 2: Transfer to partners
const partners = [
  { address: "0x...", amount: ethers.parseUnits("50000", 18) },
  { address: "0x...", amount: ethers.parseUnits("50000", 18) }
];

for (const partner of partners) {
  await fsfox.transfer(partner.address, partner.amount);
}
```

---

## 📋 Checklist

Before starting:

- [ ] Calculate required token amount
- [ ] Have partner addresses ready
- [ ] Check if `lockedTokens` is sufficient
- [ ] Check if Owner = Safe

Steps:

- [ ] Run `unlockTokens()`
- [ ] Wait for transaction confirmation
- [ ] Check Safe balance
- [ ] Run `transfer()` for each partner
- [ ] Verify transactions

---

## ⚠️ Important Notes

### 1. Presale Restrictions:

Currently `tradingEnabled = false`, but:
- ✅ **Owner can transfer:** From Owner to any address
- ✅ **Transfer from Owner is allowed**

**Contract Code:**
```solidity
if (from != owner && to != owner) {
    // Restrictions
}
```

**Result:** Owner can transfer to any address, even in Presale.

---

### 2. Locked Token Amount:

- **Locked:** 950,000 FSFOX
- **Already Used:** ~1,000 FSFOX (For Liquidity)
- **Current Locked Balance:** ~949,000 FSFOX

**Note:** You can only unlock up to `lockedTokens`.

---

### 3. Decimals:

Always remember tokens have 18 decimals:
- `1 FSFOX = 1 * 10^18 wei`
- `100,000 FSFOX = 100000 * 10^18 = 100000000000000000000000 wei`

---

### 4. Gas Fees:

- Each `unlockTokens()` requires Gas
- Each `transfer()` requires Gas
- For multiple partners, consider using Batch Transaction

---

## 🔄 Complete Example

Suppose you want to:
- Give **100,000 FSFOX** to **3 Partners**:
  - Partner 1: 40,000 FSFOX
  - Partner 2: 35,000 FSFOX
  - Partner 3: 25,000 FSFOX

### Step 1: Unlock

```
Function: unlockTokens
Amount: 100000000000000000000000 (100,000 FSFOX)
```

### Step 2: Transfers

**Transfer 1:**
```
Function: transfer
To: 0x... (Partner 1)
Amount: 40000000000000000000000 (40,000 FSFOX)
```

**Transfer 2:**
```
Function: transfer
To: 0x... (Partner 2)
Amount: 35000000000000000000000 (35,000 FSFOX)
```

**Transfer 3:**
```
Function: transfer
To: 0x... (Partner 3)
Amount: 25000000000000000000000 (25,000 FSFOX)
```

---

## 🛠️ Script for Auto Distribution

If desired, I can write a Script that:
1. Checks current balance
2. Runs `unlockTokens()`
3. Transfers to all partners
4. Shows result

**Note:** Script requires Private Key or Gnosis Safe Signature.

---

## 📞 FAQ

### Q: Can I transfer directly from Locked Tokens?

**A:** No. You must first call `unlockTokens()` to move tokens to Safe.

### Q: Is there a limit on the number of partners?

**A:** No. You can transfer to as many partners as you want.

### Q: Can I unlock all locked tokens?

**A:** Yes, but it's recommended to unlock gradually for better control.

### Q: Can I transfer after `enableTrading()`?

**A:** Yes, there are no transfer restrictions after `enableTrading()`.

---

## ✅ Summary

**To give tokens to partners:**

1. **`unlockTokens(amount)`** → Tokens move to Safe
2. **`transfer(partnerAddress, amount)`** → Tokens move to partners

**Restrictions:**
- Only Owner can do this
- Can only unlock up to `lockedTokens`
- Owner can transfer even in Presale

---

**For more help or creating a Script, let me know!**

