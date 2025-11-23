# Contributing to FSFOX Token

Thank you for your interest in contributing to FSFOX Token! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code.

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Report unacceptable behavior

## 🤝 How Can I Contribute?

### Reporting Bugs

1. **Check existing issues** - Make sure the bug hasn't been reported
2. **Create a new issue** with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (network, node version, etc.)
   - Relevant logs or screenshots

### Suggesting Enhancements

1. **Check existing issues** - See if enhancement was already suggested
2. **Create a feature request** with:
   - Clear description of the enhancement
   - Use case and benefits
   - Possible implementation approach

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

## 🛠️ Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/fsfox-token.git
cd fsfox-token

# Install dependencies
npm install

# Copy environment file
cp env.example .env
# Edit .env with your settings
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm run coverage

# Run with gas reporting
npm run gas-report
```

### Compilation

```bash
# Compile contracts
npm run compile
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Follow coding standards**
5. **Update CHANGELOG.md** if applicable

### PR Guidelines

1. **Clear title** describing the change
2. **Detailed description** of what and why
3. **Reference related issues**
4. **Include test results**
5. **Add screenshots** if UI changes

### Review Process

- PRs will be reviewed by maintainers
- Feedback will be provided within 48 hours
- Address review comments promptly
- Maintainers will merge after approval

## 📝 Coding Standards

### Solidity

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use meaningful variable names
- Add NatSpec comments for public functions
- Keep functions focused and small
- Use `require` with clear error messages

### JavaScript

- Follow [JavaScript Style Guide](https://standardjs.com/)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions focused
- Handle errors properly

### Git Commit Messages

- Use clear, descriptive messages
- Start with capital letter
- Use present tense ("Add feature" not "Added feature")
- Reference issue numbers if applicable

Example:
```
Add liquidity check script

- Add checkPoolLiquidity.js script
- Include balance verification
- Add error handling

Fixes #123
```

## 📚 Documentation

### Code Documentation

- **Solidity:** Use NatSpec format
- **JavaScript:** Use JSDoc for functions
- **Comments:** Explain "why", not "what"

### User Documentation

- Update `docs/` folder for user-facing changes
- Keep guides up-to-date
- Add examples where helpful
- Update `README.md` if needed

## 🧪 Testing Guidelines

### Unit Tests

- Test all public functions
- Test edge cases
- Test error conditions
- Aim for >80% coverage

### Integration Tests

- Test script interactions
- Test with testnet
- Verify transaction flow

## 🔐 Security Considerations

### Before Contributing

- **Never commit private keys**
- **Review security implications**
- **Test on testnet first**
- **Follow security best practices**

### Security Reviews

- All code changes require security review
- Smart contract changes need extra scrutiny
- Report security issues privately (see SECURITY.md)

## 📦 Project Structure

```
fsfox-token/
├── contracts/          # Smart contracts
├── test/               # Tests
├── scripts/            # Deployment and utility scripts
│   ├── deployment/     # Deployment scripts
│   ├── check/          # Status checking scripts
│   ├── generate/       # Calldata generation
│   ├── operations/     # Operation scripts
│   └── utils/          # Utility scripts
├── docs/               # Documentation
└── hardhat.config.js   # Hardhat configuration
```

## ❓ Questions?

- **Documentation:** Check `docs/README.md`
- **Scripts:** Check `scripts/README.md`
- **Issues:** Open a GitHub issue
- **Discussions:** Use GitHub Discussions

## 🙏 Thank You!

Your contributions make this project better. Thank you for taking the time to contribute!

---

**Last Updated:** 2024

