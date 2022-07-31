const Erc20_YNK = artifacts.require("Erc20_YNK");

module.exports = function (deployer) {
  deployer.deploy(Erc20_YNK);
};
