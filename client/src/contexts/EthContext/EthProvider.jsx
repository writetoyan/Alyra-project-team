import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

import Dapp from '../../contracts/Dapp_Greg.json';
import Erc20_AYG from '../../contracts/Erc20_AYG.json';

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
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
        dispatch({
          type: actions.init,
          data: { artifact_Erc20_AYG, artifact_Dapp, web3, accounts, networkID, contract_Erc20_AYG, contract_Dapp, address_Dapp }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
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