# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `FSFOXVesting` (OpenZeppelin `VestingWalletCliff` wrapper), tests, deploy script, Safe batch generator and a mainnet-fork dry-run for moving the locked supply into a 6-month-cliff / 36-month vesting wallet. See `docs/guides/safe/VESTING_PLAN.md` (executed on-chain 2026-10-02: vesting wallet `0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40`, unlock tx `0x39518084f61776758213996d605747a983c4401cc07ec1216ffaf1c24a8a146c`).

### Changed
- Hardhat now compiles with 0.8.19 (token, pinned via `overrides` so its bytecode still matches the deployed contract) and 0.8.24 (vesting).

## [Unreleased]

### Added
- Project structure review and improvements
- LICENSE file (MIT)
- SECURITY.md policy
- CONTRIBUTING.md guidelines
- CHANGELOG.md version history

## [1.0.0] - 2024

### Added
- Initial FSFOX Token contract deployment
- ERC-20 standard implementation
- Token locking mechanism (950,000 tokens locked)
- Presale trading controls
- Gnosis Safe integration
- Comprehensive documentation structure
- Script organization and utilities
- Pool management scripts
- Liquidity management guides
- Trading guides
- Troubleshooting documentation

### Features
- **Token Contract:**
  - Total Supply: 1,000,000 FSFOX
  - Locked Supply: 950,000 FSFOX
  - Free Supply: 50,000 FSFOX
  - Owner: Gnosis Safe (0x5Dbf15e9FB912eC6AF8F4Bd496EF45B2C38aB130)
  
- **Trading Controls:**
  - Presale mode with pool allowlist
  - Spender allowlist (for Uniswap V3 NPM)
  - Trading enable/disable functionality
  
- **Liquidity:**
  - FSFOX/USDC Pool (0xC87A70627546aaDe880fdA3D1Fdd07007c60B5fF)
  - Fee Tier: 0.3%
  - Initial Liquidity: 50,000 FSFOX + 50 USDC

### Documentation
- Complete user guides
- Technical guides for Safe operations
- Liquidity management guides
- Pool creation guides
- Trading guides
- Troubleshooting guides
- Script documentation

### Scripts
- Deployment scripts
- Status checking scripts (13 scripts)
- Calldata generation scripts (5 scripts)
- Operation scripts (12 scripts)
- Utility scripts (10 scripts)
- Test scripts

### Security
- Private key protection via .gitignore
- Environment variable usage
- Sensitive file exclusion
- Deployment file exclusion

---

## Version History

### v1.0.0 (2024)
- Initial release
- Contract deployment on Polygon Mainnet
- Full documentation suite
- Complete script library

---

## Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security fixes

---

**Note:** This changelog will be updated as the project evolves.

