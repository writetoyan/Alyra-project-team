import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import Erc20_Ayg from "../../contracts/Erc20_Ayg.json";
import Staking from "../../contracts/Staking.json";
import EthUsdPriceFeed from "../../contracts/EthUsdPriceFeed.json";


import Dapp from '../../contracts/Dapp_Greg.json';
import Erc20_AYG from '../../contracts/Erc20_AYG.json';

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    // async (artifactAyg, artifactStaking, artifactEthUsd) => {
    //   if (artifactAyg) {
    //     const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    //     const accounts = await web3.eth.requestAccounts();
    //     const networkID = await web3.eth.net.getId();
    //     const abiAyg = artifactAyg.abi;
    //     const abiStaking = artifactStaking.abi; 
    //     const abiEthUsd = artifactEthUsd.abi; 
    //     let addressAyg, addressStaking, addressEthUsd, contractAyg, contractStaking, contractEthUsd;
    //     try {
    //       addressAyg = Erc20_Ayg.networks[networkID].address;
    //       addressStaking = Staking.networks[networkID].address;
    //       contractAyg = new web3.eth.Contract(abiAyg, addressAyg);
    //       contractStaking = new web3.eth.Contract(abiStaking, addressStaking);
    async (artifact_Erc20_AYG, artifact_Dapp) => {
      if (artifact_Erc20_AYG, artifact_Dapp) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const abi_Erc20_AYG = artifact_Erc20_AYG.abi;
        const abi_Dapp = artifact_Dapp.abi;
        let address_Erc20_AYG, address_Dapp, contract_Erc20_AYG, contract_Dapp;
        try {
          address_Dapp = Dapp.networks[networkID].address;
          address_Erc20_AYG = Erc20_AYG.networks[networkID].address;
          contract_Dapp = new web3.eth.Contract(abi_Dapp, address_Dapp);
          contract_Erc20_AYG = new web3.eth.Contract(abi_Erc20_AYG, address_Erc20_AYG);
        } catch (err) {
          console.error(err);
        }
        try {
          addressEthUsd = EthUsdPriceFeed.networks[networkID].address;
          contractEthUsd = new web3.eth.Contract(abiEthUsd, addressEthUsd);
          } catch (err) {
            console.error(err);
          }
        dispatch({
          type: actions.init,
          // data: { web3, accounts, networkID, 
          //         artifactAyg, artifactStaking, artifactEthUsd,
          //         contractAyg, contractStaking, contractEthUsd,
          //         addressStaking
          //       }
          data: { artifact_Erc20_AYG, artifact_Dapp, web3, accounts, networkID, contract_Erc20_AYG, contract_Dapp, address_Dapp }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        // const artifactAyg = require("../../contracts/Erc20_Ayg.json");
        // const artifactStaking = require("../../contracts/Staking.json");
        // const artifactEthUsd = require("../../contracts/EthUsdPriceFeed.json");
        // init(artifactAyg, artifactStaking, artifactEthUsd);
        const artifact_Erc20_AYG = require("../../contracts/Erc20_AYG.json");
        const artifact_Dapp = require("../../contracts/Dapp_Greg.json");
        init(artifact_Erc20_AYG, artifact_Dapp);
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