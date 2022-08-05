const Erc20_Ayg = artifacts.require("Erc20_Ayg");
const Erc20_Nayg = artifacts.require("Erc20_Nayg");
const Erc721_Nftayg = artifacts.require("Erc721_Nftayg");
const Staking = artifacts.require("Staking");
const StakingNFT = artifacts.require("StakingNFT");
const EthUsdPriceFeed = artifacts.require("EthUsdPriceFeed");

const { mainnet_fork, kovan} = require("../helper-chainlink.js");

module.exports = async function (deployer, network) {
  await deployer.deploy(Erc20_Ayg);
  await deployer.deploy(Erc20_Nayg);
  await deployer.deploy(Erc721_Nftayg);

  const ayg = await Erc20_Ayg.deployed();
  const nayg = await Erc20_Nayg.deployed();
  const nftayg = await Erc721_Nftayg.deployed();

  await deployer.deploy(Staking, ayg.address,ayg.address);

  const stakingnft = await deployer.deploy(StakingNFT, nayg.address,nftayg.address);

  network == "mainnet_fork" ? 
    ethAddress = mainnet_fork :
    ethAddress = kovan;
  await deployer.deploy(EthUsdPriceFeed, ethAddress);

  await nftayg.setApprovalForAll(stakingnft.address, true);
  await nayg.addAdmin(stakingnft.address);
};
