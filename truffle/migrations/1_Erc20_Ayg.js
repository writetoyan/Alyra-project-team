// const Erc20_Ayg = artifacts.require("Erc20_Ayg");

// module.exports = function (deployer) {
//   deployer.deploy(Erc20_Ayg);
// };


const Staking = artifacts.require("Staking");

let address = '0xBc7bA86803C8117cD02a92ca10aDcd8601Ae0497';
module.exports = function (deployer) {
  deployer.deploy(Staking,address);
};
