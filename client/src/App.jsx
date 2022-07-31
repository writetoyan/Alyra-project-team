// Import NPM
import React, { useEffect, useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

// Import SC & Web3
import { EthProvider } from "./contexts/EthContext";
//import useEth from "./contexts/EthContext/useEth";
//import getWeb3 from './getWeb3';

import { EthProvider } from "./contexts/EthContext";

// Import ASSETS
import './App.css';

// Import UI
import CssBaseline from '@mui/material/CssBaseline';

// Import COMPONENTS
import CnxWeb3 from "./components/CnxWeb3";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Token from "./components/Token";
import TokenManageAYG from "./components/TokenManageAYG";
import Trade from "./components/Trade";
import Stake from "./components/Stake";
import StakeManage from "./components/StakeManage";
import Pool from "./components/Pool";
import PoolAdd from "./components/PoolAdd";
import PoolManage from "./components/PoolManage";
import NFT from "./components/NFT";
import Footer from "./components/Footer";

//Connect Button import
import '@rainbow-me/rainbowkit/dist/index.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}


//Connect Button
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.kovan],
  [
    alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function App() {
  const [state, setState] = useState({ isOwner: false, web3: null, accounts: null, contract_dapp: null, contract_erc20ayg: null });


  /*
  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Dapp_Contract.networks[networkId];
  
        const dapp_instance = new web3.eth.Contract(Dapp_Contract.abi, deployedNetwork && deployedNetwork.address);
        console.log(dapp_instance.methods);

        const TOKEN_ADDRESS = "0x4fa8a098151D6d739Dab43D414164225D5e8Fd58" //AYG
        const erc20ayg_instance = new web3.eth.Contract(Erc20AYG_Contract.abi, TOKEN_ADDRESS)
        console.log(erc20ayg_instance.methods);

        setState({ web3: web3, accounts: accounts, contract_dapp: dapp_instance, contract_erc20ayg: erc20ayg_instance });
  
      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })();
  }, []);
*/

/*
  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        const TOKEN_ADDRESS = "0x4fa8a098151D6d739Dab43D414164225D5e8Fd58" //AYG
        const erc20token = new web3.eth.Contract(Erc20AYG_Contract.abi, TOKEN_ADDRESS)
        console.log("ok?");
        console.log(erc20token.methods);

        erc20token.methods.name().call(function (err, res) {
          if (err) {
            console.log("Une erreur s'est produite", err)
            return
          }
          console.log("Le token est : ", res)
        })

        erc20token.methods.totalSupply().call(function (err, res) {
          if (err) {
            console.log("Une erreur s'est produite", err)
            return
          }
          console.log("La totalSupply est de : ", res)
        })

        const faucetValue = web3.utils.toWei('5', 'ether')
        await erc20token.methods.faucet(accounts[0], faucetValue).send(({ from: accounts[0] }))
        .then(function (receipt) {
          let newSupply = receipt.events.MintSupply.returnValues.amount;
//          component.setState({ toastResult: "Proposition n°" + newProposal + " viens d'être ajoutée !" });
          console.log("claim : "+newSupply)
//          setTimeout(() => window.location.reload(), 3000);
        });


      } catch (error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.`);
        console.error(error);
      }
    })();
  }, []);
*/

/*
  if (!state.web3) {

    return (
      <div>
        <CnxWeb3></CnxWeb3>
      </div>
    );

  } else {
*/
    return (
      <EthProvider>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <React.Fragment>
              <CssBaseline />
              <ResponsiveAppBar></ResponsiveAppBar>
              <Footer> </Footer>
              <Link uri={"https://soliditylang.org"} text={"Link"} />
            </React.Fragment>
          </RainbowKitProvider>
        </WagmiConfig>

        <div className="App">

          <CssBaseline />

          <ResponsiveAppBar
//            contract={state.contract_dapp}
//            account={state.accounts[0]}
//            addrUser={state.accounts[0]}
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route 
              path="/Token"
              element={
                <Token 
///                  web3={state.web3}
//                  contract={state.contract_erc20ayg}
//                  account={state.accounts[0]}
                />
              }/>
            <Route path="/TokenManage/AYG" element={<TokenManageAYG />} />
            <Route path="/Trade" element={<Trade />} />
            <Route path="/Stake" element={<Stake />} />
            <Route path="/StakeManage" element={<StakeManage />} />
            <Route path="/Pool" element={<Pool />} />
            <Route path="/PoolAdd" element={<PoolAdd />} />
            <Route path="/PoolManage" element={<PoolManage />} />
            <Route path="/NFT" element={<NFT />} />
          </Routes>

          <Footer> </Footer>
        </div>

      </EthProvider>
    );

//  }

}

export default App;