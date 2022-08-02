const ERC20_Ayg = artifacts.require("ERC20_Ayg");
const Staking = artifacts.require("Staking");
const EthVaultMintAyg = artifacts.require("EthVaultMintAyg");
const Web3 = require("web3");

const { mainnet_fork, kovan} = require("../helper-chainlink.js");

module.exports = async function (deployer, network) {
  await deployer.deploy(ERC20_Ayg);
  const ayg = await ERC20_Ayg.deployed();
  await deployer.deploy(Staking, ayg.address, ayg.address);
  const staking = await Staking.deployed()
  await ayg.transfer(staking.address, Web3.utils.toWei("10000"));
  network == "mainnet_fork" ? 
    (ethAddress = mainnet_fork.ETH, BNBProxyAddress = mainnet_fork.BNBProxy) :
    (ethAddress = kovan.ETH, BNBProxyAddress = kovan.BNBProxy);
  const vault = await deployer.deploy(EthVaultMintAyg, ethAddress, BNBProxyAddress, ayg.address);
  await ayg.addMinter(vault.address);
};
