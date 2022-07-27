import React, { useState } from 'react';
import { providers, ethers } from 'ethers';
import { SwapWidget } from '@uniswap/widgets';
import detectEthereumProvider from '@metamask/detect-provider';
import '@uniswap/widgets/dist/fonts.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// const infuraId = process.env.INFURA_ID;
const jsonRpcEndpoint = 'https://mainnet.infura.io/v3/a8fef4bc80f142ba94cc78f051397b3a';
const jsonRpcProvider = new providers.JsonRpcProvider(jsonRpcEndpoint);
const provider = new ethers.providers.Web3Provider(jsonRpcProvider);


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
  
 
    <div className="App">
      
      <div>
        <button onClick={connectWallet}> <ConnectButton /></button>
      </div>
      <div className="Uniswap">
        <SwapWidget 
        provider={account.provider}
        JsonRpcEndpoint={jsonRpcEndpoint} />
      </div>
    </div>
)
}
