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

    // VARIABLES
    mapping(address => bool) admins;

    uint maxTokenFaucet;
    uint public amountFaucet = 1000*10**18;


    // EVENTS
    event MintSupply(address addr, uint amount, string methode);
    event SetFaucet(uint amount);


    // CONSTRUCTORS
    constructor() ERC20("nAYG Token", "nAYG") {
        _mint(msg.sender, 20000 * 10**18);
        emit MintSupply(msg.sender, 20000 * 10**18, "getFaucet");
    }


    // MODIFIERS
    modifier onlyAdmin() {
        require(admins[msg.sender], "You're not an admin");
        _;
    }


   /**@dev The reward for token ERC20 nAYG
    * @notice Claim reward from staking on our protocol.
    * @param _to is the address that is claiming in the reward
    * @param _amount is the amount of reward claim
    */
    function getReward(address _to, uint _amount) external onlyAdmin {
        //require(admins[msg.sender], "You are not admin");
        _mint(_to, _amount);
        emit MintSupply(_to, _amount, "getReward");
    } 


   /**@dev The faucet for token ERC20 nAYG
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
    * @notice The faucet for the Staking Token AYG.
    * @param recipient is thee address to receive all tokens on construction.
    * @param amount is the amount of tokens to mint on construction.
    */
	function faucet(address recipient, uint amount) external {
		_mint(recipient, amount);
        emit MintSupply(recipient, amount, "getFaucet");
	}


   /**
    * @notice Setter amount for faucet of Token nAYG.
    * @param amount is the amount to setup for claim faucet.
    */
	function setFaucet(uint amount) external onlyOwner {
        amountFaucet = amount;
        emit SetFaucet(amount);
	}


   /**
    * @notice Add user to approuve contract
    * @param _addr is the address to set approve contract
    */
    function addAdmin(address _addr) external onlyOwner {
        admins[_addr] = true;
    }


   /**
    * @notice Remove user to approuve contract
    * @param _addr is the address to unset approve contract
    */
    function delAdmin(address _addr) external onlyOwner {
        admins[_addr] = false;
    }
}