import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import Erc20_Ayg from "../../contracts/Erc20_Ayg.json";
import Staking from "../../contracts/Staking.json";


function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async (artifactAyg, artifactStaking) => {
      if (artifactAyg, artifactAyg) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const abiAyg = artifactAyg.abi;
        const abiStaking = artifactStaking.abi;
        let addressAyg, addressStaking, contractAyg, contractStaking;
        try {
          addressAyg = Erc20_Ayg.networks[networkID].address;
          addressStaking = Staking.networks[networkID].address;
          contractAyg = new web3.eth.Contract(abiAyg, addressAyg);
          contractStaking = new web3.eth.Contract(abiStaking, addressStaking);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifactAyg, artifactStaking, web3, accounts, networkID, contractAyg, contractStaking, addressStaking }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const artifactAyg = require("../../contracts/Erc20_Ayg.json");
        const artifactStaking = require("../../contracts/Staking.json");
        init(artifactAyg, artifactStaking);
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
