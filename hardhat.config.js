require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    // FSFOXToken is deployed with 0.8.19 / optimizer 200 - keep these settings
    // unchanged so its bytecode stays reproducible for Polygonscan verification.
    // FSFOXVesting depends on OpenZeppelin v5 which needs >=0.8.20.
    compilers: [
      {
        version: "0.8.19",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.8.24",
        settings: { optimizer: { enabled: true, runs: 200 }, evmVersion: "paris" },
      },
    ],
    // Without this Hardhat picks the newest compatible compiler (0.8.24) for the
    // token too, which changes its metadata hash vs. the deployed contract.
    overrides: {
      "contracts/FSFOXToken.sol": {
        version: "0.8.19",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // Optional mainnet fork for dry-runs (scripts/simulate/*): FORK_URL=<rpc> npx hardhat run ...
      ...(process.env.FORK_URL ? { forking: { url: process.env.FORK_URL } } : {}),
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
      gasPrice: "auto",
      timeout: 120000, // 120 seconds
    },
    amoy: {
      url: process.env.AMOY_RPC_URL || "https://polygon-amoy.public.blastapi.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
      gasPrice: "auto",
      timeout: 60000,
    },
  },
  etherscan: {
    // Etherscan API v2 single key (works for Polygonscan)
    apiKey: process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY || "",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
