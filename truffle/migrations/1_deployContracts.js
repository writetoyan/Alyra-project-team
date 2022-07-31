const Erc20_Ayg = artifacts.require("Erc20_Ayg");
const Staking = artifacts.require("Staking");
const EthUsdPriceFeed = artifacts.require("EthUsdPriceFeed");

const { mainnet_fork, kovan} = require("../helper-chainlink.js");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Erc20_Ayg);
  const ayg = await Erc20_Ayg.deployed();
  await ayg.faucet(accounts[0], 100);
  await deployer.deploy(Staking, ayg.address);
  network == "mainnet_fork" ? 
    ethAddress = mainnet_fork :
    ethAddress = kovan;
  await deployer.deploy(EthUsdPriceFeed, ethAddress);
};
