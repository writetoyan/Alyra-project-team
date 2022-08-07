import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import useEth from "../contexts/EthContext/useEth";
import Uniswap from "./Uniswap";


function Swap() {

  const { state: { contractAyg, contractNayg, contractVault, contractPoolSwap, addressPoolSwap, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [inputVault, setInputVault ] = useState();
  const [inputAygSwap, setInputAygSwap] = useState("");
  const [inputNaygSwap, setInputNaygSwap] = useState("");
  const [estAygSwap, setEstAygSwap] = useState();
  const [estNaygSwap, setEstNaygSwap] = useState();
  const [tradingFees, setTradingFees] = useState();
  const [tradingFeesN, setTradingFeesN] = useState();
  const [ethPrice, setEthPrice ] = useState();
  const [aygPrice, setAygPrice ] = useState();
  const [naygPrice, setNaygPrice] = useState();
  const [konstant, setKonstant] = useState();
  

  useEffect(() => {
    if(contractAyg){
    async function fetchData(){
      try {
        update(); 
      } catch(err) {
          console.error(err)
      }
    }
    fetchData();
    }
  }, []);

  function web2(x) {
    return Number.parseFloat(x).toFixed(2);
  }

  const handleInputAyg = event => {
    setInputAygSwap(event.target.value);
  }

  const handleInputNayg = event => {
    setInputNaygSwap(event.target.value);
  }


  const handlePriceFeed = async event => {
    event.preventDefault();
    try {
      const ethPrice = await contractVault.methods.getLatestPriceEth().call({from: accounts[0]});
      setEthPrice(web2(Web3.utils.fromWei(ethPrice)));
      const naygPrice = await contractPoolSwap.methods.getLatestPriceLinkProxy().call({from: accounts[0]});
      setNaygPrice(web2(Web3.utils.fromWei(naygPrice)));
      const aygPrice = await contractPoolSwap.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
      setAygPrice(web2(Web3.utils.fromWei(aygPrice)));
      const konstant = web2((aygPrice / naygPrice));
      setKonstant(konstant);
      const estAygSwap = inputAygSwap * konstant;
      setEstAygSwap(web2(estAygSwap));
      setTradingFees(web2(estAygSwap * 0.03))
      const estNaygSwap = inputNaygSwap / konstant;
      setEstNaygSwap(web2(estNaygSwap));
      setTradingFeesN(web2(estNaygSwap * 0.03))
    } catch(err) {
      console.log(err)
    }
  }

//============================================== SWAP =================================================
  

  const handleSwapAYG = async () => {
    await contractAyg.methods.approve(addressPoolSwap, Web3.utils.toWei(inputAygSwap)).send({from: accounts[0]});
    await contractPoolSwap.methods.swapPoolAyg(Web3.utils.toWei(inputAygSwap)).send({from: accounts[0]});
  }

  const handleSwapNAYG = async () => {
    await contractNayg.methods.approve(addressPoolSwap, Web3.utils.toWei(inputNaygSwap)).send({from: accounts[0]});
    await contractPoolSwap.methods.swapPoolNayg(Web3.utils.toWei(inputNaygSwap)).send({from: accounts[0]});
  }

//============================================= VAULT ================================================


const handleInputVault = event => {
  setInputVault(event.target.value);
}

const handleVaultMint = async event => {
  event.preventDefault();
  try {
    const amount = Web3.utils.toWei(inputVault);
    await contractVault.methods.vaultDeposit(amount.toString()).send({from: accounts[0], value: amount});
  } catch(err) {
    console.log(err)
  }
}

const handleVaultBurn = async event => {
  event.preventDefault();
  try {
    const amount = Web3.utils.toWei(inputVault);
    const receipt = await contractVault.methods.vaultWithdraw(amount.toString()).send({from: accounts[0]});
    console.log(receipt);
  } catch(err) {
    console.log(err)
  }
  }

// const handlePriceFeed = async event => {
//   event.preventDefault();
//   try {
//     const ethPrice = await contractVault.methods.getLatestPriceEth().call({from: accounts[0]});
//     setEthPrice(web2(Web3.utils.fromWei(ethPrice)));
//     const aygPrice = await contractVault.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
//     setAygPrice(web2(Web3.utils.fromWei(aygPrice)));
//   } catch(err) {
//     console.log(err)
//   }
// }

//============================================= UPDATE =================================================

  const update = async () => {
    try {

    const aygPrice = await contractPoolSwap.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
    const naygPrice = await contractPoolSwap.methods.getLatestPriceLinkProxy().call({from: accounts[0]});
    setAygPrice(web2((Web3.utils.fromWei(aygPrice))));
    setNaygPrice(web2(Web3.utils.fromWei(naygPrice)));
    const konstant = web2((aygPrice / naygPrice));
    setKonstant(konstant);
    } catch(err) {
        console.log(err);
    };
  }

//================================================ UI ======================================================

  return (
    
    <React.Fragment>
      <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            VAULT & SWAP
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">Provide ETH as collateral to mint AYG </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">Swap on our protocol between AYG and NAYG</Typography>
        <br />
        <Grid item xs={12} container spacing={8} justifyContent="center">
          <Grid item xs={4}>
            <Card item xs={3} marginTop={5}>
              <br />
              <Typography variant="h4">ETH VAULT</Typography>
              <Typography variant="h6" align="center" color="text.secondary" component="p">Mint AYG by providing ETH as collateral</Typography>
              <br />
              <TextField label="Amount" variant="filled" value={inputVault} onChange={handleInputVault}/>
              <br />
              <br />
              <Button size="large" variant="contained" onClick={handleVaultMint}>Mint AYG</Button>
              <span> </span>
              <Button size="large" variant="contained" onClick={handleVaultBurn}>Burn AYG</Button>
              <br />
              <br />
              <Typography>Price of ETH: {ethPrice} $</Typography>
              <Typography>Price of AYG: {aygPrice} $</Typography>
              <br />
              <Typography>Collateral needed to mint AYG: <strong>200%</strong></Typography>
              <br />
              <Typography>For 1 ETH, you will get: {web2(ethPrice / aygPrice /2)} AYG</Typography>
              <Typography>For 1 AYG, you will get back: {web2(aygPrice / ethPrice *2)} ETH</Typography>
              <br />
              <Button size="large" variant="contained" onClick={handlePriceFeed}>Get latest mint / burn rate</Button>
              <br />
              <br />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card >
              <br />
                <Typography variant="h4">Swap AYG and NAYG</Typography>
                <br />
                <TextField label="Enter AYG amount" variant="filled" value={inputAygSwap} onChange={handleInputAyg}/>
                <br />
                <br />
                <Typography >You will get {web2(estAygSwap - tradingFees)} NAYG</Typography>
                <Typography >Trading fees {tradingFees} NAYG</Typography>
                <br />
                <Button size="large" variant="contained"onClick={handlePriceFeed}> Estimation </Button>
                <span> </span>
                <Button size="large" variant="contained"onClick={handleSwapAYG}> SWAP AYG </Button>
                <br />
                <br />
                <TextField label="Enter NAYG amount" variant="filled" value={inputNaygSwap} onChange={handleInputNayg}/>
                <br />
                <br />
                <Typography >You will get {web2(estNaygSwap - tradingFeesN)} AYG</Typography>
                <Typography >Trading fees {tradingFeesN} AYG</Typography>
                <br />
                <Button size="large" variant="contained"onClick={handlePriceFeed}> Estimation </Button>
                <span> </span>
                <Button size="large" variant="contained" onClick={handleSwapNAYG}> SWAP NAYG </Button>
                <br />
                <br />         
            </Card >
          </Grid>
          <Grid item xs={4}>
            <Card item xs={3} marginTop={5}>
              <br />
              <Typography variant="h4">Swap ETH for AYG</Typography>
              <Uniswap />
              <br />
            </Card>
            <br />
          </Grid>
        </Grid>      
      </Container>

    </React.Fragment>

);}

export default Swap;