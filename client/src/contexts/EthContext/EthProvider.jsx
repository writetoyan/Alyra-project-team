import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import Erc20_Ayg from "../../contracts/Erc20_Ayg.json";
import Erc20_Nayg from "../../contracts/Erc20_Nayg.json";
import Erc721_Nftayg from "../../contracts/Erc721_Nftayg.json";
import Staking from "../../contracts/Staking.json";
import StakingNFT from "../../contracts/StakingNFT.json";
import EthUsdPriceFeed from "../../contracts/EthUsdPriceFeed.json";


function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifactAyg, artifactNayg, artifactNftayg, artifactStaking, artifactStakingNFT, artifactEthUsd) => {
      if (artifactAyg) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const abiAyg = artifactAyg.abi;
        const abiNayg = artifactNayg.abi;
        const abiNftayg = artifactNftayg.abi;
        const abiStaking = artifactStaking.abi; 
        const abiStakingNFT = artifactStakingNFT.abi; 
        const abiEthUsd = artifactEthUsd.abi; 
        let addressAyg, addressNayg, addressNftayg, addressStaking, addressStakingNFT, addressEthUsd, contractAyg, contractNayg, contractNftayg, contractStaking, contractStakingNFT, contractEthUsd;
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
          addressEthUsd = EthUsdPriceFeed.networks[networkID].address;
          contractEthUsd = new web3.eth.Contract(abiEthUsd, addressEthUsd);
          } catch (err) {
            console.error(err);
          }
        dispatch({
          type: actions.init,
          data: { web3, accounts, networkID, 
            artifactAyg, artifactNayg, artifactNftayg, artifactStaking, artifactStakingNFT, artifactEthUsd,
            contractAyg, contractNayg, contractNftayg, contractStaking, contractStakingNFT, contractEthUsd,
            addressStaking, addressStakingNFT
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
        const artifactEthUsd = require("../../contracts/EthUsdPriceFeed.json");
        init(artifactAyg, artifactNayg, artifactNftayg, artifactStaking, artifactStakingNFT, artifactEthUsd);
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