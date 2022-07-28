const Erc20_AYG = artifacts.require("Erc20_AYG");

module.exports = function (deployer) {
  deployer.deploy(Erc20_AYG);
};
