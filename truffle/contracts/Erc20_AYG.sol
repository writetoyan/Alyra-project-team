// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
 
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
 
/**
* @title Staking Token (AYG)
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Implements a basic ERC20 staking token with incentive distribution.
*/
contract Erc20_AYG is ERC20, Ownable {
	constructor() ERC20('AYG Token', 'AYG') {} 

    uint public amountFaucet;

    event MintSupply(address addr, uint amount, string methode);
    event SetFaucet(uint amount);

   /**
    * @notice The faucet for the Token AYG.
    * @param recipient The address to receive all tokens on construction.
    */
	function getFaucet(address recipient) external {
        uint amount = amountFaucet;
		_mint(recipient, amount);
        emit MintSupply(recipient, amount, "getFaucet");
	}

   /**
    * @notice The faucet for the Token AYG.
    * @param amount The amount to setup for claim faucet.
    */
	function setFaucet(uint amount) external onlyOwner {
        amountFaucet = amount;
        emit SetFaucet(amount);
	}

   /**
    * @notice The reward for the Staking Token AYG.
    * @param recipient The address to receive all tokens on construction.
    * @param amount The amount of tokens to mint on construction.
    */
	function getReward(address recipient, uint amount) external {
		_mint(recipient, amount);
        emit MintSupply(recipient, amount, "getReward");
	}

} 