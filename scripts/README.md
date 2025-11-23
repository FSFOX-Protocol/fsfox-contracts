# Scripts Organization

This directory contains all scripts organized by category.

## 📁 Directory Structure

### `deployment/`
Scripts for deploying contracts:
- `deploy.js` - Deploy FSFOX token contract
- `deployNewOwner.js` - Deploy with new owner (Gnosis Safe)

### `check/`
Scripts for checking contract/pool status:
- `checkOldContracts.js` - Check old contract addresses
- `checkPAXGNFT.js` - Check PAXG NFT positions
- `checkPAXGPoolAllowed.js` - Check if PAXG pool is in allowlist
- `checkPAXGPoolExists.js` - Check if PAXG pool exists
- `checkPAXGPoolLiquidity.js` - Check PAXG pool liquidity
- `checkPoolRatio.js` - Check pool ratio
- `checkPoolStatus.js` - Check pool status
- `checkPresaleState.js` - Check presale state
- `checkSafeBalance.js` - Check Safe balance
- `checkSetSpender.js` - Check allowed spenders
- `checkTokenStatus.js` - Check token status
- `checkUniswapAPI.js` - Check Uniswap API status
- `checkUnlockedTokens.js` - Check unlocked tokens
- `checkWallet.js` - Check wallet information

### `generate/`
Scripts for generating calldata for Safe transactions:
- `generateApproveNFTCalldata.js` - Generate approve NFT calldata
- `generateLiquidityCalldata.js` - Generate add liquidity calldata
- `generatePAXGLiquidityCalldata.js` - Generate PAXG liquidity calldata
- `generatePAXGPoolCalldata.js` - Generate PAXG pool creation calldata
- `generateTransferNFTCalldata.js` - Generate transfer NFT calldata

### `operations/`
Main operation scripts:
- `addLiquidity.js` - Add liquidity to pool
- `addPAXGLiquidity.js` - Add PAXG liquidity
- `buyFSFOX.js` - Buy FSFOX tokens
- `buyFSFOXWithPAXG.js` - Buy FSFOX with PAXG
- `createPAXGPool.js` - Create PAXG pool
- `distributeToPartners.js` - Distribute tokens to partners
- `managePAXGLiquidity.js` - Manage PAXG liquidity
- `retryBuyWithHigherGas.js` - Retry buy with higher gas
- `transferNFTsToSafe.js` - Transfer NFTs to Safe
- `transferPAXGNFTToSafe.js` - Transfer PAXG NFT to Safe

### `test/`
Test scripts:
- `testTradingWithPAXG.js` - Test trading with PAXG

### `utils/`
Utility scripts:
- `calculateFSFOXValue.js` - Calculate FSFOX value
- `calculatePAXGPoolPrice.js` - Calculate PAXG pool price
- `findAllNFTs.js` - Find all NFTs
- `findPAXGNFT.js` - Find PAXG NFT
- `findPAXGNFTByPool.js` - Find PAXG NFT by pool
- `findPAXGNFTByTransaction.js` - Find PAXG NFT by transaction
- `findPAXGNFTFromPool.js` - Find PAXG NFT from pool
- `findPAXGNFTTokenID.js` - Find PAXG NFT token ID
- `getInitializeCalldata.js` - Get initialize calldata
- `getPAXGPoolAddress.js` - Get PAXG pool address
- `prepareSafeCalldata.js` - Prepare Safe calldata

## ⚠️ Security Notes

- **Never commit private keys or sensitive information**
- **Deployment files are excluded from git** (see `.gitignore`)
- **Use environment variables for sensitive data**
- **Review scripts before running on mainnet**

## 📝 Usage

All scripts can be run using Hardhat:

```bash
# Example: Check token status
npx hardhat run scripts/check/checkTokenStatus.js --network polygon

# Example: Generate calldata
npx hardhat run scripts/generate/generateLiquidityCalldata.js --network polygon

# Example: Add liquidity
npx hardhat run scripts/operations/addLiquidity.js --network polygon
```

## 🔗 Related Documentation

- See `docs/guides/general/SCRIPTS.md` for detailed script documentation
- See `docs/guides/safe/USAGE_WITH_SCRIPTS.md` for Safe usage guide

