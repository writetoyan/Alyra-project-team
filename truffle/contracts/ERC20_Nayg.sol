// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title ERC20 Token (nAYG)
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Implements a basic ERC20 token
*/
contract Erc20_Nayg is ERC20, Ownable {

    mapping(address => bool) admins;

    uint maxTokenFaucet;
    uint public amountFaucet = 100*10**18;

    event MintSupply(address addr, uint amount, string methode);
    event SetFaucet(uint amount);

    constructor() ERC20("nAYG Token", "nAYG") {}

    modifier onlyAdmin() {
        require(admins[msg.sender], "You're not an admin");
        _;
    }

   /**@dev Reward for token ERC20 nAYG
    * @notice Claim reward from staking on our protocol.
    * @param _to is the address that is claiming in the reward
    * @param _amount is the amount of reward claim
    */
    function getReward(address _to, uint _amount) external onlyAdmin {
        //require(admins[msg.sender], "You are not admin");
        _mint(_to, _amount);
        emit MintSupply(_to, _amount, "getReward");
    } 


   /**@dev Faucet for token ERC20 nAYG
    * @notice Be quick to claim and test our protocol. The faucet is unlimited
    * @param _receiver is the address that is claiming in the faucet
    */
	function getFaucet(address _receiver) external {
        require(msg.sender == _receiver, "You should own the account");
        require(maxTokenFaucet < 10000 * 10**18, "Faucet is empty");
        maxTokenFaucet += amountFaucet;
		_mint(_receiver, amountFaucet);
        emit MintSupply(_receiver, amountFaucet, "getFaucet");
	}


   /**
    * @notice The faucet for the Token nAYG.
    * @param amount The amount to setup for claim faucet.
    */
	function setFaucet(uint amount) external onlyOwner {
        amountFaucet = amount;
        emit SetFaucet(amount);
	}


    function addAdmin(address _addr) external onlyOwner {
        admins[_addr] = true;
    }


    function delAdmin(address _addr) external onlyOwner {
        admins[_addr] = false;
    }
}