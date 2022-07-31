// SPDX-License-Identifier: MIT 

pragma solidity 0.8.15; 

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; 

contract EthUsdPriceFeed {     

    AggregatorV3Interface internal priceFeed;     

/// @dev The right ETH / USD contract address corresponding to the network used will be given at deployment by the helper-chainlink file

    constructor(address priceFeedAddress) { 

        priceFeed = AggregatorV3Interface(priceFeedAddress); 

    }     /** * Returns the latest price */     

    function getLatestPrice() public view returns (int) {  

        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         

        = priceFeed.latestRoundData();                 

        return price;             

        }    

}
