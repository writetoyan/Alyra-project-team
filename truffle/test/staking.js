const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Staking = artifacts.require("Staking");
const ERC20_Ayg = artifacts.require("Erc20_Ayg");

async function timeIncreaseTo (seconds) {
  const delay = 1000 - new Date().getMilliseconds();
  await new Promise(resolve => setTimeout(resolve, delay));
  await time.increaseTo(seconds);
}


contract('Staking', function (accounts) {
  const owner = accounts[0];
  const staker1 = accounts[0];
  let stakingInstance;
  let erc20_AygInstance;

  describe("Test of the function totalSupply", function () {

    beforeEach(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingInstance = await Staking.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
    });

    it('totalSupply is equal to 0 at the begining', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });
  });


  describe("Test of the function stake", function () {
    let amount = new BN(1000);

    before(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingInstance = await Staking.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
      await erc20_AygInstance.approve(stakingInstance.address, amount, { from: owner });
    });

    it('totalSupply is equal to 0 before staking', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('balance of the staker is equal to 0 before staking', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('earnings of the staker is equal to 0 before staking', async() => {
      const _earned = await stakingInstance.earned(staker1);
      expect(new BN(_earned)).to.be.bignumber.equal(new BN(0));
    });

    it("Revert when stake 0", async function () {
      await expectRevert(stakingInstance.stake(new BN(0), { from: staker1 }), "Cannot stake 0");
    });

    it("Stake event is well sent", async function () {
      const _resultOfstake = await stakingInstance.stake(amount, { from: staker1 });
      expectEvent(_resultOfstake, 'Staked', { user: staker1, amount: amount});
    });

    it('totalSupply is equal to 1000 after staking', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(amount);
    });

    it('balance of the staker is equal to 1000 after staking', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(amount);
    });

    it('earnings of the staker is equal to 20 after staking 20 seconds', async() => {
      const timeDeposited = await time.latest();

      // Skip 20 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(20)).subn(1));

      const _earned = await stakingInstance.earned(staker1);
      expect(new BN(_earned)).to.be.bignumber.equal(new BN(20));
    });
  });

  describe("Test of the function withdraw", function () {
    let amount = new BN(1000);

    before(async function () {
      erc20_AygInstance = await ERC20_Ayg.new({ from: owner });
      stakingInstance = await Staking.new(erc20_AygInstance.address,erc20_AygInstance.address,{ from: owner });
      await erc20_AygInstance.approve(stakingInstance.address, amount, { from: owner });
      await stakingInstance.stake(amount, { from: staker1 });
      const timeDeposited = await time.latest();

      // Skip 20 seconds
      await timeIncreaseTo(timeDeposited.add(time.duration.seconds(20)).subn(1));
    });

    it("Revert when withdraw 0", async function () {
      await expectRevert(stakingInstance.withdraw(new BN(0), { from: staker1 }), "Cannot withdraw 0");
    });

    it("Withdraw event is well sent", async function () {
      const _resultOfWithdraw = await stakingInstance.withdraw(amount, { from: staker1 });
      expectEvent(_resultOfWithdraw, 'Withdrawn', { user: staker1, amount: amount});
    });

    it('totalSupply is equal to 0 after staking', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('balance of the staker is equal to 0 after staking', async() => {
      const _totalSupply = await stakingInstance.totalSupply();
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });
  });
});
