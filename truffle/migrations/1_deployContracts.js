const ERC20_Ayg = artifacts.require("ERC20_Ayg");
const Staking = artifacts.require("Staking");
const EthUsdPriceFeed = artifacts.require("EthUsdPriceFeed");

const { mainnet_fork, kovan} = require("../helper-chainlink.js");

module.exports = async function (deployer, network) {
  await deployer.deploy(ERC20_Ayg);

  const ayg = await ERC20_Ayg.deployed();

  await deployer.deploy(Staking, ayg.address,ayg.address);
  network == "mainnet_fork" ? 
    ethAddress = mainnet_fork :
    ethAddress = kovan;
  await deployer.deploy(EthUsdPriceFeed, ethAddress);
};
