const ERC20_Ayg = artifacts.require("ERC20_Ayg");
const Staking = artifacts.require("Staking");
const EthVaultMintAyg = artifacts.require("EthVaultMintAyg");

const { mainnet_fork, kovan} = require("../helper-chainlink.js");

module.exports = async function (deployer, network) {
  await deployer.deploy(ERC20_Ayg);

  const ayg = await ERC20_Ayg.deployed();

  await deployer.deploy(Staking, ayg.address,ayg.address);
  network == "mainnet_fork" ? 
    (ethAddress = mainnet_fork.ETH, BNBProxyAddress = mainnet_fork.BNBProxy) :
    (ethAddress = kovan.ETH, BNBProxyAddress = kovan.BNBProxy);
  const vault = await deployer.deploy(EthVaultMintAyg, ethAddress, BNBProxyAddress, ayg.address);
  await ayg.addMinter(vault.address);
};
