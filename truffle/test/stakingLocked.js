const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const StakingLocked = artifacts.require("StakingLocked");
const ERC20_Ayg = artifacts.require("ERC20_Ayg");

async function timeIncreaseTo (seconds) {
  const delay = 1000 - new Date().getMilliseconds();
  await new Promise(resolve => setTimeout(resolve, delay));
  await time.increaseTo(seconds);
}


contract('StakingLocked', function (accounts) {
  const owner = accounts[0];
  const staker1 = accounts[0];
  let stakingLockedInstance;
  let erc20_AygInstance;

  describe("Test of the function totalSupply", function () {

    beforeEach(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingLockedInstance = await StakingLocked.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
    });

    it('totalSupply is equal to 0 at the begining', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });
  });


  describe("Test of the function stake", function () {
    let amount = new BN(1000);

    before(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingLockedInstance = await StakingLocked.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
      await erc20_AygInstance.approve(stakingLockedInstance.address, amount, { from: owner });
    });

    it('totalSupply is equal to 0 before stakingLocked', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('balance of the staker is equal to 0 before stakingLocked', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('earnings of the staker is equal to 0 before stakingLocked', async() => {
      const _earned = await stakingLockedInstance.earned(staker1);
      expect(new BN(_earned)).to.be.bignumber.equal(new BN(0));
    });

    it("Revert when stake 0", async function () {
      await expectRevert(stakingLockedInstance.stake(new BN(0), { from: staker1 }), "Cannot stake 0");
    });

    it("Stake event is well sent", async function () {
      const _resultOfstake = await stakingLockedInstance.stake(amount, { from: staker1 });
      expectEvent(_resultOfstake, 'Staked', { user: staker1, amount: amount});
    });

    it('totalSupply is equal to 1000 after stakingLocked', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(amount);
    });

    it('balance of the staker is equal to 1000 after stakingLocked', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(amount);
    });

    it('earnings of the staker is equal to 2000 after stakingLocked 20 seconds', async() => {
      const timeDeposited = await time.latest();

      // Skip 20 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(20)).subn(1));

      const _earned = await stakingLockedInstance.earned(staker1);
      expect(new BN(_earned)).to.be.bignumber.equal(new BN(2000));
    });
  });

  describe("Test of the function withdraw", function () {
    let amount = new BN(1000);

    before(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingLockedInstance = await StakingLocked.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
      await erc20_AygInstance.approve(stakingLockedInstance.address, amount, { from: owner });
      await stakingLockedInstance.stake(amount, { from: staker1 });

      const timeDeposited = await time.latest();

      // Skip 20 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(20)).subn(1));  
    });

    it("Revert when withdraw before the locking period ends", async function () {
      await expectRevert(stakingLockedInstance.withdraw({ from: staker1 }), "You have to wait the end of the locking period");
    });


    it("Withdraw event is well sent", async function () {
      const timeDeposited = await time.latest();

      // Skip 60 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(60)).subn(1));
      
      const _resultOfWithdraw = await stakingLockedInstance.withdraw({ from: staker1 });
      expectEvent(_resultOfWithdraw, 'Withdrawn', { user: staker1, amount: amount});
    });

    it('totalSupply is equal to 0 after stakingLocked', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('balance of the staker is equal to 0 after stakingLocked', async() => {
      const _totalSupply = await stakingLockedInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });
  });

  describe("Test of the function getReward", function () {
    let amount = new BN(1000);
  
    before(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingLockedInstance = await StakingLocked.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
      await erc20_AygInstance.approve(stakingLockedInstance.address, amount*100, { from: owner });
      await stakingLockedInstance.stake(amount*100, { from: staker1 });
      const timeDeposited = await time.latest();
  
      // Skip 20 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(20)).subn(1));
    });
    
    it('balanceOf of staker1 is equal to 1000 after stakingLocked', async() => {
      let _balanceOf = await stakingLockedInstance.balanceOf(staker1);
      expect(new BN(_balanceOf)).to.be.bignumber.equal(new BN(100000));
    });
  
    it("RewardPaid event is well sent", async function () {      
      const _resultOfGetReward = await stakingLockedInstance.getReward({ from: staker1 });
      expectEvent(_resultOfGetReward, 'RewardPaid', { user: staker1, reward: new BN(2000)});
    });
  });

  describe("Test of the function exit", function () {
    let amount = new BN(1000);
  
    before(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingLockedInstance = await StakingLocked.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
      await erc20_AygInstance.faucetNoLimit(stakingLockedInstance.address, amount, { from: owner });
      await erc20_AygInstance.approve(stakingLockedInstance.address, amount, { from: owner });
      await stakingLockedInstance.stake(amount, { from: staker1 });
      const timeDeposited = await time.latest();
  
      // Skip 61 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(61)).subn(1));

      await stakingLockedInstance.exit({ from: staker1 })
    });
    
    it('no more token of the staker1 after exit', async() => {
      const _balanceOf = await stakingLockedInstance.balanceOf(staker1);
      expect(new BN(_balanceOf)).to.be.bignumber.equal(new BN(0));
    });

    it('rewards are well earned', async() => {
      const _balanceOf = await erc20_AygInstance.balanceOf(staker1);
      expect(new BN(_balanceOf)).to.be.bignumber.above(new BN(20000 * 10^18));
    });
  });
});

