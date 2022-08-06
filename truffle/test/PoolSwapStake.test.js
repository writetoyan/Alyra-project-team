const PoolSwapStake = artifacts.require("PoolSwapStake");
const Erc20_Ayg = artifacts.require("Erc20_Ayg");
const Erc20_Nayg = artifacts.require("Erc20_Nayg");
const LPToken = artifacts.require("LPToken");

const { expectEvent, expectRevert, BN, time } = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert.js');
const { expect } = require('chai');
const { kovan } = require("../helper-chainlink.js");

async function timeIncreaseTo (seconds) {
    const delay = 1000 - new Date().getMilliseconds();
    await new Promise(resolve => setTimeout(resolve, delay));
    await time.increaseTo(seconds);
  }

contract('PoolSwapStake', function (accounts) {
    
    const owner = accounts[0];
    const pooler = accounts[1];
    const swaper = accounts[1];
    const staker = accounts[1];
 
    describe('Pool testing', () => {

        let BNBProxyAddress = kovan.BNBProxy; 
        let LINKProxyAddress = kovan.LINKProxy;
        let deposit = '';
        let withdraw = '';
        let totalLpTokenBefore = '';
        let varTotalLpTokenBefore = '';

        before(async function() {

            aygInstance = await Erc20_Ayg.new({from: owner});
            naygInstance = await Erc20_Nayg.new({from: owner});
            lptokenInstance = await LPToken.new({from: owner});
            poolInstance = await PoolSwapStake.new(BNBProxyAddress, LINKProxyAddress, lptokenInstance.address, aygInstance.address, naygInstance.address, {from: owner});
            await aygInstance.approve(poolInstance.address, 100000, {from: pooler});
            await naygInstance.approve(poolInstance.address, 400000, {from: pooler});
            await lptokenInstance.addMinter(poolInstance.address);
            await aygInstance.transfer(pooler, 100000, {from: owner});
            await naygInstance.transfer(pooler, 400000, {from: owner});
            
        });

        it('should transfert the pooling tokens to the pool contract', async () => {
            deposit = await poolInstance.depositPool(80000, 320000, {from: pooler});
            const aygBalance = await aygInstance.balanceOf(poolInstance.address);
            const naygBalance = await naygInstance.balanceOf(poolInstance.address);
            expect(new BN(aygBalance)).to.be.bignumber.equal(new BN(80000));
            expect(new BN(naygBalance)).to.be.bignumber.equal(new BN(320000));
        });
        it('should mint the right amount of lp token to the pooler', async () => {
            lptokenBalance = await lptokenInstance.balanceOf(pooler);
            expect(new BN(lptokenBalance)).to.be.bignumber.equal(new BN(80000));
        });
        it('should emit the DepositPool event', async () => {
            expectEvent(deposit, 'DepositPool', {addr: pooler, aygDeposited: new BN(80000), naygDeposited: new BN(320000), lptokenMinted: new BN(80000)})
        });
        it('should update the struct SLPToken', async () => {
            await poolInstance.depositPool(20000, 80000, {from: pooler});
            const lpStruct = await poolInstance.lptoken.call();
            expect(new BN(lpStruct.amountAyg)).to.be.bignumber.equal(new BN(100000));
            expect(new BN(lpStruct.amountNayg)).to.be.bignumber.equal(new BN(400000));
        });
        it('should update the total amount of lp token minted', async () => {
            expect((await poolInstance.totalLPToken.call())).to.be.bignumber.equal(new BN(100000));
        });
        it('Should revert if the amount to withdraw is too small', async () => {
            await expectRevert(poolInstance.withdrawPool(9999, {from: pooler}), "Amount too small");
        }); 
        it('should withdraw the amount of ayg and nayg proportionaly of what is in the pool in exchange of the lp token', async () => {
            const aygBalanceBefore = await aygInstance.balanceOf(pooler);
            const naygBalanceBefore = await naygInstance.balanceOf(pooler);
            totalLpTokenBefore = await lptokenInstance.totalSupply.call();
            varTotalLpTokenBefore = await poolInstance.totalLPToken.call();
            withdraw = await poolInstance.withdrawPool(10000, {from: pooler});
            const aygBalanceAfter = await aygInstance.balanceOf(pooler);
            const naygBalanceAfter = await naygInstance.balanceOf(pooler);
            expect(new BN(aygBalanceAfter)).to.be.bignumber.equal(new BN(aygBalanceBefore + 10000));
            expect(new BN(naygBalanceAfter)).to.be.bignumber.equal(new BN(naygBalanceBefore + 40000));
        });
        it('should emit the WithdrawPool event', async () => {
            expectEvent(withdraw, 'WithdrawPool', {addr: pooler, aygWithdrawn: new BN(10000), naygWithdrawn: new BN(40000), lptokenBurned: new BN(10000)})
        });
        it('should burn the lp token', async () => {
            totalLpTokenAfter = await lptokenInstance.totalSupply.call();
            expect(new BN(totalLpTokenAfter)).to.be.bignumber.equal(new BN(totalLpTokenBefore - 10000));
        });
        it('should update the variable totalLpToken', async () => {
            const varTotalLpTokenAfter = await poolInstance.totalLPToken.call();
            expect(new BN(varTotalLpTokenAfter)).to.be.bignumber.equal(new BN(varTotalLpTokenBefore - 10000))
        })
        it('should update the struct LPToken', async () => {
            const lpStruct = await poolInstance.lptoken.call();
            expect(new BN(lpStruct.amountAyg)).to.be.bignumber.equal(new BN(90000));
            expect(new BN(lpStruct.amountNayg)).to.be.bignumber.equal(new BN(360000));
        });
    });

    describe('Swap AYG testing', () => {

        let BNBProxyAddress = kovan.BNBProxy; 
        let LINKProxyAddress = kovan.LINKProxy;
        let lpStruct = '';
        let lpStructAygBefore = '';
        let lpStructNaygBefore = '';
        let tradingFees = '';
        let swaperAygBalanceBefore ='';
        let swaperNaygBalanceBefore = '';
        let swap = '';

        before(async function() {

            aygInstance = await Erc20_Ayg.new({from: owner});
            naygInstance = await Erc20_Nayg.new({from: owner});
            lptokenInstance = await LPToken.new({from: owner});
            poolInstance = await PoolSwapStake.new(BNBProxyAddress, LINKProxyAddress, lptokenInstance.address, aygInstance.address, naygInstance.address, {from: owner});
            await aygInstance.approve(poolInstance.address, 100000, {from: swaper});
            await naygInstance.approve(poolInstance.address, 400000, {from: swaper});
            await lptokenInstance.addMinter(poolInstance.address);
            await aygInstance.transfer(pooler, 100000, {from: owner});
            await naygInstance.transfer(pooler, 400000, {from: owner});
            await poolInstance.depositPool(90000, 360000, {from: swaper});
        });

        it('Should revert if the amount to swap is too small', async () => {
            await expectRevert(poolInstance.swapPoolAyg(9999, {from: swaper}), "Amount too small");
        }); 
        it('should update the balance of the pool', async () => {
            const aygBalanceBefore = (await aygInstance.balanceOf(poolInstance.address)).toNumber();
            const naygBalanceBefore = (await naygInstance.balanceOf(poolInstance.address)).toNumber();
            lpStruct = await poolInstance.lptoken.call();
            lpStructAygBefore = (lpStruct.amountAyg).toNumber();
            lpStructNaygBefore = (lpStruct.amountNayg).toNumber();
            swaperAygBalanceBefore = (await aygInstance.balanceOf(swaper)).toNumber();
            swaperNaygBalanceBefore = (await naygInstance.balanceOf(swaper)).toNumber();
            swap = await poolInstance.swapPoolAyg(10000, {from: swaper});
            tradingFees = 40000 * 0.03;
            const aygBalanceAfter = (await aygInstance.balanceOf(poolInstance.address)).toNumber();
            const naygBalanceAfter = (await naygInstance.balanceOf(poolInstance.address)).toNumber();
            expect(new BN(aygBalanceAfter)).to.be.bignumber.equal(new BN(aygBalanceBefore + 10000));
            expect(new BN(naygBalanceAfter)).to.be.bignumber.equal(new BN(naygBalanceBefore - 40000 + tradingFees));
        });
        it('should update the struct SLPToken', async () => {
            lpStruct = await poolInstance.lptoken.call();
            expect(new BN(lpStruct.amountAyg)).to.be.bignumber.equal(new BN(lpStructAygBefore + 10000));
            expect(new BN(lpStruct.amountNayg)).to.be.bignumber.equal(new BN(lpStructNaygBefore - 40000 + tradingFees));
        });
        it('Should transfer the result of the swap to the swaper', async () => {
            const swaperAygBalanceAfter = (await aygInstance.balanceOf(swaper)).toNumber();
            const swaperNaygBalanceAfter = (await naygInstance.balanceOf(swaper)).toNumber();
            expect(new BN(swaperAygBalanceAfter)).to.be.bignumber.equal(new BN(swaperAygBalanceBefore - 10000));
            expect(new BN(swaperNaygBalanceAfter)).to.be.bignumber.equal(new BN(swaperNaygBalanceBefore + 40000 - tradingFees));
        });
        it('should emit the SwapedAyg event', async () => {
            expectEvent(swap, 'SwapedAyg', {swaperAddr: swaper, swapedAmount: new BN(10000), amountReceived: new BN(38800), tradingFees: new BN(tradingFees)});
        });
    });

    describe('Swap NAYG testing', () => {

        let BNBProxyAddress = kovan.BNBProxy; 
        let LINKProxyAddress = kovan.LINKProxy;
        let lpStruct = '';
        let lpStructAygBefore = '';
        let lpStructNaygBefore = '';
        let tradingFees = '';
        let swaperAygBalanceBefore ='';
        let swaperNaygBalanceBefore = '';
        let swap = '';

        before(async function() {

            aygInstance = await Erc20_Ayg.new({from: owner});
            naygInstance = await Erc20_Nayg.new({from: owner});
            lptokenInstance = await LPToken.new({from: owner});
            poolInstance = await PoolSwapStake.new(BNBProxyAddress, LINKProxyAddress, lptokenInstance.address, aygInstance.address, naygInstance.address, {from: owner});
            await aygInstance.approve(poolInstance.address, 100000, {from: swaper});
            await naygInstance.approve(poolInstance.address, 400000, {from: swaper});
            await lptokenInstance.addMinter(poolInstance.address);
            await aygInstance.transfer(pooler, 100000, {from: owner});
            await naygInstance.transfer(pooler, 400000, {from: owner});
            await poolInstance.depositPool(90000, 360000, {from: swaper});
        });

        it('Should revert if the amount to swap is too small', async () => {
            await expectRevert(poolInstance.swapPoolNayg(9999, {from: swaper}), "Amount too small");
        }); 
        it('should update the balance of the pool', async () => {
            const aygBalanceBefore = (await aygInstance.balanceOf(poolInstance.address)).toNumber();
            const naygBalanceBefore = (await naygInstance.balanceOf(poolInstance.address)).toNumber();
            lpStruct = await poolInstance.lptoken.call();
            lpStructAygBefore = (lpStruct.amountAyg).toNumber();
            lpStructNaygBefore = (lpStruct.amountNayg).toNumber();
            swaperAygBalanceBefore = (await aygInstance.balanceOf(swaper)).toNumber();
            swaperNaygBalanceBefore = (await naygInstance.balanceOf(swaper)).toNumber();
            swap = await poolInstance.swapPoolNayg(40000, {from: swaper});
            tradingFees = 10000 * 0.03;
            const aygBalanceAfter = (await aygInstance.balanceOf(poolInstance.address)).toNumber();
            const naygBalanceAfter = (await naygInstance.balanceOf(poolInstance.address)).toNumber();
            expect(new BN(aygBalanceAfter)).to.be.bignumber.equal(new BN(aygBalanceBefore - 10000 + tradingFees));
            expect(new BN(naygBalanceAfter)).to.be.bignumber.equal(new BN(naygBalanceBefore + 40000));
        });
        it('should update the struct SLPToken', async () => {
            lpStruct = await poolInstance.lptoken.call();
            expect(new BN(lpStruct.amountAyg)).to.be.bignumber.equal(new BN(lpStructAygBefore - 10000 + tradingFees));
            expect(new BN(lpStruct.amountNayg)).to.be.bignumber.equal(new BN(lpStructNaygBefore + 40000 ));
        });
        it('Should transfer the result of the swap to the swaper', async () => {
            const swaperAygBalanceAfter = (await aygInstance.balanceOf(swaper)).toNumber();
            const swaperNaygBalanceAfter = (await naygInstance.balanceOf(swaper)).toNumber();
            expect(new BN(swaperAygBalanceAfter)).to.be.bignumber.equal(new BN(swaperAygBalanceBefore + 10000 - tradingFees));
            expect(new BN(swaperNaygBalanceAfter)).to.be.bignumber.equal(new BN(swaperNaygBalanceBefore - 40000));
        });
        it('should emit the SwapedNayg event', async () => {
            expectEvent(swap, 'SwapedNayg', {swaperAddr: swaper, swapedAmount: new BN(40000), amountReceived: new BN(9700), tradingFees: new BN(tradingFees)});
        });
    });

    describe('Staking testing', () => {

        let BNBProxyAddress = kovan.BNBProxy; 
        let LINKProxyAddress = kovan.LINKProxy;
        let stake = '';
        let unstake = '';
        let reward = '';

        before(async function () {

            aygInstance = await Erc20_Ayg.new({from: owner});
            naygInstance = await Erc20_Nayg.new({from: owner});
            lptokenInstance = await LPToken.new({from: owner});
            poolInstance = await PoolSwapStake.new(BNBProxyAddress, LINKProxyAddress, lptokenInstance.address, aygInstance.address, naygInstance.address, {from: owner});
            await aygInstance.approve(poolInstance.address, 100000, {from: staker});
            await naygInstance.approve(poolInstance.address, 400000, {from: staker});
            await lptokenInstance.approve(poolInstance.address, 100000, {from: staker});
            await lptokenInstance.addMinter(poolInstance.address);
            await aygInstance.addMinter(poolInstance.address);
            await aygInstance.transfer(pooler, 100000, {from: owner});
            await naygInstance.transfer(pooler, 400000, {from: owner});
            await poolInstance.depositPool(10000, 40000, {from: staker})

        })
        it('Should stake the right amount', async () => {
            poolLpTokenBalanceBefore = (await lptokenInstance.balanceOf(poolInstance.address)).toNumber();
            stakerLpTokenBalanceBefore = (await lptokenInstance.balanceOf(staker)).toNumber();
            stake = await poolInstance.stake(10000, {from: staker});
            poolLpTokenBalanceAfter = (await lptokenInstance.balanceOf(poolInstance.address)).toNumber();
            stakerLpTokenBalanceAfter = (await lptokenInstance.balanceOf(staker)).toNumber();
            expect(new BN(poolLpTokenBalanceAfter)).to.be.bignumber.equal(new BN(poolLpTokenBalanceBefore + 10000));
            expect(new BN(stakerLpTokenBalanceAfter)).to.be.bignumber.equal(new BN(stakerLpTokenBalanceBefore - 10000));
        });
        it('should emit the NewStake event', async () => {
            expectEvent(stake, 'NewStake', {addr: staker, amount: new BN(10000), stakeId: new BN(0)});
        });
        it('Should transfer the staked amount and the reward in AYG', async () => {
            stakerLpTokenBalanceBefore = (await lptokenInstance.balanceOf(staker)).toNumber();
            poolLpTokenBalanceBefore = (await lptokenInstance.balanceOf(poolInstance.address)).toNumber();
            stakerAygBalanceBefore = (await aygInstance.balanceOf(staker)).toNumber();
            const timeDeposited = await time.latest();
            await timeIncreaseTo(timeDeposited.add(time.duration.seconds(60)).subn(1));
            unstake = await poolInstance.unstake(0, {from: staker});
            poolLpTokenBalanceAfter = (await lptokenInstance.balanceOf(poolInstance.address)).toNumber();
            stakerLpTokenBalanceAfter = (await lptokenInstance.balanceOf(staker)).toNumber();
            stakerAygBalanceAfter = (await aygInstance.balanceOf(staker)).toNumber();
            reward = stakerAygBalanceAfter - stakerAygBalanceBefore;
            expect(new BN(poolLpTokenBalanceAfter)).to.be.bignumber.equal(new BN(poolLpTokenBalanceBefore - 10000));
            expect(new BN(stakerLpTokenBalanceAfter)).to.be.bignumber.equal(new BN(stakerLpTokenBalanceBefore + 10000));
            expect(new BN(stakerAygBalanceAfter)).to.be.bignumber.greaterThan(new BN(stakerAygBalanceBefore));
        });
        it('should emit the Unstake event', async () => {
            expectEvent(unstake, 'Unstake', {addr: staker, amount: new BN(10000), reward: new BN(reward)});
        });
    })

})