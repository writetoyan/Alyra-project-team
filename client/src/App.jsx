import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';

// Import COMPONENTS
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Body from "./components/Body";
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

import Uniswap from './components/Uniswap';

function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

const App = () => {

//  const [BodyPage, setBodyPage] = React.useState(null);
//  setBodyPage('Footer');

//Connect Button
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.ropsten],
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

  return (

    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>  
        <React.Fragment>
          <CssBaseline />
          <ResponsiveAppBar></ResponsiveAppBar>
          <Body></Body>
          <Footer> </Footer>
          <Link uri={"https://soliditylang.org"} text={"Link"} />
        <Uniswap />
        </React.Fragment>
      </RainbowKitProvider>
    </WagmiConfig>

  );
};
export default App;
