# Security Policy

## 🔒 Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

### GitHub Security Advisories (preferred)
- Use **Security → Report a vulnerability** on https://github.com/FSFOX-Protocol/fsfox-contracts (private vulnerability reporting).

### Response Time
- We will acknowledge receipt of your report within **48 hours**
- We will provide a detailed response within **7 days**
- We will keep you informed of our progress

## 🛡️ Security Best Practices

### For Users
1. **Never share your private keys**
2. **Always verify contract addresses** before interacting
3. **Use official sources only** - Check `docs/official/OFFICIAL_INFO.md`
4. **Verify transactions** on Polygonscan before confirming
5. **Be cautious of phishing** - Always verify URLs

### For Developers
1. **Review all code** before deployment
2. **Test thoroughly** on testnets before mainnet
3. **Use environment variables** for sensitive data
4. **Never commit private keys** or sensitive information (`.env`, keystores, mnemonics, RPC URLs / API keys with embedded secrets). This repository is public.
5. **Use a dedicated gas-only wallet** for `PRIVATE_KEY` in `.env`; owner-level actions (`unlockTokens`, `setPool`, liquidity NFTs) go through the Gnosis Safe using the calldata produced by `scripts/generate/*`.
6. **If a key or API key was ever exposed**, treat it as compromised: rotate it immediately (git history is public and permanent).
7. **Follow secure coding practices**
8. CI (`secret-scan` job) blocks pushes containing key-like literals; do not disable it.

## 🔍 Security Audit

### Current Status
- **Audit Status:** Not yet audited
- **Audit Date:** TBD
- **Auditor:** TBD

### Audit Reports
- Audit reports will be published here when available

## ⚠️ Known Security Considerations

### Smart Contract
- **Owner Privileges (details: `docs/official/OWNER_POWERS.md`):** Contract owner has significant control: `setPool`/`setSpender`/`enableTrading` and `unlockTokens()` (which now has nothing left to release: the locked supply was moved into the vesting wallet `0xE0236fc0Dd9d63926b20A4B46eb62c2320648d40` on 2026-10-02), and there is no `transferOwnership`
- **Trading Controls:** Presale mode restricts trading
- **Locked Tokens:** 950,000 tokens are locked in contract
- **No Mint/Burn:** Minting and burning are disabled

### Recommendations
1. **Use Gnosis Safe** for owner address (multi-sig)
2. **Review all transactions** before execution
3. **Monitor contract** for unusual activity
4. **Keep private keys secure** and offline

## 📋 Security Checklist

Before deploying or interacting with the contract:

- [ ] Verify contract address matches official address
- [ ] Check contract is verified on Polygonscan
- [ ] Review contract source code
- [ ] Test on testnet first
- [ ] Use hardware wallet for large transactions
- [ ] Verify all transaction parameters
- [ ] Check gas prices before confirming
- [ ] Monitor transaction status

## 🔗 Security Resources

- **Contract Address:** `0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B`
- **Polygonscan:** https://polygonscan.com/address/0xe5C72a59981d3c19a74DC6144e13f6b244ee5e2B
- **Official Documentation:** `docs/official/OFFICIAL_INFO.md`

## 📝 Disclosure Policy

We follow responsible disclosure practices:
1. **Private reporting** of vulnerabilities
2. **Timely response** to security issues
3. **Public disclosure** after fix is deployed
4. **Credit** to security researchers (if desired)

---

**Last Updated:** 2026-10-01

