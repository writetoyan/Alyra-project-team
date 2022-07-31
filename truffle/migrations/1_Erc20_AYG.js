const Erc20_AYG = artifacts.require("Erc20_AYG");

module.exports = async (deployer) => {
  await deployer.deploy(Erc20_AYG);

  // Create instance
  const instance = await Erc20_AYG.deployed();

  // Preset amount for faucet
  await instance.setFaucet('1000000000000000000000');
  const value = await instance.amountFaucet();
  console.log("The faucet is set with value : "+value);

};