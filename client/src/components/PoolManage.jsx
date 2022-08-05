import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import useEth from "../contexts/EthContext/useEth";



function DrawIcoToken({ alt, code }) {
  const href= `ico_${code}.png`;
  const CODE = code.toUpperCase()+" (50%)";
  return <Chip
    avatar={<Avatar alt={alt} src={href} />}
    label={CODE}
    variant="outlined"
  />
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Pool() {

  const { state: { contractAyg, contractNayg, contractLPToken, contractPoolSwap, addressPoolSwap, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  const [aygPrice, setAygPrice] = useState();
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

  const handleInputValue = event => {
    setInputValue(event.target.value);
  }

  const handleDepositPool = async () => {
    const aygPrice = await contractPoolSwap.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
    const naygPrice = await contractPoolSwap.methods.getLatestPriceLinkProxy().call({from: accounts[0]});
    const konstant = web2((aygPrice / naygPrice));
    const naygAmount = web2((inputValue * konstant));
    await contractAyg.methods.approve(addressPoolSwap, Web3.utils.toWei(inputValue)).send({from: accounts[0]});
    await contractNayg.methods.approve(addressPoolSwap, Web3.utils.toWei(naygAmount)).send({from: accounts[0]});
    await contractPoolSwap.methods.depositPool(Web3.utils.toWei(inputValue), Web3.utils.toWei(naygAmount)).send({from: accounts[0]});
  }

  const handleWithdrawPool = async () => {
    await contractLPToken.methods.approve(addressPoolSwap, Web3.utils.toWei(inputValue)).send({from: accounts[0]});
    await contractPoolSwap.methods.withdrawPool(Web3.utils.toWei(inputValue)).send({from: accounts[0]});
  }

  const handlePriceFeed = async event => {
    event.preventDefault();
    try {
      const naygPrice = await contractPoolSwap.methods.getLatestPriceLinkProxy().call({from: accounts[0]});
      setNaygPrice(web2(Web3.utils.fromWei(naygPrice)));
      const aygPrice = await contractPoolSwap.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
      setAygPrice(web2(Web3.utils.fromWei(aygPrice)));
      const konstant = web2((aygPrice / naygPrice));
      setKonstant(konstant);
    } catch(err) {
      console.log(err)
    }
  }

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
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
             LIQUIDITY POOL
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
            Provide liquidity to our protocol and earn trading fees     
        </Typography>
      </Container>
      <Grid item xs={12} container spacing={4} justifyContent="center">
  
        <Grid item xs={6}>
          <Card>
              <br />
              <Typography variant="h4">AYG/NAYG Pool</Typography>
              <br />
              <TextField label="Enter the amount to pool" variant="filled" value={inputValue} onChange={handleInputValue}/>
              <br />
              <br />
              <Button size="large" variant="contained" onClick={handleDepositPool}>Deposit pool</Button>
              <span> </span>
              <Button size="large" variant="contained" onClick={handleWithdrawPool}>Withdraw </Button>
              <br />
              <br />
              <Typography>Price of AYG: <strong>${aygPrice}</strong> / Price of NAYG: <strong>${naygPrice}</strong></Typography>
              <Typography></Typography>
              <br />
              <Typography>Pool <strong>1 AYG</strong> with <strong>{konstant} NAYG</strong></Typography>
              <br />            
              <Button size="large" variant="contained" onClick={handlePriceFeed}>Get latest pool ratio</Button>
              <br />
              <br />
          </Card>          
        </Grid>
      </Grid>      
      
    </React.Fragment>

);}

export default Pool;