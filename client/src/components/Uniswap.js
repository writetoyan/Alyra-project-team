import React, { useState } from 'react';
import { providers, ethers } from 'ethers';
import { SwapWidget } from '@uniswap/widgets';
import detectEthereumProvider from '@metamask/detect-provider';
import '@uniswap/widgets/dist/fonts.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const infuraId = process.env.INFURA_ID;
const jsonRpcEndpoint = `https://mainnet.infura.io/v3/${infuraId}`;
const jsonRpcProvider = new providers.JsonRpcProvider(jsonRpcEndpoint);
const provider = new ethers.providers.Web3Provider(jsonRpcProvider);

const theme: Theme = {
  accent: '#1976d2',
}

export default function Uniswap() {

  const [account, setAccount] = useState({
    address: '',
    provider: provider,
  })


  async function connectWallet() {
    const ethereumProvider = await detectEthereumProvider();

    if (ethereumProvider) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      const address = accounts[0];
      setAccount({
        address: address,
        provider: ethereumProvider
      })
    }
  }

  return (
    <Container maxwidth="sx">
      <Box marginTop={8} marginBottom={5}>
        <Button variant="contained" onClick={connectWallet}>Activate Swap</Button>
      </Box>
      <Box >
        <div className="Uniswap">
          <SwapWidget 
          provider={account.provider}
          JsonRpcEndpoint={jsonRpcEndpoint}
          theme={theme}
          />
        </div>
      </Box>
    </Container>
  )
}
