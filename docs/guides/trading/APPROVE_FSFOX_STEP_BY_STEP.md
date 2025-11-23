# Step-by-Step Guide to Approve FSFOX in Gnosis Safe

**Date:** 2025-11-01

---

## 📋 Required Information:

- **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
- **Function:** `approve`
- **Spender:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
- **Amount:** `42293900000000000000000` (42,293.9 FSFOX)

---

## 🎯 Detailed Steps:

### Step 1: Go to Safe

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select your Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`

---

### Step 2: Create New Transaction

1. Click **"New transaction"** or **"Create transaction"**.
2. Select **"Contract interaction"**.

---

### Step 3: Enter Information

1. **To (Contract address):**
   ```
   0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
   ```
   (FSFOX Address)

2. **Toggle "Custom data":**
   - Turn this toggle **OFF**.
   - If ON, you must enter ABI manually.
   - If OFF, Safe parses ABI automatically.

---

### Step 4: Enter ABI

1. Click **"ABI"** or **"Contract ABI"**.
2. Paste this ABI:
   ```json
   [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
   ```

---

### Step 5: Select Function

1. After pasting ABI, a dropdown or list of Functions appears.
2. Select **`approve`**.

---

### Step 6: Enter Parameters

After selecting `approve`, two fields appear:

**1. spender (address):**
```
0xC36442b4a4522E871399CD717aBDD847Ab11FE88
```
(NPM Address - Uniswap V3 Positions NFT-V1)

**2. amount (uint256):**
```
42293900000000000000000
```
(42,293.9 FSFOX with 18 decimals)

---

### Step 7: Review and Submit

1. Review information:
   - To: FSFOX address ✅
   - Function: approve ✅
   - Spender: NPM address ✅
   - Amount: 42,293.9 FSFOX ✅

2. Click **"Submit"** or **"Create transaction"**.

---

### Step 8: Sign and Execute

1. **Sign:** Sign the transaction.
2. Wait for all Signers to sign (2 of 2).
3. **Execute:** Once signed, Execute.

---

## 🔍 If Function Does Not Appear:

### Issue: "Custom data" toggle is ON

**Solution:**
1. Turn **OFF** "Custom data".
2. Paste ABI again.
3. Function should appear.

---

### Issue: ABI not parsing

**Solution:** Enter Data directly:

1. Turn **ON** "Custom data".
2. **Data:** Paste this Calldata:
   ```
   0x095ea7b3000000000000000000000000c36442b4a4522e871399cd717abdd847ab11fe880000000000000000000000000000000000000000000008f4c1c50f50658e0000
   ```

---

## 📝 Visual Guide (Text):

### Safe Transaction Builder Screen:

```
┌─────────────────────────────────────┐
│ Contract interaction                │
├─────────────────────────────────────┤
│ To:                                  │
│ [0xe5C72a59981d3c19a74DC6144e13...] │
│                                      │
│ ☐ Custom data (OFF)                │
│                                      │
│ ABI:                                 │
│ [paste ABI here]                    │
│                                      │
│ Function:                            │
│ [approve ▼]                          │
│                                      │
│ Parameters:                          │
│ spender: [0xC36442...]              │
│ amount:  [42293900000000000000000]   │
│                                      │
│              [Submit]               │
└─────────────────────────────────────┘
```

---

## ✅ Checklist:

Before Submit:

- [ ] To: `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- [ ] Custom data: **OFF**
- [ ] ABI: Pasted
- [ ] Function: `approve` Selected
- [ ] Spender: `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- [ ] Amount: `42293900000000000000000`

---

## 🆘 If You Have Issues:

### Use Custom Data (Alternative Way):

1. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
2. **Custom data:** ON
3. **Data:**
   ```
   0x095ea7b3000000000000000000000000c36442b4a4522e871399cd717abdd847ab11fe880000000000000000000000000000000000000000000008f4c1c50f50658e0000
   ```

---

## 📊 Calldata Info:

**Calldata for Approve FSFOX:**
```
0x095ea7b3000000000000000000000000c36442b4a4522e871399cd717abdd847ab11fe880000000000000000000000000000000000000000000008f4c1c50f50658e0000
```

**Breakdown:**
- `0x095ea7b3` = Function selector for `approve`
- `0x0000...c36442...` = Spender address (NPM)
- `0x0000...08f4c1...` = Amount (42,293.9 FSFOX)

---

## 💡 Important Notes:

1. **Amount Value:**
   - Displayed: "Set FSFOX allowance to: **42293.9**"
   - This is correct! (42,293.9 FSFOX)

2. **Spender:**
   - Should display "Uniswap V3 Positions NFT-V1" or "NonfungiblePositionManager"

3. **After Approve:**
   - You can proceed to Mint (Add Liquidity)

---

## ✅ Summary:

**Steps:**
1. Safe → New Transaction → Contract interaction
2. To: FSFOX address
3. Custom data: **OFF**
4. ABI: Paste
5. Function: `approve`
6. Spender: NPM address
7. Amount: `42293900000000000000000`
8. Submit → Sign → Execute

---

**If you still have issues, please let me know at which step you are stuck!**

