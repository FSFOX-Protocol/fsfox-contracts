# Guide to Transferring NFT Positions to Safe

**Date:** 2025-11-01

---

## 📊 Current Status

### NFT Positions in Safe:
- ✅ **NFT #2740509:** FSFOX/USDC Pool
- ✅ **NFT #2743939:** FSFOX/USDC Pool

### NFT Positions Outside Safe:
- ❓ If you have NFTs in another wallet, locate them.

---

## 🔍 Step 1: Locate NFTs

### Method 1: Use Script

```bash
npx hardhat run scripts/findAllNFTs.js --network polygon
```

This script finds all FSFOX-related NFTs.

---

### Method 2: Use Polygonscan

1. Go to https://polygonscan.com
2. Search for the wallet address holding the NFT.
3. Go to **Token** → **ERC-721 Token Txns**.
4. Find NFTs related to NPM:
   - **Contract:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`

---

## 🚀 Step 2: Transfer NFTs

### Option 1: Use Script (If NFT is in Signer Wallet)

#### 1. Configure Script:

Open `scripts/transferNFTsToSafe.js` and set:

```javascript
const NFT_TOKEN_IDS = [
  "2740509",  // Example: Token IDs to transfer
  "2743939",
];
```

#### 2. Run Script:

```bash
npx hardhat run scripts/transferNFTsToSafe.js --network polygon
```

**Note:** Only works if NFTs are in the Signer's address.

---

### Option 2: Use Gnosis Safe Transaction Builder (Recommended)

If NFTs are in another wallet or you want to use Safe:

#### 1. Generate Calldata:

Open `scripts/generateTransferNFTCalldata.js` and set:

```javascript
const NFT_TOKEN_IDS = [
  "2740509",  // Token IDs
  "2743939",
];

const CURRENT_OWNER = "0x...";  // Wallet address holding the NFT
```

#### 2. Run Script:

```bash
npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon
```

#### 3. Use Calldata in Safe:

1. Go to https://app.safe.global
2. Select Polygon network.
3. Select Safe: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
4. **New Transaction** → **Contract interaction**

**For each NFT:**
- **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
- **Value:** `0`
- **Data:** Paste generated Calldata
- **Submit** → Sign → **Execute**

---

### Option 3: Use MetaMask (If NFT is in MetaMask)

#### 1. Connect to OpenSea or Uniswap:

- **OpenSea:** https://opensea.io/assets/matic/0xC36442b4a4522E871399CD717aBDD847Ab11FE88/[TOKEN_ID]
- **Uniswap:** https://app.uniswap.org/#/pool

#### 2. Transfer NFT:

1. Find NFT.
2. Click **Transfer**.
3. Enter Safe Address: `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`
4. Confirm.

---

## 📋 Complete Steps (Gnosis Safe)

### Step 1: Find NFT Token ID

Use `findAllNFTs.js` or check Polygonscan.

### Step 2: Generate Calldata

```bash
npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon
```

### Step 3: Use in Safe Transaction Builder

For each NFT:

1. **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
2. **Value:** `0`
3. **Data:** Generated Calldata

### Step 4: Submit → Sign → Execute

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

- **Safe:** https://polygonscan.com/address/0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130
- **NPM:** https://polygonscan.com/address/0xC36442b4a4522E871399CD717aBDD847Ab11FE88
- **NFT #2740509:** https://polygonscan.com/token/0xC36442b4a4522E871399CD717aBDD847Ab11FE88?a=2740509
- **NFT #2743939:** https://polygonscan.com/token/0xC36442b4a4522E871399CD717aBDD847Ab11FE88?a=2743939

---

## 📝 Example

### If NFT #1234567 is in `0x1E51...A992`:

#### 1. Configure Script:

```javascript
const NFT_TOKEN_IDS = ["1234567"];
const CURRENT_OWNER = process.env.CURRENT_NFT_OWNER || "0xYourCurrentOwnerAddress";
```

#### 2. Run:

```bash
npx hardhat run scripts/generateTransferNFTCalldata.js --network polygon
```

#### 3. Use in Safe:

- **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88`
- **Data:** Generated Calldata

---

**For more questions, check the Scripts!**

