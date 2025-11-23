# Guide to Transferring FSFOX/PAXG Pool Ownership to Safe

**Date:** 2025-11-01

---

## 📊 Current Status

### FSFOX/PAXG Pool:
- ✅ Created: `0x375c88e92b60e6eafA2369C51065117603B22988`
- ✅ Initialized
- ✅ Has Liquidity (0.011485 PAXG + 43,261.74 FSFOX)
- ❌ NFT Position is NOT in Safe

### Important Note:
**The Pool itself has no owner!** Pool ownership is managed via the **NFT Position**. To transfer Pool ownership, you must transfer the **NFT Position** to the Safe.

---

## 🔍 Step 1: Find NFT Position

### Method 1: Use Polygonscan (Recommended)

#### 1. Check Pool Transactions:

1. Go to https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
2. Go to **"Events"** or **"Transactions"** tab.
3. Find the **"Mint"** transaction (the one that added Liquidity).
4. In **Logs**, find the **"Transfer"** event.
5. **Token ID** is in the `tokenId` parameter.

#### 2. Check NPM Contract:

1. Go to https://polygonscan.com/address/0xC36442b4a4522E871399CD717aBDD847Ab11FE88
2. Go to **"Events"** tab.
3. Filter for **"Transfer"** events.
4. **"from"** should be `0x0000...` (mint event).
5. Find the **Token ID**.

---

### Method 2: Use Script

```bash
npx hardhat run scripts/findPAXGNFT.js --network polygon
```

This script checks for NFT Position in Safe.

---

## 🚀 Step 2: Transfer NFT Position to Safe

### Option 1: Use Gnosis Safe Transaction Builder (Recommended)

#### 1. Generate Calldata:

Open `scripts/generateTransferNFTCalldata.js` and configure:

```javascript
const NFT_TOKEN_IDS = [
  "1234567",  // Token ID you found
];

const CURRENT_OWNER = "0x...";  // Wallet address holding the NFT
```

#### 2. Run Script:

```bash
npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon
```

#### 3. Use in Safe:

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select your Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
4. **New Transaction** → **Contract interaction**

**Settings:**
- **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
- **Value:** `0`
- **Data:** Paste generated Calldata

#### 4. Submit → Sign → Execute

---

### Option 2: Use MetaMask (If NFT is in MetaMask)

#### 1. Connect to OpenSea:

- **OpenSea:** https://opensea.io/assets/matic/0xC36442b4a4522E871399CD717aBDD847Ab11FE88/[TOKEN_ID]

#### 2. Transfer NFT:

1. Find NFT.
2. Click **Transfer**.
3. Enter Safe Address: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
4. Confirm.

---

## 📋 Complete Steps (Example)

### Suppose NFT #1234567 is at `0xYourCurrentOwnerAddress`:

#### 1. Configure Script:

```javascript
// in scripts/generateTransferNFTCalldata.js
const NFT_TOKEN_IDS = ["1234567"];
const CURRENT_OWNER = process.env.CURRENT_NFT_OWNER || "0xYourCurrentOwnerAddress";
```

#### 2. Run:

```bash
npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon
```

#### 3. Output:

```
🔹 Transaction 1: Transfer NFT #1234567
   To: 0xC36442b4a4522E871399CD717aBDD847Ab11FE88
   Value: 0
   Data: 0x42842e0e0000000000000000000000001E51ba8f393b932D8A72aAec8e0aa3541aa4A9920000000000000000000000005Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB13000000000000000000000000000000000000000000000000000000000012d687
```

#### 4. Use in Safe:

- **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- **Data:** `0x42842e0e0000000000000000000000001E51ba8f393b932D8A72aAec8e0aa3541aa4A9920000000000000000000000005Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB13000000000000000000000000000000000000000000000000000000000012d687`

---

## ⚠️ Important Notes

### 1. Approve:

Before transfer, you must Approve the NFT:
- If in MetaMask, Approve from MetaMask.
- If in Safe, Approve from Safe.

### 2. Owner:

Only the NFT Owner can transfer it.

### 3. Gas:

Transferring NFTs requires Gas (MATIC).

---

## 🔗 Useful Links

- **Pool:** https://polygonscan.com/address/0x375c88e92b60e6eafA2369C51065117603B22988
- **Safe:** https://polygonscan.com/address/0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130
- **NPM:** https://polygonscan.com/address/0xC36442b4a4522E871399CD717aBDD847Ab11FE88
- **NPM Events:** https://polygonscan.com/address/0xC36442b4a4522E871399CD717aBDD847Ab11FE88#events

---

## 📝 Summary

1. **Find NFT Token ID:** Use Polygonscan or Script.
2. **Find Owner:** Use Polygonscan or Script.
3. **Generate Calldata:** Use `generateTransferNFTCalldata.js`.
4. **Transfer:** Use Gnosis Safe Transaction Builder.

---

**After transfer, the NFT Position is in Safe and you own the FSFOX/PAXG Pool!**

