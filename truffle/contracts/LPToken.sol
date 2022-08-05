// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
 
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract LPToken is ERC20, Ownable {

    mapping(address => bool) mintAdmin;
    
	constructor() ERC20('LPToken', 'LPT') {} 

    function addMinter(address _mintAdmin) external onlyOwner {
        mintAdmin[_mintAdmin] = true;
    }

    function mint(address _address, uint256 _amount) external {
        require(mintAdmin[msg.sender], "You cannot mint");
        _mint(_address, _amount);
    }

    function burn(address _burner, uint _amount) external {
        require(mintAdmin[msg.sender], "You cannot burn");
        _burn(_burner, _amount);
    }

}