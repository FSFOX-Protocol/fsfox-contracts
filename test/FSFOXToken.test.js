const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * FSFOX Token Contract Tests
 * This file contains basic tests for contract functionality
 */
describe("FSFOX Token Contract", function () {
  let fsfoxToken;
  let owner;
  let addr1;
  let addr2;
  let lockContract;
  let pool;

  beforeEach(async function () {
    // Get wallet addresses
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy FSFOXToken contract
    const FSFOXToken = await ethers.getContractFactory("FSFOXToken");
    fsfoxToken = await FSFOXToken.deploy(owner.address);
    await fsfoxToken.waitForDeployment();
    
    // Get lock contract address
    const contractInfo = await fsfoxToken.getContractInfo();
    lockContract = contractInfo.contractLockAddress;

    // designate a pool address and allow it
    pool = addr2; // use addr2 as mock pool
    await fsfoxToken.setPool(pool.address, true);
  });

  describe("Initial contract information", function () {
    it("should have correct token name", async function () {
      expect(await fsfoxToken.name()).to.equal("FSFOX");
    });

    it("should have correct token symbol", async function () {
      expect(await fsfoxToken.symbol()).to.equal("FSFOX");
    });

    it("should have correct decimals", async function () {
      expect(await fsfoxToken.decimals()).to.equal(18);
    });

    it("should have correct total supply", async function () {
      const totalSupply = await fsfoxToken.totalSupply();
      expect(totalSupply).to.equal(ethers.parseEther("1000000")); // 1,000,000 tokens
    });

    it("should have correct contract owner", async function () {
      const contractInfo = await fsfoxToken.getContractInfo();
      expect(contractInfo.contractOwner).to.equal(owner.address);
    });
  });

  describe("Initial token distribution", function () {
    it("should allocate free tokens to owner", async function () {
      const ownerBalance = await fsfoxToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.parseEther("50000")); // 50,000 tokens
    });

    it("should allocate locked tokens to lock contract", async function () {
      const lockBalance = await fsfoxToken.balanceOf(lockContract);
      expect(lockBalance).to.equal(ethers.parseEther("950000")); // 950,000 tokens
    });

    it("should have sum of free and locked tokens equal to total supply", async function () {
      const ownerBalance = await fsfoxToken.balanceOf(owner.address);
      const lockBalance = await fsfoxToken.balanceOf(lockContract);
      const totalSupply = await fsfoxToken.totalSupply();
      
      expect(ownerBalance + lockBalance).to.equal(totalSupply);
    });
  });

  describe("Transfer operations", function () {
    it("should transfer tokens between two addresses successfully", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await fsfoxToken.transfer(addr1.address, transferAmount);
      
      const addr1Balance = await fsfoxToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it("should decrease sender balance after transfer", async function () {
      const transferAmount = ethers.parseEther("1000");
      const initialBalance = await fsfoxToken.balanceOf(owner.address);
      
      await fsfoxToken.transfer(addr1.address, transferAmount);
      
      const finalBalance = await fsfoxToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance - transferAmount);
    });

    it("should fail transfer from lock contract", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      // Check that lock contract has tokens
      const lockBalance = await fsfoxToken.balanceOf(lockContract);
      expect(lockBalance).to.be.greaterThan(transferAmount);
      
      // Try to transfer from lock contract using owner's allowance
      // This should fail because lock contract cannot approve transfers
      await expect(
        fsfoxToken.connect(owner).transferFrom(lockContract, addr2.address, transferAmount)
      ).to.be.revertedWith("FSFOX: Insufficient allowance");
    });

    it("should fail transfer with insufficient balance (blocked during presale)", async function () {
      const transferAmount = ethers.parseEther("1000");
      await expect(
        fsfoxToken.connect(addr1).transfer(addr2.address, transferAmount)
      ).to.be.revertedWith("FSFOX: Trading disabled during presale");
    });
  });

  describe("Allowance operations", function () {
    it("should approve allowance successfully", async function () {
      const allowanceAmount = ethers.parseEther("1000");
      
      await fsfoxToken.approve(addr1.address, allowanceAmount);
      
      const allowance = await fsfoxToken.allowance(owner.address, addr1.address);
      expect(allowance).to.equal(allowanceAmount);
    });

    it("should transfer with allowance successfully", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await fsfoxToken.approve(addr1.address, transferAmount);
      await fsfoxToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      const addr2Balance = await fsfoxToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });

    it("should decrease allowance after use", async function () {
      const allowanceAmount = ethers.parseEther("1000");
      const transferAmount = ethers.parseEther("500");
      
      await fsfoxToken.approve(addr1.address, allowanceAmount);
      await fsfoxToken.connect(addr1).transferFrom(owner.address, addr2.address, transferAmount);
      
      const remainingAllowance = await fsfoxToken.allowance(owner.address, addr1.address);
      expect(remainingAllowance).to.equal(allowanceAmount - transferAmount);
    });

    it("should increase allowance successfully", async function () {
      const initialAmount = ethers.parseEther("1000");
      const addedAmount = ethers.parseEther("500");
      
      await fsfoxToken.approve(addr1.address, initialAmount);
      await fsfoxToken.increaseAllowance(addr1.address, addedAmount);
      
      const finalAllowance = await fsfoxToken.allowance(owner.address, addr1.address);
      expect(finalAllowance).to.equal(initialAmount + addedAmount);
    });

    it("should decrease allowance successfully", async function () {
      const initialAmount = ethers.parseEther("1000");
      const subtractedAmount = ethers.parseEther("300");
      
      await fsfoxToken.approve(addr1.address, initialAmount);
      await fsfoxToken.decreaseAllowance(addr1.address, subtractedAmount);
      
      const finalAllowance = await fsfoxToken.allowance(owner.address, addr1.address);
      expect(finalAllowance).to.equal(initialAmount - subtractedAmount);
    });
  });

  describe("Helper functions", function () {
    it("should correctly identify lock contract", async function () {
      expect(await fsfoxToken.isLockedContract(lockContract)).to.be.true;
      expect(await fsfoxToken.isLockedContract(owner.address)).to.be.false;
    });

    it("should have correct lock contract information", async function () {
      const contractInfo = await fsfoxToken.getContractInfo();
      
      expect(contractInfo.tokenName).to.equal("FSFOX");
      expect(contractInfo.tokenSymbol).to.equal("FSFOX");
      expect(contractInfo.tokenDecimals).to.equal(18);
      expect(contractInfo.totalTokenSupply).to.equal(ethers.parseEther("1000000"));
      expect(contractInfo.lockedTokenSupply).to.equal(ethers.parseEther("950000"));
      expect(contractInfo.freeTokenSupply).to.equal(ethers.parseEther("50000"));
      expect(contractInfo.contractOwner).to.equal(owner.address);
      expect(contractInfo.contractLockAddress).to.equal(lockContract);
      expect(contractInfo.mintEnabled).to.be.false;
      expect(contractInfo.burnEnabled).to.be.false;
    });
  });

  describe("Events", function () {
    it("should emit Transfer event on transfer", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await expect(fsfoxToken.transfer(addr1.address, transferAmount))
        .to.emit(fsfoxToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });

    it("should emit Approval event on approval", async function () {
      const allowanceAmount = ethers.parseEther("1000");
      
      await expect(fsfoxToken.approve(addr1.address, allowanceAmount))
        .to.emit(fsfoxToken, "Approval")
        .withArgs(owner.address, addr1.address, allowanceAmount);
    });
  });

  describe("Unlock tokens", function () {
    it("should only allow owner to call unlockTokens", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        fsfoxToken.connect(addr1).unlockTokens(amount)
      ).to.be.revertedWith("FSFOX: caller is not the owner");
    });

    it("should revert if amount exceeds lockedTokens", async function () {
      const lockedBefore = await fsfoxToken.getLockedTokens();
      const exceedAmount = lockedBefore + 1n;
      await expect(
        fsfoxToken.unlockTokens(exceedAmount)
      ).to.be.revertedWith("FSFOX: Amount exceeds locked tokens");
    });

    it("should decrease lockedTokens and increase owner balance after successful unlock", async function () {
      const amount = ethers.parseEther("2500");
      const lockedBefore = await fsfoxToken.getLockedTokens();
      const ownerBefore = await fsfoxToken.balanceOf(owner.address);

      await fsfoxToken.unlockTokens(amount);

      const lockedAfter = await fsfoxToken.getLockedTokens();
      const ownerAfter = await fsfoxToken.balanceOf(owner.address);

      expect(lockedAfter).to.equal(lockedBefore - amount);
      expect(ownerAfter).to.equal(ownerBefore + amount);
    });

    it("should emit TokensUnlocked event with correct params", async function () {
      const amount = ethers.parseEther("1234");
      await expect(fsfoxToken.unlockTokens(amount))
        .to.emit(fsfoxToken, "TokensUnlocked")
        .withArgs(owner.address, amount);
    });
  });

  describe("Presale trading rules", function () {
    it("non-owner cannot enableTrading", async function () {
      await expect(fsfoxToken.connect(addr1).enableTrading()).to.be.revertedWith(
        "FSFOX: caller is not the owner"
      );
    });

    it("selling to pool before enableTrading reverts", async function () {
      // owner sends some FSFOX to addr1 (allowed pre-trading)
      const give = ethers.parseEther("100");
      await fsfoxToken.transfer(addr1.address, give);
      // addr1 attempts to sell to pool
      await expect(fsfoxToken.connect(addr1).transfer(pool.address, ethers.parseEther("1")))
        .to.be.revertedWith("FSFOX: Trading disabled during presale");
    });

    it("buying from pool before enableTrading is allowed", async function () {
      // seed pool with tokens (owner -> pool allowed)
      const seed = ethers.parseEther("1000");
      await fsfoxToken.transfer(pool.address, seed);
      // pool transfers to addr1 (buy from pool)
      const buyAmt = ethers.parseEther("5");
      await expect(fsfoxToken.connect(pool).transfer(addr1.address, buyAmt))
        .to.emit(fsfoxToken, "Transfer").withArgs(pool.address, addr1.address, buyAmt);
    });

    it("after enableTrading, sell and user transfers work", async function () {
      // owner -> addr1 (preparing balance)
      await fsfoxToken.transfer(addr1.address, ethers.parseEther("10"));
      // enable trading
      await fsfoxToken.enableTrading();
      // addr1 -> pool should work now
      await expect(fsfoxToken.connect(addr1).transfer(pool.address, ethers.parseEther("1")))
        .to.emit(fsfoxToken, "Transfer");
      // addr1 -> owner should work
      await expect(fsfoxToken.connect(addr1).transfer((await fsfoxToken.getContractInfo()).contractOwner, ethers.parseEther("1")))
        .to.emit(fsfoxToken, "Transfer");
    });
  });
  describe("Limitations", function () {
    it("should fail transfer to zero address", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await expect(
        fsfoxToken.transfer(ethers.ZeroAddress, transferAmount)
      ).to.be.revertedWith("FSFOX: Transfer to zero address not allowed");
    });

    it("should fail approval to zero address", async function () {
      const allowanceAmount = ethers.parseEther("1000");
      
      await expect(
        fsfoxToken.approve(ethers.ZeroAddress, allowanceAmount)
      ).to.be.revertedWith("FSFOX: Approve to zero address not allowed");
    });
  });
});
