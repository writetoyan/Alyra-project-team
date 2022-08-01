// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
 
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title Staking Token (AYG)
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Implements a basic ERC20 staking token with incentive distribution.
*/
contract Erc20_Ayg is ERC20, Ownable {
    uint public amountFaucet = 10 * 10**18;

    event MintSupply(address addr, uint amount, string methode);
    event SetFaucet(uint amount);


	constructor() ERC20('AYG token', 'AYG') {
        _mint(msg.sender, 10000 * 10**18);
    } 

    struct Receiver {
        bool hasClaimed;
    }

    mapping(address => Receiver) public receiver;
    mapping(address => bool) private mintAdmin;
    uint maxTokenFaucet;

   /**@dev The faucet is limited to bootstrap users and give value to our token
    * @notice Be quick to claim and test our protocol. The faucet is limited
    * @param _receiver is the address that is claiming in the faucet
    */
	function faucet(address _receiver) external {
        require(msg.sender == _receiver, "You should own the account");
        require(!receiver[_receiver].hasClaimed, "Already claimed");
        require(maxTokenFaucet < 10000 * 10**18, "Faucet is empty");
        receiver[_receiver].hasClaimed = true;
        maxTokenFaucet += amountFaucet;
		_mint(_receiver, amountFaucet);
        emit MintSupply(_receiver, amountFaucet, "getFaucet");
	}

   /**
    * @notice The faucet for the Token AYG.
    * @param amount The amount to setup for claim faucet.
    */
	function setFaucet(uint amount) external onlyOwner {
        amountFaucet = amount;
        emit SetFaucet(amount);
	}

	function faucetNoLimit(address _receiver, uint _amout) external onlyOwner{
        require(maxTokenFaucet < 10000 * 10**18, "Faucet is empty");
        maxTokenFaucet += _amout * 10**18;
		_mint(_receiver, _amout * 10**18);
	}

    function addMinter(address _mintAdmin) external onlyOwner{
        mintAdmin[_mintAdmin] = true;
    }

    function vaultMint(address _minter, uint _amount) external {
        require(mintAdmin[msg.sender], "You cannot mint");
        _mint(_minter, _amount);
    }

    function vaultBurn(address _burner, uint _amount) external {
        require(mintAdmin[msg.sender], "You cannot burn");
        _burn(_burner, _amount);
    }


}
