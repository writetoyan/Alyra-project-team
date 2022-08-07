import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import Erc20_Ayg from "../../contracts/Erc20_Ayg.json";
import Erc20_Nayg from "../../contracts/Erc20_Nayg.json";
import Erc721_Nftayg from "../../contracts/Erc721_Nftayg.json";
import Staking from "../../contracts/Staking.json";
import StakingNFT from "../../contracts/StakingNFT.json";
import EthVaultMintAyg from "../../contracts/EthVaultMintAyg.json";
import LPToken from "../../contracts/LPToken.json";
import PoolSwapStake from "../../contracts/PoolSwapStake.json";


function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifactAyg, artifactNayg, artifactNftayg, artifactStaking, artifactStakingNFT, artifactVault, artifactLPToken, artifactPoolSwap) => {
      if (artifactAyg) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();

        const abiAyg = artifactAyg.abi;
        const abiNayg = artifactNayg.abi;
        const abiNftayg = artifactNftayg.abi;
        const abiStaking = artifactStaking.abi; 
        const abiStakingNFT = artifactStakingNFT.abi; 
        const abiVault = artifactVault.abi; 
        const abiLPToken = artifactLPToken.abi;
        const abiPoolSwap = artifactPoolSwap.abi;

        let addressAyg, contractAyg;
        let addressNayg, contractNayg;
        let addressNftayg, contractNftayg;
        let addressStaking, contractStaking;
        let addressStakingNFT, contractStakingNFT;
        let addressVault, contractVault;
        let addressLPToken, contractLPToken;
        let addressPoolSwap, contractPoolSwap;

        try {
          addressAyg = Erc20_Ayg.networks[networkID].address;
          contractAyg = new web3.eth.Contract(abiAyg, addressAyg);

          addressNayg = Erc20_Nayg.networks[networkID].address;
          contractNayg = new web3.eth.Contract(abiNayg, addressNayg);

          addressNftayg = Erc721_Nftayg.networks[networkID].address;
          contractNftayg = new web3.eth.Contract(abiNftayg, addressNftayg);

          addressStaking = Staking.networks[networkID].address;
          contractStaking = new web3.eth.Contract(abiStaking, addressStaking);

          addressStakingNFT = StakingNFT.networks[networkID].address;
          contractStakingNFT = new web3.eth.Contract(abiStakingNFT, addressStakingNFT);

          addressVault = EthVaultMintAyg.networks[networkID].address;
          contractVault = new web3.eth.Contract(abiVault, addressVault);

          addressLPToken = LPToken.networks[networkID].address;
          contractLPToken = new web3.eth.Contract(abiLPToken, addressLPToken);

          addressPoolSwap = PoolSwapStake.networks[networkID].address;
          contractPoolSwap = new web3.eth.Contract(abiPoolSwap, addressPoolSwap);
        } catch(err) {
          console.log(err);
        }

        dispatch({
          type: actions.init,
          data: { web3, accounts, networkID, 
                  artifactAyg, contractAyg, addressAyg, 
                  artifactNayg, contractNayg, addressNayg, 
                  artifactNftayg, contractNftayg, addressNftayg, 
                  artifactStaking, contractStaking, addressStaking, 
                  artifactStakingNFT, contractStakingNFT, addressStakingNFT, 
                  artifactVault, contractVault, addressVault, 
                  artifactLPToken, contractLPToken, addressLPToken, 
                  artifactPoolSwap, contractPoolSwap, addressPoolSwap,                
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
        const artifactStakingNFT = require("../../contracts/StakingNFT.json");
        const artifactVault = require("../../contracts/EthVaultMintAyg.json");
        const artifactLPToken = require("../../contracts/LPToken.json");
        const artifactPoolSwap = require("../../contracts/PoolSwapStake.json");
        init(artifactAyg, artifactNayg, artifactNftayg, artifactStaking, artifactStakingNFT, artifactVault, artifactLPToken, artifactPoolSwap);
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
