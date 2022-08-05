// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import './ERC20_Nayg.sol';
import './ERC721_Nftayg.sol';

contract StakingNFT {
    uint totalStaked;

    struct Staking {
        uint tokenId;
        uint stakingStartTime;
        address owner;
    }

    mapping(uint => Staking) NFTsStaked;

    uint rewardsPerHour = 10000000000000000000;  // 10 nAYG per hour

    //pointer
    Erc20_Nayg token;
    Erc721_Nftayg nft;

    event Staked(address indexed owner, uint tokenId, uint value);
    event Unstaked(address indexed onwer, uint tokenId, uint value);
    event Claimed(address indexed owner, uint totalEarned, uint totalReward, uint totalBonus);


    constructor(Erc20_Nayg _token, Erc721_Nftayg _nft) {
        token = _token;
        nft = _nft;
    }

    // Staking des NFT depuis leurs IDs
    // array [0] / [1, 15, 37]
    function Stake(uint[] calldata tokenIds) external {
        // mettre require pr limité taille de tokenIds
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

    function _unStakeNFTs(address owner, uint[] calldata tokenIds) internal {
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

    function claim(uint[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, false);
    }

    function unstake(uint[] calldata tokenIds) external {
        _claim(msg.sender, tokenIds, true);
    }

    function _claim(address owner, uint[] calldata tokenIds, bool _unstake) internal {
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

    function getRewardAmount(address owner, uint[] calldata tokenIds) external view returns(uint) {
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

    function getBonusAmount(address owner, uint[] calldata tokenIds) external view returns(uint) {
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

    function _getBoosterById(uint tokenId) internal view returns(uint) {
        uint rateBonus = nft.getBoosterById(tokenId);
        return rateBonus;
    }

    
}