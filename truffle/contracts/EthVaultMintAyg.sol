// SPDX-License-Identifier: MIT 

pragma solidity 0.8.15; 

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; 
import "./ERC20_Ayg.sol";

/// @title AYG VAULT 
/// @author Alex YE, Gregory Badet, Yannick Jen
/// @notice Smart contract to get AYG token by providing collateral in ETH 
/// @dev The contract use Chainlink price feed to determine the amount of AYG that can be minted with ETH

interface IErc20_Ayg {
    function vaultMint(address _minter, uint _amount) external;
    function vaultBurn(address _burner, uint _amount) external;
}

contract EthVaultMintAyg {     

    AggregatorV3Interface internal priceFeedEth; 
    AggregatorV3Interface internal priceFeedBnbProxy;    
    mapping (address => uint) vaultDepositAmount;
    address aygAddress; 

    ///@dev Event that is emited when a user deposited ETH to the vault
    ///@param _user is the address of the minter
    ///@param _amountDeposited is the amount of eth provided as a collateral
    ///@param _aygMinted is the amount of AYG minted by providing ETH as a collateral in the vault
    event vaultDeposited(address _user, uint256 _amountDeposited, uint _aygMinted);

    ///@dev Event that is emited when a user burn their AYG to get back their ETH based on the value of the market
    ///@param _user is the adddress of the burner
    ///@param _amount is the amount of AYG burned
    event vaultWithdrawn(address _user, uint256 _amount);

    ///@dev We use Chainlink price feed 
    constructor(address priceFeedEthAddress, address priceFeedBnbProxyAddress, address _aygAddress) { 
        priceFeedEth = AggregatorV3Interface(priceFeedEthAddress); 
        priceFeedBnbProxy = AggregatorV3Interface(priceFeedBnbProxyAddress);
        aygAddress = _aygAddress;
    }  

    ///@notice Use this function to mint AYG by providing ETH as a collateral
    ///@dev The contract have the autorisation to mint from the AYG contract given at deployment
    ///@param _depositAmount is the amount of ETH 
    function vaultDeposit(uint _depositAmount) external payable {
        uint aygToMint;
        aygToMint = (_depositAmount * getLatestPriceEth() / getLatestPriceBnbProxy()) / 2;
        vaultDepositAmount[msg.sender] += _depositAmount;
        IErc20_Ayg(aygAddress).vaultMint(msg.sender, aygToMint);
        emit vaultDeposited(msg.sender, _depositAmount, aygToMint);
    }

    ///@notice Use this function to burn your AYG and get back your collateral based on Chainlink price feed
    ///@dev The AYG will be burned from the total supply
    ///@param _burnAmount is the amount of AYG to burn
    function vaultWithdraw(uint _burnAmount) external payable {
        IErc20_Ayg(aygAddress).vaultBurn(msg.sender, _burnAmount);
        uint ethRedeem;
        ethRedeem = (_burnAmount * getLatestPriceBnbProxy() / getLatestPriceEth()) * 2;
        vaultDepositAmount[msg.sender] -= ethRedeem;
        (bool success, ) = msg.sender.call{value: ethRedeem}("");
        require(success, "failed to send Ether");   
        emit vaultWithdrawn(msg.sender, _burnAmount);
    }
    
    /// @dev The right price feed contract address corresponding to the network used will be given at deployment by the helper-chainlink file
    /** * Returns the latest price */     

    function getLatestPriceEth() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedEth.latestRoundData();                 
        return uint(price * 10000000000);  
        }    
    ///@dev We use the price of BNB for our AYG token
    function getLatestPriceBnbProxy() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedBnbProxy.latestRoundData();                 
        return uint(price * 10000000000);  
        }   
}