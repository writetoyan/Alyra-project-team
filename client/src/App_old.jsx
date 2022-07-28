// Import NPM
import React, { useEffect, useState } from 'react';
import Erc20AygContract from './contracts/Erc20_Ayg.json';
import getWeb3 from './getWeb3';

// Import ASSETS
import './App.css';

// Import UI
import CssBaseline from '@mui/material/CssBaseline';

// Import COMPONENTS
import CnxWeb3 from "./components/CnxWeb3";

import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Body from "./components/Body";
import Footer from "./components/Footer";


function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

function App() {

//  const [BodyPage, setBodyPage] = React.useState(null);
//  setBodyPage('Footer');
  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Erc20AygContract.networks[networkId];

        const instance = new web3.eth.Contract(Erc20AygContract.abi, deployedNetwork && deployedNetwork.address);
        console.log(instance.methods);

        let workflowStatus = await instance.methods.workflowStatus().call();
        let owner = await instance.methods.owner().call();
        setContractState({ owner: owner, workflowStatus: workflowStatus });

        setState({ web3: web3, accounts: accounts, contract: instance });

        const addrOwner = setAddrOwner(owner);
        const addrUser = setAddrUser(accounts[0]);

        if(owner==accounts[0]){
          setDisplayAdmintool(1);
        }

        
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })();
  }, []);

  if (!state.web3) {
    return (
      <div>
        <CnxWeb3></CnxWeb3>
      </div>
    );
  } else {

    return (
      <React.Fragment>
        <CssBaseline />

        <ResponsiveAppBar></ResponsiveAppBar>

        <Body></Body>

        <Footer> </Footer>
        <Link uri={"https://soliditylang.org"} text={"Link"} />
      </React.Fragment>
    );
  }


};
export default App;