import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import Erc20_Ayg from "../../contracts/Erc20_Ayg.json";
import Erc20_Nayg from "../../contracts/Erc20_Nayg.json";
import Erc721_Nftayg from "../../contracts/Erc721_Nftayg.json";
import Staking from "../../contracts/Staking.json";
import EthVaultMintAyg from "../../contracts/EthVaultMintAyg.json";
import LPToken from "../../contracts/LPToken.json";
import PoolSwapStake from "../../contracts/PoolSwapStake.json";
import StakingNFT from "../../contracts/StakingNFT.json";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifactAyg, artifactStaking, artifactVault, artifactNayg, artifactLPToken, artifactPoolSwap, artifactStakingNFT, artifactNftayg) => {
      if (artifactAyg) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const abiAyg = artifactAyg.abi;
        const abiNayg = artifactNayg.abi;
        const abiNftayg = artifactNftayg.abi;
        const abiStaking = artifactStaking.abi; 
        const abiVault = artifactVault.abi; 
        const abiLPToken = artifactLPToken.abi;
        const abiPoolSwap = artifactPoolSwap.abi;
        const abiStakingNFT = artifactStakingNFT.abi; 
        let addressAyg, addressStaking, addressVault, addressNayg, addressLPToken, addressPoolSwap, addressNftayg, addressStakingNFT,
            contractAyg, contractStaking, contractVault, contractNayg, contractLPToken, contractPoolSwap, contractNftayg, contractStakingNFT;
        try {
          addressAyg = Erc20_Ayg.networks[networkID].address;
          addressNayg = Erc20_Nayg.networks[networkID].address;
          addressNftayg = Erc721_Nftayg.networks[networkID].address;
          addressStaking = Staking.networks[networkID].address;
          addressStakingNFT = StakingNFT.networks[networkID].address;
          contractAyg = new web3.eth.Contract(abiAyg, addressAyg);
          contractNayg = new web3.eth.Contract(abiNayg, addressNayg);
          contractNftayg = new web3.eth.Contract(abiNftayg, addressNftayg);
          contractStaking = new web3.eth.Contract(abiStaking, addressStaking);
          contractStakingNFT = new web3.eth.Contract(abiStakingNFT, addressStakingNFT);
        } catch (err) {
          console.error(err);
        }
        try {
          addressVault = EthVaultMintAyg.networks[networkID].address;
          addressLPToken = LPToken.networks[networkID].address;
          addressPoolSwap = PoolSwapStake.networks[networkID].address;
          contractVault = new web3.eth.Contract(abiVault, addressVault); 
          contractLPToken = new web3.eth.Contract(abiLPToken, addressLPToken);
          contractPoolSwap = new web3.eth.Contract(abiPoolSwap, addressPoolSwap);
          } catch (err) {
            console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { web3, accounts, networkID, 
                  artifactAyg, artifactStaking, artifactVault, artifactStakingNFT, artifactNayg, artifactNftayg,
                  contractAyg, contractStaking, contractVault, contractNayg, contractLPToken, contractPoolSwap, contractNftayg, contractStakingNFT,
                  addressStaking, addressPoolSwap, addressStakingNFT
                }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifactAyg = require("../../contracts/Erc20_Ayg.json");
        const artifactNayg = require("../../contracts/Erc20_Nayg.json");
        const artifactNftayg = require("../../contracts/Erc721_Nftayg.json");
        const artifactStaking = require("../../contracts/Staking.json");
        const artifactVault = require("../../contracts/EthVaultMintAyg.json");
        const artifactLPToken = require("../../contracts/LPToken.json");
        const artifactPoolSwap = require("../../contracts/PoolSwapStake.json");
        const artifactStakingNFT = require("../../contracts/StakingNFT.json");
        init(artifactAyg, artifactStaking, artifactVault, artifactNayg, artifactLPToken, artifactPoolSwap,artifactNftayg, artifactStakingNFT);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
