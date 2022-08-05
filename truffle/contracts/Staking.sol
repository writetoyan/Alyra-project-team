//SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Pausable.sol";

/// @title Smart contract for staking ERC20 tokens with a locked time
/// @author Alex YE, Gregory Badet, Yannick Jen
/// @notice This smart contract permits to stake ERC20 tokens in a locked time in order to earn rewards
/// @dev The contract is protected of reentrancy attack for the sensible function and
/// @dev can be paused by the owner in case of suspicious movements
/// @dev the reward token and the staking token can be different or
/// @dev the same
contract Staking is ReentrancyGuard, Pausable {

    /* ========== STATE VARIABLES ========== */

    Iayg private rewardsToken;
    Iayg private stakingToken;
    uint256 private periodFinish = type(uint256).max;
    uint256 public rewardRate = 1;
    uint256 private rewardsDuration = 365 days;
    uint256 private lastUpdateTime;
    uint256 private rewardPerTokenStored;

    mapping(address => uint256) private userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public stakingTime;
    mapping(address => uint256) public firstStakingTime;

    uint256 public _totalSupply;
    mapping(address => uint256) private _balances;

    /* ========== EVENTS ========== */

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    /* ========== CONSTRUCTOR ========== */

    constructor(address _rewardsToken, address _stakingToken) {
        rewardsToken = Iayg(_rewardsToken);
        stakingToken = Iayg(_stakingToken);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== VIEWS ========== */

    /// @notice Total supply staked in the Vault
    /// return _totalSupply the total supply
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    /// @notice Get the balance staked of an account
    /// @param account the address of the account that you want the balance of
    /// return _balances the balance of the account 
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    /// @notice Get the timestamp of the last calculated rewards 
    /// return timestamp the timestamp
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /// @notice Get the reward for all the total supply currently staked
    /// return rewardPerTokenStored the reward currently staked
    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored + (
                (lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18 / _totalSupply
            );
    }

    /// @notice Get the reward earning for an account for all his staked tokens
    /// return earning The earning of an account
    function earned(address account) public view returns (uint256) {
        return ( 
            _balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18 
            ) + rewards[account];
    }

    /// @notice Get the total reward given by the staking smart contract for the duration set
    /// return totalReward The total reward given
    function getRewardForDuration() external view returns (uint256) {
        return rewardRate * rewardsDuration;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /// @notice Stake tokens in the Smart contract
    /// return amount The amount of tokens to stake
    function stake(uint256 amount) external nonReentrant notPaused updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply + amount;
        _balances[msg.sender] = _balances[msg.sender] + amount;
        stakingTime[msg.sender] = block.timestamp;

        if(firstStakingTime[msg.sender] == 0){
            firstStakingTime[msg.sender] = block.timestamp;
        }

        stakingToken.transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /// @notice Withdraw the staked token
    /// return amount The amount of tokens to withdraw
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        _totalSupply = _totalSupply - amount;
        _balances[msg.sender] = _balances[msg.sender] - amount;
        if(_balances[msg.sender] == 0){
            stakingTime[msg.sender] = 0;
            firstStakingTime[msg.sender] = 0;
        }
        stakingToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /// @notice Withdraw the rewards earned with the staked tokens
    /// return reward The rewards earned
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /// @notice Withdraw the staked tokens and rewards earned with the staked tokens
    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    /// @notice Get the staking duration from a staking time
    /// @dev this function is used to calculate the current staking time of an account
    /// @param _firstStakingTime a time
    /// return stakingTime The staking time
    function getStakingDuration(uint256 _firstStakingTime) external view returns(uint256 duration){
        return (block.timestamp - _firstStakingTime);
    }

    /// @notice Get the APR for a staking amount that user want to stake
    /// @param _stakingAmount the staking amount
    /// return APR The APR
    function getAPROfAmountToStake(uint256 _stakingAmount) external view returns(uint256 apr){
        return ((rewardRate * 3600 * 24 * 365 * (_stakingAmount * 1000000 / (_totalSupply + _stakingAmount)) / 1000000) / _stakingAmount) ;
    }

    /// @notice Get the APR for a staking amount currently staked in the Smart contract for the current user
    /// return APR The APR
    function getMyStakingApr() external view returns(uint256 apr){
        return (rewardRate * 3600 * 24 * 365 * (_balances[msg.sender] * 1000000 / _totalSupply / 1000000)) / _balances[msg.sender] ;
    }

    /// @notice Set the reward rate of the SC
    /// @param _rewardRate the reward rate
    function setRewardRate(uint256 _rewardRate) external onlyOwner{
        rewardRate = _rewardRate;
    }

    /// @notice Set the end of the period of reward distribution of the SC
    /// @param _periodFinish the finished time of reward distribution
    function setPeriodFinish(uint256 _periodFinish) external onlyOwner{
        periodFinish = _periodFinish;
    }

    /// @notice Set the end of the reward distribution of the SC
    /// @dev used only for calculating the total amount of reward distribution
    /// param _rewardsDuration the reward distribution time
    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner{
        rewardsDuration = _rewardsDuration;
    }
    
}

/// @notice The interface of our ERC20 token AYG
interface Iayg is IERC20{
    function faucet(address recipient, uint amount) external;
}