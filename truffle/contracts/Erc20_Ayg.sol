// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
 
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
 
contract Erc20_Ayg is ERC20 {
	constructor() ERC20('AYG token', 'AYG') {} 

	// fonction faucet pour créer des AYG tokens
	function faucet(address recipient, uint amount) external {
		_mint(recipient, amount);
	}
}
