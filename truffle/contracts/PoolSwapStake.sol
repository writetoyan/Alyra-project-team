//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; 
import "./ERC20_Ayg.sol";
import "./ERC20_Nayg.sol";
import "./LPToken.sol";

interface ILPToken {
    function mint(address _address, uint256 _amount) external;
    function burn(address _burner, uint _amount) external;
    function transferFrom(address _sender, address _receiver, uint256 _amount) external;
    function transfer(address _receiver, uint256 _amount) external;
}

interface IErc20_Ayg {
    function transferFrom(address _sender, address _receiver, uint256 _amount) external;
    function transfer(address _receiver, uint256 _amount) external;
    function vaultMint(address _minter, uint _amount) external;
}

interface IErc20_Nayg {
    function transferFrom(address _sender, address _receiver, uint256 _amount) external;
    function transfer(address _receiver, uint256 _amount) external;
}

contract PoolSwapStake {

    AggregatorV3Interface internal priceFeedBnbProxy;
    AggregatorV3Interface internal priceFeedLinkProxy;

    event NewStake(address addr, uint time, uint amount, uint stakeId);

    struct LPToken {
        uint256 amountAyg;
        uint256 amountNayg;
    }

    struct Staker {
        address stakerAddress;
        uint256 stakedAt;
        uint256 stakedAmount;
        uint256 rewardAt;
        uint stakedId;
    }

    LPToken public lptoken;
    address lpAddress;
    address aygAddress;
    address naygAddress;
    uint256 totalLPToken;
    uint stakeId;
    Staker[] public stakers;

    constructor(address priceFeedBnbProxyAddress, address priceFeedLinkProxyAddress, address _lpAddress,  address _aygAddress, address _naygAddress) {
        priceFeedBnbProxy = AggregatorV3Interface(priceFeedBnbProxyAddress);
        priceFeedLinkProxy = AggregatorV3Interface(priceFeedLinkProxyAddress); 
        lpAddress = _lpAddress;
        aygAddress = _aygAddress;
        naygAddress = _naygAddress;
    }

    function depositPool(uint256 _amountAyg, uint256 _amountNayg) external {
        IErc20_Ayg(aygAddress).transferFrom(msg.sender, address(this), _amountAyg);
        IErc20_Nayg(naygAddress).transferFrom(msg.sender, address(this), _amountNayg);
        lptoken.amountAyg += _amountAyg;
        lptoken.amountNayg += _amountNayg;
        uint256 lpTokenAmount = _amountAyg;
        ILPToken(lpAddress).mint(msg.sender, lpTokenAmount);
        totalLPToken += lpTokenAmount;
    }

///@dev The number of tokens to tranfer back is updated to take into account the trading fee added to the pool from swaps and impermanent loss
    function withdrawPool(uint256 _lpTokenAmount) external {
        require((_lpTokenAmount / 10000) * 10000 == _lpTokenAmount, "Amount too small");
        uint256 aygToTransfer;
        uint256 naygToTransfer;
        aygToTransfer = _lpTokenAmount * (lptoken.amountAyg *10000 / totalLPToken) / 10000 ;
        naygToTransfer = _lpTokenAmount * (lptoken.amountNayg * 10000 / totalLPToken) / 10000;
        ILPToken(lpAddress).burn(msg.sender, _lpTokenAmount);
        totalLPToken -= _lpTokenAmount;
        lptoken.amountAyg -= aygToTransfer;
        lptoken.amountNayg -= naygToTransfer;
        IErc20_Ayg(aygAddress).transfer(msg.sender, aygToTransfer);
        IErc20_Nayg(naygAddress).transfer(msg.sender, naygToTransfer);
    }

    function swapPoolAyg(uint256 _aygAmount) external {
        require((_aygAmount / 10000) * 10000 == _aygAmount, "Amount too small");
        uint256 naygToTransfer;
        uint256 tradingFees;
        uint256 naygToTransferAfterFees;
        naygToTransfer = _aygAmount * (lptoken.amountNayg * 10000 / lptoken.amountAyg) / 10000;
        lptoken.amountAyg += _aygAmount;
        tradingFees = naygToTransfer * 300 / 10000;
        naygToTransferAfterFees = naygToTransfer - tradingFees;
        lptoken.amountNayg -= naygToTransferAfterFees;
        IErc20_Ayg(aygAddress).transferFrom(msg.sender, address(this), _aygAmount);
        IErc20_Nayg(naygAddress).transfer(msg.sender, naygToTransferAfterFees);
    }

    function swapPoolNayg(uint256 _naygAmount) external {
        require((_naygAmount / 10000) * 10000 == _naygAmount, "Amount too small");
        uint256 aygToTransfer;
        uint256 tradingFees;
        uint256 aygToTransferAfterFees;
        aygToTransfer = _naygAmount * (lptoken.amountAyg * 10000 / lptoken.amountNayg) / 10000;
        lptoken.amountNayg += _naygAmount;
        tradingFees = aygToTransfer * 300 / 10000;
        aygToTransferAfterFees = aygToTransfer - tradingFees;
        lptoken.amountAyg -= aygToTransferAfterFees;
        IErc20_Nayg(naygAddress).transferFrom(msg.sender, address(this), _naygAmount);
        IErc20_Nayg(aygAddress).transfer(msg.sender, aygToTransferAfterFees);
    }

    function stake(uint256 _amount) external {
        ILPToken(lpAddress).transferFrom(msg.sender, address(this), _amount);
        Staker memory staker = Staker(msg.sender, block.timestamp, _amount, 0, stakeId);
        stakers.push(staker);
        emit NewStake(msg.sender, block.timestamp, _amount, stakeId);
        stakeId++;
    } 

    function unstake(uint256 _stakedId) external {
        require(stakers[_stakedId].stakedAmount > 0, "Zero token staked");
        require(stakers[_stakedId].stakerAddress == msg.sender, "This is not your staking");
        uint reward = ((block.timestamp - stakers[_stakedId].stakedAt) * 1 * stakers[_stakedId].stakedAmount) / 100000 ;
        uint unstakeAmount = stakers[_stakedId].stakedAmount;
        stakers[_stakedId].stakedAmount = 0;
        ILPToken(lpAddress).transfer(msg.sender, unstakeAmount);
        IErc20_Ayg(aygAddress).vaultMint(msg.sender, reward);
    }

        /// @dev The right price feed contract address corresponding to the network used will be given at deployment by the helper-chainlink file
    /** * Returns the latest price */     

    function getLatestPriceBnbProxy() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedBnbProxy.latestRoundData();                 
        return uint(price * 10000000000);  
        }   

    function getLatestPriceLinkProxy() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedLinkProxy.latestRoundData();                 
        return uint(price * 10000000000);  
        }    

}