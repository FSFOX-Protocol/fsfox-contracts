# Guide to Using Gnosis Safe with Scripts

**Date:** 2025-11-01

---

## ⚠️ Important: Gnosis Safe has no Private Key!

**Gnosis Safe is a Multi-sig Wallet:**
- ✅ Uses multiple Signers.
- ✅ Has no central Private Key.
- ✅ Each Signer has their own Private Key.

---

## 🔧 Solutions:

### Solution 1: Use a Signer's Private Key (Easiest)

If you are one of the Safe Signers:

1. **Put your Signer Private Key in `.env`:**
   ```env
   PRIVATE_KEY=your_signer_private_key_here
   ```

2. **Run the Script:**
   ```bash
   npx hardhat run scripts/addLiquidity.js --network polygon
   ```

**⚠️ Note:** The script must check the Signer as an Owner. If your Signer is not the Owner:
- You can perform transactions manually via Safe Transaction Builder.
- Or change the Owner (but the Owner in the contract is immutable).

---

### Solution 2: Use Safe Transaction Builder (Recommended)

Since the script requires a Private Key, you can perform transactions via Safe:

#### Step 1: Approve USDC

1. Go to Gnosis Safe: https://app.safe.global
2. Select your Safe.
3. **New Transaction** → **Contract interaction**.
4. **To:** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` (USDC)
5. Toggle "Custom data" to OFF.
6. ABI:
   ```json
   [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
   ```
7. Function: `approve`
8. **spender:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
9. **amount:** USDC Amount (with 6 decimals, e.g., for 40 USDC: `40000000`)
10. Submit → Sign → Execute

#### Step 2: Approve FSFOX

1. **New Transaction** → **Contract interaction**
2. **To:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
3. Toggle "Custom data" to OFF.
4. ABI:
   ```json
   [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
   ```
5. Function: `approve`
6. **spender:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
7. **amount:** FSFOX Amount (with 18 decimals)
8. Submit → Sign → Execute

#### Step 3: Mint (Add Liquidity)

1. **New Transaction** → **Contract interaction**
2. **To:** `0xC36442b4a4522E871399CD717aBDD847Ab11FE88` (NPM)
3. Toggle "Custom data" to OFF.
4. ABI:
   ```json
   [{"inputs":[{"components":[{"internalType":"address","name":"token0","type":"address"},{"internalType":"address","name":"token1","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"int24","name":"tickLower","type":"int24"},{"internalType":"int24","name":"tickUpper","type":"int24"},{"internalType":"uint256","name":"amount0Desired","type":"uint256"},{"internalType":"uint256","name":"amount1Desired","type":"uint256"},{"internalType":"uint256","name":"amount0Min","type":"uint256"},{"internalType":"uint256","name":"amount1Min","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"internalType":"struct INonfungiblePositionManager.MintParams","name":"params","type":"tuple"}],"name":"mint","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint128","name":"liquidity","type":"uint128"},{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"payable","type":"function"}]
   ```
5. Function: `mint`
6. Parameters:
   - **token0:** `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` (USDC)
   - **token1:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B` (FSFOX)
   - **fee:** `3000` (0.3%)
   - **tickLower:** `-887220`
   - **tickUpper:** `887220`
   - **amount0Desired:** USDC Amount (with 6 decimals)
   - **amount1Desired:** FSFOX Amount (with 18 decimals)
   - **amount0Min:** `0`
   - **amount1Min:** `0`
   - **recipient:** `0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130` (Safe address)
   - **deadline:** Unix timestamp (1 hour from now)
7. Submit → Sign → Execute

---

### Solution 3: Use Scripts to Generate Calldata

You can modify the Script to only generate Calldata (without executing):

```javascript
// Displays Calldata only
console.log("Calldata for Safe:");
console.log("To:", NPM);
console.log("Data:", mintCalldata);
```

Then use this Calldata in Safe.

---

### Solution 4: Use Safe SDK

If you want to use Safe SDK (More complex):

```javascript
const safeSdk = await Safe.create({
  ethAdapter: new EthersAdapter({ ethers, signer }),
  safeAddress: SAFE_ADDRESS
});

const safeTransaction = await safeSdk.createTransaction({
  safeTransactionData: {
    to: NPM,
    value: '0',
    data: mintCalldata
  }
});

await safeSdk.signTransaction(safeTransaction);
await safeSdk.executeTransaction(safeTransaction);
```

---

## 🎯 Recommendation:

### For Simple Usage:

1. **Use a Signer's Private Key** (If you are an Owner).
2. **Or use Safe Transaction Builder** (If you are not an Owner).

### Check if your Signer is an Owner:

```bash
# Check Owner
node -e "
const { ethers } = require('ethers');
const FSFOX = '0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B';
const SAFE = '0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130';
(async () => {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  const fsfox = new ethers.Contract(FSFOX, ['function owner() view returns (address)'], provider);
  const owner = await fsfox.owner();
  console.log('Owner:', owner);
  console.log('Safe:', SAFE);
  console.log('Match:', owner.toLowerCase() === SAFE.toLowerCase());
})();
"
```

---

## ⚠️ Security Notes:

1. **NEVER commit Private Key** (Add to `.gitignore`).
2. **Use Environment Variables** (`.env` file).
3. **NEVER share Private Key with anyone**.
4. **Use Hardware Wallet** (More secure).

---

## 📝 Summary:

- ✅ Gnosis Safe has no Private Key.
- ✅ Use a Signer's Private Key (if Owner).
- ✅ Or use Safe Transaction Builder.
- ✅ Or modify Script to generate Calldata.

---

**For more help, please clarify if you are an Owner or one of the Signers?**

