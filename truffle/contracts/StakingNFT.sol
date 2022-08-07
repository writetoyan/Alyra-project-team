// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import './ERC20_Nayg.sol';
import './ERC721_Nftayg.sol';

/**
* @title Staking NFT (token NFTAYG)
* @author Alex YE, Yannick JEN, Gregory BADET
* @notice Implements a contract for staking NFT with token reward $nAYG
* @notice NFTs boost reward 10% /+20% / +50% when final claim.
*/
contract StakingNFT {

    // VARIABLES
    uint totalStaked;

    struct Staking {
        uint tokenId;
        uint stakingStartTime;
        address owner;
    }

    mapping(uint => Staking) NFTsStaked;

    uint public rewardsPerHour = 10000*10**18;  // 10000 nAYG per hour


    // EVENTS
    event Staked(address indexed owner, uint tokenId, uint value);
    event Unstaked(address indexed onwer, uint tokenId, uint value);
    event Claimed(address indexed owner, uint totalEarned, uint totalReward, uint totalBonus);


    // CONSTRUCTORS
    constructor(Erc20_Nayg _token, Erc721_Nftayg _nft) {
        token = _token;
        nft = _nft;
    }


    //pointer
    Erc20_Nayg token;
    Erc721_Nftayg nft;


   /**@dev The function for staking NFT
    * @notice Stake yours NFT for win reward $nAYG
    * @notice Only owner of NFT can stake his NFT
    * @notice Only 5 NFT can be staked in one action (Dos protection on loop For)
    * @param tokenIds is an array of id NFT who will be stacked
    */
    function Stake(uint[] calldata tokenIds) external {
        // mettre require pr limité taille de tokenIds
        require(tokenIds.length>0, "Min 1 NFTs can be staked per action");
        require(tokenIds.length<5, "Max 5 NFTs can be staked per action");
        uint tokenId;
        totalStaked += tokenIds.length;

        for(uint i = 0 ; i < tokenIds.length ; i++) {
            tokenId = tokenIds[i];
            require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
            require(NFTsStaked[tokenId].stakingStartTime == 0, "Already Staked");

            nft.transferFrom(msg.sender, address(this), tokenId);
            emit Staked(msg.sender, tokenId, block.timestamp);

            NFTsStaked[tokenId] = Staking({
                tokenId: uint(tokenId),
                stakingStartTime: uint(block.timestamp), 
                owner: msg.sender
            });

        }
    }


   /**@dev The function for unstaking NFT
    * @notice Unstake yours NFT and get reward $nAYG
    * @notice Only owner of NFT can unstake his NFT
    * @notice Only 5 NFT can be unstaked in one action (Dos protection on loop For)
    * @param owner is address of user
    * @param tokenIds is an array of id NFT who will be stacked
    */
    function _unStakeNFTs(address owner, uint[] calldata tokenIds) internal {
        require(tokenIds.length>0, "Min 1 NFTs can be staked per action");
        require(tokenIds.length<5, "Max 5 NFTs can be staked per action");
        uint tokenId;
        totalStaked -= tokenIds.length;

        for(uint i = 0 ; i < tokenIds.length ; i++) {
            tokenId = tokenIds[i];
            require(NFTsStaked[tokenId].owner == msg.sender, "Not the owner");

            emit Unstaked(owner, tokenId, block.timestamp);
            delete NFTsStaked[tokenId];

            nft.transferFrom(address(this), owner, tokenId);
        }
    }


   /**@dev The function for claim rewards $nAYG only
    * @notice Get yours rewards without unstake your NFT
    * @param tokenIds is an array of id NFT who will be claim
    */
    function claim(uint[] calldata tokenIds) external {
        require(tokenIds.length>0, "Min 1 NFTs can be claimed per action");
        require(tokenIds.length<5, "Max 5 NFTs can be claimed per action");
        _claim(msg.sender, tokenIds, false);
    }


   /**@dev The function for claim rewards $nAYG and unstake your NFT
    * @notice Get yours rewards with unstake your NFT
    * @param tokenIds is an array of id NFT who will be claim and unstacked
    */
    function unstake(uint[] calldata tokenIds) external {
        require(tokenIds.length>0, "Min 1 NFTs can be claimed and unstaked per action");
        require(tokenIds.length<5, "Max 5 NFTs can be claimed and unstaked per action");
        _claim(msg.sender, tokenIds, true);
    }


   /**@dev The function for claim rewards $nAYG with unstake or not your NFT
    * @notice Get yours rewards with unstake or not your NFT
    * @notice Reward is calculed on base : 10000 nAYG per hour
    * @param owner is address of user
    * @param tokenIds is an array of id NFT who will be claim and unstacked
    */
    function _claim(address owner, uint[] calldata tokenIds, bool _unstake) internal {
        require(tokenIds.length>0, "Min 1 NFTs can be claimed and unstaked per action");
        require(tokenIds.length<5, "Max 5 NFTs can be claimed and unstaked per action");
        uint tokenId;
        uint earnedReward;
        uint earnedBonus;
        uint totalEarnedReward;
        uint totalEarnedBonus;
        uint totalEarned;

        // Reward
        for(uint i = 0; i < tokenIds.length ; i++) {
            tokenId = tokenIds[i];
            Staking memory thisStake = NFTsStaked[tokenId];
            require(thisStake.owner == owner, "Not the owner, you cannot claim not awards");

            uint stakingStartTime = thisStake.stakingStartTime;

            earnedReward = ((block.timestamp - stakingStartTime) * rewardsPerHour) / 3600;
            earnedBonus = earnedReward * _getBoosterById(tokenId) / 100;

            totalEarnedReward += earnedReward;
            totalEarnedBonus += earnedBonus;

            NFTsStaked[tokenId] = Staking({
                tokenId: uint(tokenId),
                stakingStartTime: uint(block.timestamp),
                owner: owner
            });
        }

        totalEarned = totalEarnedReward + totalEarnedBonus;

        if(totalEarned > 0) {
            token.getReward(owner, totalEarned);
        }

        if(_unstake) {
            _unStakeNFTs(owner, tokenIds);
        }
        
        emit Claimed(owner, totalEarned, totalEarnedReward, totalEarnedBonus);
    }


   /**@dev The function for calcul only rewards $nAYG of NFTs
    * @notice Calcul yours rewards from staking NFT
    * @notice Reward is calculed on base : 10000 nAYG per hour
    * @param owner is address of user
    * @param tokenIds is an array of id NFT who will be claim and unstacked
    */
    function getRewardAmount(address owner, uint[] calldata tokenIds) external view returns(uint) {
        require(tokenIds.length>0, "Min 1 NFTs can be claimed and unstaked per action");
        require(tokenIds.length<5, "Max 5 NFTs can be claimed and unstaked per action");
        uint tokenId;
        uint earned;
        uint totalEarned;

        for(uint i = 0; i < tokenIds.length ; i++) {
            tokenId = tokenIds[i];
            Staking memory thisStake = NFTsStaked[tokenId];
            require(thisStake.owner == owner, "Not the owner, you cannot claim not awards");

            uint stakingStartTime = thisStake.stakingStartTime;

            earned = ((block.timestamp - stakingStartTime) * rewardsPerHour) / 3600;

            totalEarned += earned;
        }

        return totalEarned;

    }


   /**@dev The function for calcul only bonus $nAYG of NFTs
    * @notice Calcul yours bonus from staking NFT
    * @notice Bonus is calculed reward and the type of NFT booster (+10/30/50% !)
    * @param owner is address of user
    * @param tokenIds is an array of id NFT who will be claim and unstacked
    */
    function getBonusAmount(address owner, uint[] calldata tokenIds) external view returns(uint) {
        require(tokenIds.length>0, "Min 1 NFTs can be claimed and unstaked per action");
        require(tokenIds.length<5, "Max 5 NFTs can be claimed and unstaked per action");
        uint tokenId;
        uint earned;
        uint bonusEarned;

        for(uint i = 0; i < tokenIds.length ; i++) {
            tokenId = tokenIds[i];
            Staking memory thisStake = NFTsStaked[tokenId];
            require(thisStake.owner == owner, "Not the owner, you cannot claim not awards");

            uint stakingStartTime = thisStake.stakingStartTime;

            earned = ((block.timestamp - stakingStartTime) * rewardsPerHour) / 3600;

            earned = earned * _getBoosterById(tokenId) / 100;

            bonusEarned += earned;
        }

        return bonusEarned;
    }


   /**@dev The function return array with Ids NFT staked
    * @notice Get array of Ids NFT staked by user address
    * @param owner is address of user
    */
    function tokenStakedByOwner(address owner) external view returns(uint[] memory) {
        uint totalSupply = nft.totalSupply();
        uint[] memory tmp = new uint[](totalSupply);
        uint index = 0;

        for(uint i = 0 ; i < totalSupply ; i++) {
            if(NFTsStaked[i].owner == owner) {
                tmp[index] = i;
                index++;
            }
        }

        uint[] memory tokens = new uint[](index);
        for(uint i = 0 ; i < index ; i++) {
            tokens[i] = tmp[i];
        }
        return tokens;
    }


   /**@dev The function return value of booster of one NFT
    * @notice Get value of boost reward of NFT ids (+10/30/50%)
    * @param tokenId is Id of NFT
    */
    function _getBoosterById(uint tokenId) internal view returns(uint) {
        uint rateBonus = nft.getBoosterById(tokenId);
        return rateBonus;
    }

    
}