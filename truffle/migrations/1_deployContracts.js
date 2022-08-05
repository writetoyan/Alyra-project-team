const Erc20_Ayg = artifacts.require("Erc20_Ayg");
const Erc20_Nayg = artifacts.require("Erc20_Nayg");
const LPToken = artifacts.require("LPToken")
const Staking = artifacts.require("Staking");
const EthVaultMintAyg = artifacts.require("EthVaultMintAyg");
const PoolSwapStake = artifacts.require("PoolSwapStake");
const Web3 = require("web3");
const Erc721_Nftayg = artifacts.require("Erc721_Nftayg");
const StakingNFT = artifacts.require("StakingNFT");

const { mainnet_fork, kovan } = require("../helper-chainlink.js");

module.exports = async function (deployer, network) {
  await deployer.deploy(Erc20_Ayg);
  const ayg = await Erc20_Ayg.deployed();
  await deployer.deploy(Staking, ayg.address, ayg.address);
  const staking = await Staking.deployed()
  await ayg.transfer(staking.address, Web3.utils.toWei("10000"));
  network == "mainnet_fork" ? 
    (ethAddress = mainnet_fork.ETH, BNBProxyAddress = mainnet_fork.BNBProxy) :
    (ethAddress = kovan.ETH, BNBProxyAddress = kovan.BNBProxy);
  const vault = await deployer.deploy(EthVaultMintAyg, ethAddress, BNBProxyAddress, ayg.address);
  await ayg.addMinter(vault.address);

  await deployer.deploy(Erc20_Nayg);
  const nayg = await Erc20_Nayg.deployed();
  await deployer.deploy(LPToken);
  const lptoken = await LPToken.deployed();
  network == "mainnet_fork" ? 
    (LINKProxyAddress = mainnet_fork.LINKProxy, BNBProxyAddress = mainnet_fork.BNBProxy) :
    (LINKProxyAddress = kovan.LINKProxy, BNBProxyAddress = kovan.BNBProxy);
  await deployer.deploy(PoolSwapStake, BNBProxyAddress, LINKProxyAddress, lptoken.address, ayg.address, nayg.address);
  const poolswap = await PoolSwapStake.deployed();
  await lptoken.addMinter(poolswap.address);
  await ayg.addMinter(poolswap.address);
  
  await deployer.deploy(Erc721_Nftayg);

  const nftayg = await Erc721_Nftayg.deployed();

  await deployer.deploy(Staking, ayg.address,ayg.address);

  const stakingnft = await deployer.deploy(StakingNFT, nayg.address,nftayg.address);

  network == "mainnet_fork" ? 
    ethAddress = mainnet_fork :
    ethAddress = kovan;
    
  await nftayg.setApprovalForAll(stakingnft.address, true);
  await nayg.addAdmin(stakingnft.address);
};
