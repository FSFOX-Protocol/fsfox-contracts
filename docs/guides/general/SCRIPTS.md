# Comprehensive Guide to All Scripts

**Date:** 2025-11-01

---

## 📚 Script Index

### 🔧 Operational Scripts (Deployment & Setup)

#### 1. deploy.js
**Goal:** Deploy FSFOX contract on Polygon.

**Usage:**
```bash
npx hardhat run scripts/deploy.js --network polygon
```

**Functionality:**
- Deploys new FSFOX contract.
- Sets Owner (Safe).
- Distributes tokens (Free + Locked).

**Notes:**
- Requires PRIVATE_KEY in `.env`.
- Set Owner to Safe.

---

#### 2. deployNewOwner.js
**Goal:** Deploy contract with a new Owner.

**Usage:**
```bash
npx hardhat run scripts/deployNewOwner.js --network polygon
```

**Functionality:**
- Deploys contract with specified Owner.

---

#### 3. createPool.js
**Goal:** Create Uniswap V3 Pool.

**Usage:**
```bash
npx hardhat run scripts/createPool.js --network polygon
```

**Functionality:**
- Creates FSFOX/USDC Pool.
- Initializes Pool with initial price.
- Required only once.

**Notes:**
- Pool: `0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF`

---

### 💰 Buy/Sell Scripts

#### 4. buyFSFOX.js
**Goal:** Buy FSFOX directly from Pool (No Uniswap UI needed).

**Usage:**
```bash
npx hardhat run scripts/buyFSFOX.js --network polygon
```

**Functionality:**
- Buys FSFOX with USDC.
- Uses SwapRouter directly.
- Does not require Uniswap API.

**Settings:**
- Change USDC amount in Script (Default: 1 USDC).

**Notes:**
- Approves USDC (if needed).
- Slippage: 5%.

---

#### 5. retryBuyWithHigherGas.js
**Goal:** Retry stuck transaction with higher Gas.

**Usage:**
```bash
npx hardhat run scripts/retryBuyWithHigherGas.js --network polygon
```

**Functionality:**
- If transaction is stuck in "pending".
- Increases Gas by 50%.
- Replaces transaction.

**Notes:**
- Cancels old transaction.
- New Gas: 150% of previous.

---

#### 6. testSwapDirect.js
**Goal:** Direct Swap Test.

**Usage:**
```bash
npx hardhat run scripts/testSwapDirect.js --network polygon
```

**Functionality:**
- Tests direct Swap.
- Checks Pool performance.

---

### 💧 Liquidity Scripts

#### 7. addLiquidity.js
**Goal:** Add Liquidity to Pool.

**Usage:**
```bash
npx hardhat run scripts/addLiquidity.js --network polygon
```

**Settings:**
```javascript
const AMOUNT_USDC = "40"; // USDC Amount
const AMOUNT_FSFOX = "";  // Empty = Auto-calculate
```

**Features:**
- ✅ Auto-calculates FSFOX (if empty).
- ✅ Checks Pool ratio.
- ✅ Auto Approve.
- ✅ Adds Liquidity.

**Notes:**
- Requires USDC and FSFOX balance in Safe.
- Auto-maintains Pool ratio.

---

#### 8. generateLiquidityCalldata.js
**Goal:** Generate Calldata for adding Liquidity (for Safe).

**Usage:**
```bash
npx hardhat run scripts/generateLiquidityCalldata.js --network polygon
```

**Functionality:**
- Generates Calldata for 3 transactions:
  1. Approve USDC
  2. Approve FSFOX
  3. Mint (Add Liquidity)

**Settings:**
```javascript
const AMOUNT_USDC = "40";
const AMOUNT_FSFOX = ""; // Empty = Auto-calculate
```

**Notes:**
- For use in Gnosis Safe.
- Paste Calldata in Safe.

---

### 📊 Status Check Scripts

#### 9. checkPoolStatus.js
**Goal:** Check Pool Status.

**Usage:**
```bash
npx hardhat run scripts/checkPoolStatus.js --network polygon
```

**Output:**
- Pool Balance (USDC + FSFOX).
- Safe Balance.
- Allowance for NPM.

**Functionality:**
- Before adding Liquidity.
- Checks balances.

---

#### 10. checkPoolRatio.js
**Goal:** Check Pool Price Ratio.

**Usage:**
```bash
npx hardhat run scripts/checkPoolRatio.js --network polygon
```

**Output:**
- Current Pool Ratio (FSFOX/USDC).
- Suggestions for new amounts.

**Functionality:**
- Before adding Liquidity.
- To maintain price ratio.

---

#### 11. checkPresaleState.js
**Goal:** Check Presale State.

**Usage:**
```bash
npx hardhat run scripts/checkPresaleState.js --network polygon
```

**Output:**
- `tradingEnabled`
- Pool in allowlist?
- SwapRouter in allowedSpenders?

**Functionality:**
- Check Presale settings.
- Troubleshooting.

---

#### 12. checkUniswapAPI.js
**Goal:** Check Pool availability in Uniswap API.

**Usage:**
```bash
npx hardhat run scripts/checkUniswapAPI.js --network polygon
```

**Output:**
- Pool in Subgraph?
- Pool status on blockchain.
- Suggestions.

**Functionality:**
- If 404 error in Uniswap UI.
- Check Index status.

---

#### 13. checkWallet.js
**Goal:** Check Wallet and Settings.

**Usage:**
```bash
npx hardhat run scripts/checkWallet.js --network polygon
```

**Output:**
- Wallet Address.
- Balance.
- Is Owner?

**Functionality:**
- Before running Scripts.
- Check PRIVATE_KEY.

---

#### 14. checkSetSpender.js
**Goal:** Check Allowance for Spenders.

**Usage:**
```bash
npx hardhat run scripts/checkSetSpender.js --network polygon
```

**Functionality:**
- Check NPM in allowedSpenders.
- Check SwapRouter in allowedSpenders.

---

#### 15. checkOldContracts.js
**Goal:** Check old (deprecated) addresses.

**Usage:**
```bash
npx hardhat run scripts/checkOldContracts.js --network polygon
```

**Functionality:**
- List of old addresses.
- Old contract info.

---

### 🎁 Distribution Scripts

#### 16. distributeToPartners.js
**Goal:** Distribute tokens to partners.

**Usage:**
```bash
npx hardhat run scripts/distributeToPartners.js --network polygon
```

**Settings:**
```javascript
const PARTNERS = [
  { address: "0x...", amount: "10000" },
  { address: "0x...", amount: "20000" }
];
```

**Features:**
- ✅ Check balance.
- ✅ Auto Unlock (if needed).
- ✅ Transfer to all partners.
- ✅ Result report.

**Notes:**
- Requires FSFOX balance in Safe.
- Or use unlockTokens().

---

### 🔧 Helper Scripts

#### 17. generateMintCalldata.js
**Goal:** Generate Calldata for Mint (Add Liquidity).

**Usage:**
```bash
npx hardhat run scripts/generateMintCalldata.js --network polygon
```

**Functionality:**
- Generates Calldata for Safe.
- Only Mint (No Approve).

---

#### 18. prepareSafeCalldata.js
**Goal:** Generate Calldata for Safe (setPool + Approve + Mint).

**Usage:**
```bash
npx hardhat run scripts/prepareSafeCalldata.js --network polygon
```

**Functionality:**
- Generates Calldata for all transactions.
- For initial use.

---

#### 19. transferOwnership.js
**Goal:** Check Transfer Ownership possibility.

**Usage:**
```bash
npx hardhat run scripts/transferOwnership.js --network polygon
```

**Notes:**
- Owner in contract is immutable.
- Ownership cannot be transferred.

---

#### 20. testBuySell.js
**Goal:** Test Buy and Sell.

**Usage:**
```bash
npx hardhat run scripts/testBuySell.js --network polygon
```

**Functionality:**
- Test BUY.
- Test SELL - Only after enableTrading().

---

## 📋 Script Categories

### 🚀 Deployment & Setup:
- `deploy.js`
- `deployNewOwner.js`
- `createPool.js`

### 💰 Buy/Sell:
- `buyFSFOX.js`
- `retryBuyWithHigherGas.js`
- `testSwapDirect.js`
- `testBuySell.js`

### 💧 Liquidity:
- `addLiquidity.js`
- `generateLiquidityCalldata.js`
- `generateMintCalldata.js`
- `prepareSafeCalldata.js`

### 📊 Status Check:
- `checkPoolStatus.js`
- `checkPoolRatio.js`
- `checkPresaleState.js`
- `checkUniswapAPI.js`
- `checkWallet.js`
- `checkSetSpender.js`
- `checkOldContracts.js`

### 🎁 Distribution:
- `distributeToPartners.js`

### 🔧 Helper:
- `transferOwnership.js`

---

## ⚙️ Common Settings

### `.env` File:
```env
PRIVATE_KEY=your_private_key
POLYGON_RPC_URL=https://polygon-rpc.com
POLYGONSCAN_API_KEY=your_api_key
```

### Network:
- **Polygon:** `--network polygon`
- **Amoy (Testnet):** `--network amoy`

---

## 📝 Important Notes

### 1. PRIVATE_KEY:
- Required for operational Scripts.
- Put in `.env`.
- Never commit.

### 2. Owner vs Safe:
- Owner = Safe (`0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130`)
- Some Scripts require Owner.
- You can use Safe Transaction Builder.

### 3. Balance:
- Check balance before execution.
- Use `checkPoolStatus.js`.

### 4. Gas Fees:
- Ensure sufficient Balance.
- For Polygon, MATIC is required.

---

## 🎯 Recommended Scripts to Start

### For Status Check:
```bash
# General Check
npx hardhat run scripts/checkPoolStatus.js --network polygon

# Check Ratio
npx hardhat run scripts/checkPoolRatio.js --network polygon
```

### For Buying:
```bash
# Direct Buy
npx hardhat run scripts/buyFSFOX.js --network polygon
```

### For Adding Liquidity:
```bash
# Generate Calldata (for Safe)
npx hardhat run scripts/generateLiquidityCalldata.js --network polygon

# Or Direct (if Owner)
npx hardhat run scripts/addLiquidity.js --network polygon
```

---

## 🔗 Related Links

- **User Guide:** `docs/USER_GUIDE.md`
- **Official Info:** `docs/OFFICIAL_INFO.md`
- **Safe Guide:** `docs/GNOSIS_SAFE_TRANSACTIONS.md`
- **Liquidity Guide:** `docs/INCREASE_LIQUIDITY_GUIDE.md`

---

**For more info about each Script, check the Script file itself!**

