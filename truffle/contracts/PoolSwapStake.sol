//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol"; 
import "./ERC20_Ayg.sol";
import "./ERC20_Nayg.sol";
import "./LPToken.sol";

/// @title Provide liquidity, swap and stake LP token
/// @author Alex YE, Gregory Badet, Yannick Jen
/// @notice Smart contract to provide liquidity on the protocol, stake the LP token for reward and swap in the corresponding pool
/// @dev The contract use Chainlink price feed to determine the original amount of AYG and NAYG to pool together

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

    struct SLPToken {
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

    SLPToken public lptoken;
    address lpAddress;
    address aygAddress;
    address naygAddress;
    uint256 public totalLPToken;
    uint stakeId;
    Staker[] public stakers;

    ///@dev Event that is emitted when there is a new LP staking in the smart contract
    ///@param _addr address of the staker
    ///@param _time timestamp of when the staker staked
    ///@param _amount amount of LP token staked
    ///@param _stakeId the id of the stake
    event NewStake(address _addr, uint _time, uint _amount, uint _stakeId);

    ///@dev Event that is emitted when there us an unstaking
    ///@param _addr is the address of the person who unstake
    ///@param _amount is the amount unstaked from the staking id 
    ///@param _reward is the reward received by the staker for his staking
    event Unstake(address _addr, uint _amount, uint _reward);

    ///@dev Event that is emitted when the user deposit AYG and NAYG tokens in the liquidity pool of the protocol
    ///@param _lptokenMinted is the amount 1 - 1 of LP token minted for the pooler based on the amount of AYG token deposited
    event DepositPool(address _addr, uint _aygDeposited, uint _naygDeposited, uint _lptokenMinted);

    ///@dev Event that is emmtted when the user withdraw from the pool
    ///@param _lptokenBurned is the amount of LP token burned 
    event WithdrawPool(address _addr, uint _aygWithdrawn, uint _naygWithdrawn, uint _lptokenBurned);

    ///@dev Event that is emitted when there is a swap from AYG to NAYG
    ///@param _tradingFees is the trading fees paid by the user based on less NAYG received from the swap
    event SwapedAyg(address _swaperAddr, uint _swapedAmount, uint _amountReceived, uint _tradingFees);

    ///@dev Event that is emitted when there is a swap from NAYG to AYG
    ///@param _tradingFees is the trading fees paid in AYG based on less AYG received from the swap 
    event SwapedNayg(address _swaperAddr, uint _swapedAmount, uint _amountReceived, uint _tradingFees);

    ///@dev The contract need to have the chainlink price feed of the tokens and their respective address to be able to call them
    ///@param priceFeedBnbProxyAddress is the price feed of the BNB address. We based our AYG token to the value of that token
    ///@param priceFeedLinkProxyAddress is the price feed of the Link token. We based our NAYG token to the value of that token
    ///@param _lpAddress is the address of the LP token contract to be able to mint/burn them in exchange of the liquidity provided
    ///@param _aygAddress is the address of the AYG token in order to give the contract the ability to mint reward in AYG for the LP token staked
    ///@param _naygAddress is the address of the NAYG token 
    constructor(address priceFeedBnbProxyAddress, address priceFeedLinkProxyAddress, address _lpAddress,  address _aygAddress, address _naygAddress) {
        priceFeedBnbProxy = AggregatorV3Interface(priceFeedBnbProxyAddress);
        priceFeedLinkProxy = AggregatorV3Interface(priceFeedLinkProxyAddress); 
        lpAddress = _lpAddress;
        aygAddress = _aygAddress;
        naygAddress = _naygAddress;
    }

    ///@notice Use this function to deposit AYG and NAYG token into the pool and earn trading fees
    ///@dev LP token is minted 1-1 on the amount of AYG token deposited
    ///@dev The ration between AYG and NAYG is determined 50-50 in dollar amount using chainlink price feed
    function depositPool(uint256 _amountAyg, uint256 _amountNayg) external {
        IErc20_Ayg(aygAddress).transferFrom(msg.sender, address(this), _amountAyg);
        IErc20_Nayg(naygAddress).transferFrom(msg.sender, address(this), _amountNayg);
        lptoken.amountAyg += _amountAyg;
        lptoken.amountNayg += _amountNayg;
        uint256 lpTokenAmount = _amountAyg;
        ILPToken(lpAddress).mint(msg.sender, lpTokenAmount);
        totalLPToken += lpTokenAmount;
        emit DepositPool(msg.sender, _amountAyg, _amountNayg, lpTokenAmount);
    }

    ///@notice Use this function to withdraw your share in the pool in exchange of the LP token minted when you deposited
    ///@dev The number of tokens to tranfer back is updated to take into account the trading fees added to the pool from swaps and impermanent loss
    ///@param _lpTokenAmount is the amount of LP token that will be burned to get back the share of the pool
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
        emit WithdrawPool(msg.sender, aygToTransfer, naygToTransfer, _lpTokenAmount);
    }

    ///@notice Use this function to swap your AYG to NAYG
    ///@dev the trading fees is paid in the token that is bought by directly deducting them from the swap
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
        emit SwapedAyg(msg.sender, _aygAmount, naygToTransferAfterFees, tradingFees);
    }

    ///@notice Use this function to swap your NAYG to AYG 
    ///@dev The trading fees is paid in AYG and deducted directly from the swaping rate 
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
        emit SwapedNayg(msg.sender, _naygAmount, aygToTransferAfterFees, tradingFees);
    }

    ///@notice Use this function to stake your LP token and earn reward in AYG token
    ///@notice One stake = one ID. If you stake more another day, you will have a different ID for that particular stake
    ///@dev Each stake is memorised in a struct and is given an different ID
    function stake(uint256 _amount) external {
        ILPToken(lpAddress).transferFrom(msg.sender, address(this), _amount);
        Staker memory staker = Staker(msg.sender, block.timestamp, _amount, 0, stakeId);
        stakers.push(staker);
        emit NewStake(msg.sender, block.timestamp, _amount, stakeId);
        stakeId++;
    } 

    ///@notice Use this function to unstake your LP token and collect your reward with it
    ///@dev The LP token will be transfert back and the reward in AYG will be minted to the staker
    function unstake(uint256 _stakedId) external {
        require(stakers[_stakedId].stakedAmount > 0, "Zero token staked");
        require(stakers[_stakedId].stakerAddress == msg.sender, "This is not your staking");
        uint reward = ((block.timestamp - stakers[_stakedId].stakedAt) * 1 * stakers[_stakedId].stakedAmount) / 100000 ;
        uint unstakeAmount = stakers[_stakedId].stakedAmount;
        stakers[_stakedId].stakedAmount = 0;
        ILPToken(lpAddress).transfer(msg.sender, unstakeAmount);
        IErc20_Ayg(aygAddress).vaultMint(msg.sender, reward);
        emit Unstake(msg.sender, unstakeAmount, reward);
    }

        /// @dev The right price feed contract address corresponding to the network used will be given at deployment by the helper-chainlink file
    /** * Returns the latest price */     

    ///@dev The price of AYG is feeded by the price feed of BNB
    function getLatestPriceBnbProxy() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedBnbProxy.latestRoundData();                 
        return uint(price * 10000000000);  
        }   

    ///@dev The price feed of NAYG is feeded by the price of LINK token
    function getLatestPriceLinkProxy() public view returns (uint) {  
        ( /*uint80 roundID*/, int price, /*uint startedAt*/,  /*uint timeStamp*/, /*uint80 answeredInRound*/ )         
        = priceFeedLinkProxy.latestRoundData();                 
        return uint(price * 10000000000);  
        }    

}