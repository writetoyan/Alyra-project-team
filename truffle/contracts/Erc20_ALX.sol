// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
 
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
 
/**
* @title Staking Token (ALX)
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Implements a basic ERC20 staking token with incentive distribution.
*/
contract Erc20_ALX is ERC20 {
	constructor() ERC20('ALX token', 'ALX') {} 

    event MintSupply(address _addr, uint _amount);

   /**
    * @notice The faucet for the Staking Token ALX.
    * @param recipient The address to receive all tokens on construction.
    * @param amount The amount of tokens to mint on construction.
    */
	function faucet(address recipient, uint amount) external {
		_mint(recipient, amount);
        emit MintSupply(recipient, amount);
	}
}