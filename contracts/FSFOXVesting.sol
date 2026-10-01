// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VestingWalletCliff} from "@openzeppelin/contracts/finance/VestingWalletCliff.sol";
import {VestingWallet} from "@openzeppelin/contracts/finance/VestingWallet.sol";

/**
 * @title FSFOX Vesting Wallet
 * @dev Thin wrapper around OpenZeppelin's audited VestingWalletCliff (v5).
 *
 * Holds FSFOX that was released from the token contract's locked supply and
 * releases it to the beneficiary (the Gnosis Safe) on a fixed, on-chain schedule:
 *   - nothing is releasable before `start + cliff`
 *   - at the cliff, the linear amount accrued since `start` becomes releasable
 *   - fully vested at `start + duration`
 *
 * Nobody (including the beneficiary) can withdraw tokens ahead of schedule:
 * `release(token)` is the only way out and it only pays out the vested amount.
 * `release(token)` is permissionless; funds always go to the beneficiary.
 *
 * Note: OpenZeppelin's wallet is Ownable (owner = beneficiary). The owner can
 * transfer ownership, i.e. change who receives the *future* releases, but cannot
 * accelerate the schedule.
 */
contract FSFOXVesting is VestingWalletCliff {
    constructor(
        address beneficiary,
        uint64 startTimestamp,
        uint64 durationSeconds,
        uint64 cliffSeconds
    ) VestingWallet(beneficiary, startTimestamp, durationSeconds) VestingWalletCliff(cliffSeconds) {}
}
