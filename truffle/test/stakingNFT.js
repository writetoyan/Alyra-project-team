const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const StakingNFT = artifacts.require("StakingNFT");
const ERC20_Nayg = artifacts.require("ERC20_Nayg");
const ERC721_Nftayg = artifacts.require("ERC721_Nftayg");

async function timeIncreaseTo (seconds) {
  const delay = 1000 - new Date().getMilliseconds();
  await new Promise(resolve => setTimeout(resolve, delay));
  await time.increaseTo(seconds);
}


contract('FULLTEST_NFT : Mint + Stake + Claim + Unstake', function (accounts) {
  const owner = accounts[0];
  const minter0 = accounts[0];
  const minter1 = accounts[1];
  let stakingNFTInstance;
  let erc20_NaygInstance;
  let erc721_NftaygInstance;

  describe("MINT", function () {

    beforeEach(async function () {
      erc20_NaygInstance = await ERC20_Nayg.new({ from: owner });
      erc721_NftaygInstance = await ERC721_Nftayg.new({ from: owner });
      stakingNFTInstance = await StakingNFT.new(erc20_NaygInstance.address,erc721_NftaygInstance.address,{ from: owner});
    });

    it('totalSupply is equal to 0 at the begining', async() => {
      const _totalSupply = await erc721_NftaygInstance.totalSupply({ from: owner });
      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(0));
    });

    it('mint nft1 by minter1', async() => {
//      const _mint1 = await erc721_NftaygInstance.mint1(minter1, {value: 1000000000000000, gas:3000000, from: minter1});
      const _mint1 = await erc721_NftaygInstance.mint1({value: 1000000000000000, gas:3000000, from: minter1});
      
      expect(_mint1.receipt.status).to.equal(true);
    });

    it('totalSupply is equal to 0 at the begining', async() => {
      const _totalSupply = await erc721_NftaygInstance.totalSupply({ from: owner });
      console.log("_totalSupply = "+_totalSupply);
//      expect(new BN(_totalSupply)).to.be.bignumber.equal(new BN(1));
    });
/*
    it('verif owner nft1 is minter1', async() => {
      const _ownerNft1 = await erc721_NftaygInstance.ownerOf(0, {from: minter1});
      console.log("_ownerNft1 = "+_ownerNft1);
      expect(new BN(_ownerNft1)).to.be.bignumber.equal(new BN(minter1));
    });
*/

  });



});