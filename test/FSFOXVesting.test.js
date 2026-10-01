const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const DAY = 24 * 60 * 60;
const CLIFF = 180 * DAY;
const DURATION = 1095 * DAY; // 36 months incl. the 6-month cliff
const LOCKED = ethers.parseEther("950000");

describe("FSFOXVesting (locked-supply release plan)", function () {
  let token, vesting, safe, other, start, locked;

  beforeEach(async function () {
    // `safe` stands in for the Gnosis Safe (owner + beneficiary)
    [safe, other] = await ethers.getSigners();
    token = await (await ethers.getContractFactory("FSFOXToken")).deploy(safe.address);
    await token.enableTrading();

    start = (await time.latest()) + 60;
    vesting = await (await ethers.getContractFactory("FSFOXVesting")).deploy(
      safe.address, start, DURATION, CLIFF
    );

    // Exactly what the Safe batch does: unlock everything, move it into vesting
    locked = await token.lockedTokens();
    await token.unlockTokens(locked);
    await token.transfer(await vesting.getAddress(), locked);
  });

  it("holds the whole locked supply and leaves the token contract empty", async function () {
    expect(await token.balanceOf(await vesting.getAddress())).to.equal(locked);
    expect(await token.lockedTokens()).to.equal(0n);
    expect(await token.balanceOf(await token.getAddress())).to.equal(0n);
    expect(await vesting.owner()).to.equal(safe.address);
    expect(await vesting.start()).to.equal(start);
    expect(await vesting.cliff()).to.equal(start + CLIFF);
    expect(await vesting.end()).to.equal(start + DURATION);
  });

  it("releases nothing before the cliff, even to the beneficiary", async function () {
    const addr = await token.getAddress();
    await time.increaseTo(start + CLIFF - 10);
    expect(await vesting["releasable(address)"](addr)).to.equal(0n);
    const before = await token.balanceOf(safe.address);
    await vesting["release(address)"](addr);
    expect(await token.balanceOf(safe.address)).to.equal(before);
  });

  it("at the cliff, releases the linear amount accrued since start (1/6)", async function () {
    const addr = await token.getAddress();
    await time.increaseTo(start + CLIFF);
    const r = await vesting["releasable(address)"](addr);
    const expected = (locked * BigInt(CLIFF)) / BigInt(DURATION);
    expect(r).to.be.closeTo(expected, ethers.parseEther("1")); // +-1 second of drift
    const safeBefore = await token.balanceOf(safe.address);
    await vesting.connect(other)["release(address)"](addr); // permissionless, pays beneficiary
    expect(await token.balanceOf(other.address)).to.equal(0n);
    expect(await token.balanceOf(safe.address)).to.be.closeTo(
      safeBefore + expected,
      ethers.parseEther("1")
    );
  });

  it("vests linearly and is fully released at the end", async function () {
    const addr = await token.getAddress();
    await time.increaseTo(start + DURATION / 2);
    const half = await vesting["releasable(address)"](addr);
    expect(half).to.be.closeTo(locked / 2n, ethers.parseEther("1"));

    const safeBefore = await token.balanceOf(safe.address);
    await time.increaseTo(start + DURATION + 1);
    await vesting["release(address)"](addr);
    expect(await token.balanceOf(safe.address)).to.equal(safeBefore + locked);
    expect(await token.balanceOf(await vesting.getAddress())).to.equal(0n);
  });

  it("works with trading disabled too (owner is always an allowed recipient)", async function () {
    const t2 = await (await ethers.getContractFactory("FSFOXToken")).deploy(safe.address);
    const v2 = await (await ethers.getContractFactory("FSFOXVesting")).deploy(
      safe.address, (await time.latest()) + 60, DURATION, CLIFF
    );
    const l2 = await t2.lockedTokens();
    await t2.unlockTokens(l2);
    await t2.transfer(await v2.getAddress(), l2);
    await time.increase(DURATION + 100);
    await v2["release(address)"](await t2.getAddress());
    expect(await t2.balanceOf(await v2.getAddress())).to.equal(0n);
  });

  it("cannot be drained early: only the owner can change who gets future releases", async function () {
    await expect(vesting.connect(other).transferOwnership(other.address)).to.be.reverted;
    // no function other than release() moves tokens out
    const fns = vesting.interface.fragments.filter((f) => f.type === "function").map((f) => f.name);
    expect(fns.filter((n) => /withdraw|sweep|rescue|emergency/i.test(n))).to.deep.equal([]);
  });
});
