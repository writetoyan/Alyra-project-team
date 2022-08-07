// Import NPM
import React from 'react';
import {Routes, Route} from 'react-router-dom';

// Import SC & Web3
import { EthProvider } from "./contexts/EthContext";

// Import ASSETS
import './App.css';

// Import UI
import CssBaseline from '@mui/material/CssBaseline';

// Import COMPONENTS
import ResponsiveAppBar from "./components/ResponsiveAppBar";

import Dashboard from "./components/Dashboard";
import Token from "./components/Token";
import TokenManageAYG from "./components/TokenManageAYG";
import TokenManageNAYG from "./components/TokenManageNAYG";
import Swap from "./components/Swap";
import Stake from "./components/Stake";
import StakeManageAYG from "./components/StakeManageAYG";
import StakeManageLP from "./components/StakeManageLP";
import Pool from "./components/Pool";
import PoolAdd from "./components/PoolAdd";
import PoolManage from "./components/PoolManage";
import NFT from "./components/NFT";
import NFTmint from "./components/NFTmint";
import NFTstaking from "./components/NFTstaking";
import Footer from "./components/Footer";

import SmartsContracts from "./components/SmartsContracts";
import About from "./components/About";
import Team from "./components/Team";

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


//Connect Button
const { chains, provider } = configureChains(
  [chain.mainnet, chain.kovan, chain.localhost, chain.polygon, chain.optimism, chain.arbitrum],
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

  return (
    <EthProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <React.Fragment>
          <div className="App">
            <CssBaseline />
            <ResponsiveAppBar></ResponsiveAppBar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Token" element={<Token /> }/>
              <Route path="/TokenManage/AYG" element={<TokenManageAYG />} />
              <Route path="/Vault&Swap" element={<Swap />} />
              <Route path="/TokenManage/nAYG" element={<TokenManageNAYG />} />
              <Route path="/Swap" element={<Swap />} />
              <Route path="/Stake" element={<Stake />} />
              <Route path="/StakeManage/AYG" element={<StakeManageAYG/>} />
              <Route path="/StakeManage/LP" element={<StakeManageLP/>} />"
              <Route path="/Pool" element={<Pool />} />
              <Route path="/PoolAdd" element={<PoolAdd />} />
              <Route path="/PoolManage" element={<PoolManage />} />
              <Route path="/NFT" element={<NFT />} />
              <Route path="/NFT/Mint" element={<NFTmint />} />
              <Route path="/NFT/Staking" element={<NFTstaking />} />
              <Route path="/Team" element={<Team />} />
              <Route path="/About" element={<About />} />
              <Route path="/SmartsContracts" element={<SmartsContracts />} />
            </Routes>
            <Footer> </Footer>
            </div>
          </React.Fragment>
        </RainbowKitProvider>
      </WagmiConfig>

    </EthProvider>
  );

//  }

}

export default App;