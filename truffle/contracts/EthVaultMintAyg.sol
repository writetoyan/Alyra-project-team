// SPDX-License-Identifier: MIT 

pragma solidity 0.8.15; 

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; 
import "./ERC20_Ayg.sol";

interface IErc20_Ayg {
    function vaultMint(address _minter, uint _amount) external;
    function vaultBurn(address _burner, uint _amount) external;
}

contract EthVaultMintAyg {     

    AggregatorV3Interface internal priceFeedEth; 
    AggregatorV3Interface internal priceFeedBnbProxy;    
    mapping (address => uint) vaultDepositAmount;
    address aygAddress; 

    event vaultDeposited(address user, uint256 amount);

    constructor(address priceFeedEthAddress, address priceFeedBnbProxyAddress, address _aygAddress) { 
        priceFeedEth = AggregatorV3Interface(priceFeedEthAddress); 
        priceFeedBnbProxy = AggregatorV3Interface(priceFeedBnbProxyAddress);
        aygAddress = _aygAddress;
    }  

    function vaultDeposit(uint _depositAmount) external payable {
        uint aygToMint;
        aygToMint = (_depositAmount * getLatestPriceEth() / getLatestPriceBnbProxy()) / 2;
        vaultDepositAmount[msg.sender] += _depositAmount;
        IErc20_Ayg(aygAddress).vaultMint(msg.sender, aygToMint);
        emit vaultDeposited(msg.sender, _depositAmount);
    }

    function vaultWithdraw(uint _burnAmount) external payable {
        IErc20_Ayg(aygAddress).vaultBurn(msg.sender, _burnAmount);
        uint ethRedeem;
        ethRedeem = (_burnAmount * getLatestPriceBnbProxy() / getLatestPriceEth()) * 2;
        vaultDepositAmount[msg.sender] -= ethRedeem;
        (bool success, ) = msg.sender.call{value: ethRedeem}("");
        require(success, "failed to send Ether");   
    }
    
    /// @dev The right price feed contract address corresponding to the network used will be given at deployment by the helper-chainlink file
    /** * Returns the latest price */     

    function getLatestPriceEth() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedEth.latestRoundData();                 
        return uint(price * 10000000000);  
        }    

    function getLatestPriceBnbProxy() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedBnbProxy.latestRoundData();                 
        return uint(price * 10000000000);  
        }   
}
