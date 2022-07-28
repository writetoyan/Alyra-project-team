// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
 
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
 
/**
* @title Staking Token (AYK)
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Implements a basic ERC20 staking token with incentive distribution.
*/
contract Erc20_Ayg is ERC20 {
	constructor() ERC20('AYG token', 'AYG') {} 

	// fonction faucet pour créer des AYG tokens
   /**
    * @notice The constructor for the Staking Token.
    * @param _owner The address to receive all tokens on construction.
    * @param _supply The amount of tokens to mint on construction.
    */
	function faucet(address _owner, uint _supply) external {
		_mint(_owner, _supply);
	}
}