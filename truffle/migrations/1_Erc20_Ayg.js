const Erc20_Ayg = artifacts.require("Erc20_Ayg");
const Staking = artifacts.require("Staking");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(Erc20_Ayg);
  const ayg = await Erc20_Ayg.deployed();
  await ayg.faucet(accounts[0], 100);
  await deployer.deploy(Staking, ayg.address);
  
};
