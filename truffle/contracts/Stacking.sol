//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract Stacking {

    IERC20 ayg;

    mapping (address => uint) public aygBalances;

    constructor(address _aygAddress) {
        ayg = IERC20(_aygAddress);
    }

    function approveAyg(address _spender, uint _amount) external {

        ayg.approve(_spender, _amount);
    }

    function stackAyg(uint _amount) external {
     
        ayg.transferFrom(msg.sender, address(this), _amount);
        aygBalances[msg.sender] += _amount;

    }
}