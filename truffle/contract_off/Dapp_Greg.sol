// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title Dapp AYG
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Contract for Dapp AYG
*/
contract Dapp_Greg is Ownable {

    /// @dev Structure of Erc20
    struct Erc20 {
        string name;
        string symbol;
        uint decimal;
    }

    mapping (address => Erc20) Erc20_list;

    event Erc20Registered(address _addr, string _name, string _symbol, uint _decimal); 

    /**
    * @dev Get data of a ERC20
    * @param _addr address of voter
    */
    function getErc20(address _addr) external view returns (Erc20 memory) {
        return Erc20_list[_addr];
    }

    /**
    * @dev Add a ERC20
    * @param _addr address of new ERC20
    * @param _name name of new ERC20
    * @param _symbol symbole of new ERC20
    * @param _decimal number decimal of new ERC20
    */
    function addErc20(address _addr, string memory _name, string memory _symbol, uint _decimal) external onlyOwner {
//        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
//        require(voters[_addr].isRegistered != true, 'Already registered');
    
        Erc20_list[_addr].name = _name;
        Erc20_list[_addr].symbol = _symbol;
        Erc20_list[_addr].decimal = _decimal;

        emit Erc20Registered(_addr, _name, _symbol, _decimal);
    }

}