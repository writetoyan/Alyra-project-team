//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface Iayg is IERC20{
    function faucet(address recipient, uint amount) external;
}

contract Staking {

    Iayg ayg;

    // Total staked
    uint public totalSupplyStaked;

    mapping (address => uint) public aygStakedBalances;

    uint8 constant public numberOfAygRewardPerBlock = 100;

    event Stake(address _stakerAddress, uint _amount); 
    event Unstake(address _stakerAddress, uint _amount, uint _rewardWon); 


    modifier amountNotNull(uint _amount) {
        require(_amount > 0, "amount = 0");
        _;
    }

    constructor(address _aygAddress) {
        ayg = Iayg(_aygAddress);
    }

    function stakeAyg(uint _amount) external amountNotNull(_amount){
        ayg.transferFrom(msg.sender, address(this), _amount);
        aygStakedBalances[msg.sender] += _amount;
        totalSupplyStaked += _amount;
        emit Stake(msg.sender, _amount); 
    }

    function unstakeAyg(uint _amount)  external amountNotNull(_amount){
        aygStakedBalances[msg.sender] -= _amount;
        totalSupplyStaked -= _amount;

        uint rewardWon = countReward(msg.sender);
        ayg.faucet(msg.sender,rewardWon);
        ayg.transfer(msg.sender, _amount);

        emit Unstake(msg.sender, _amount, rewardWon); 
    }

    function countReward(address _address) internal pure returns(uint){
        return 10;
    }
}