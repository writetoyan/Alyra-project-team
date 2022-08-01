import * as React from 'react';

import { styled } from '@mui/material/styles';
import Web3 from "web3";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconApprove from '@mui/icons-material/AssignmentTurnedIn';
import TextField from '@mui/material/TextField';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import IconButton from '@mui/material/IconButton';
import StakeIcon from '@mui/icons-material/ArrowDropDownCircle';

import useEth from "../contexts/EthContext/useEth";


function DrawIcoToken({ alt, code }) {
  const href= `ico_${code}.png`;
  const CODE = code.toUpperCase();
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

function StakeManage() {

  const [alignment, setAlignment] = React.useState('stake');
  const [inputValue, setInputValue] = React.useState("");
  const [ethPrice, setEthPrice ] = React.useState(2);
  const [bnbPrice, setBnbPrice ] = React.useState(5);
  const [allo, setAllo ] = React.useState(3);
  const { state: { contractAyg, contractStaking, contractVault, accounts, addressStaking } } = useEth();


  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };  

  // staking/unstaking amount enterered by the user
  const handleInputChange = event => {
    setInputValue(event.target.value);
  }

  // Calling the stakeAyg function on the Staking smart contract
  const handleStake = async event => { 
    event.preventDefault();
    try {
      await contractAyg.methods.approve(addressStaking, inputValue).send({from: accounts[0]});
      await contractStaking.methods.stakeAyg(inputValue).send({from: accounts[0]});
    } catch(err) {
        console.log(err)
    }
  }

  // Calling the unstakingAyg function to unstake the token on the Staking contract
  const handleUnstake = async event => {
    event.preventDefault();
    try {
    await contractStaking.methods.unstakeAyg(Web3.utils.toWei(inputValue)).send({from: accounts[0]})
    } catch(err) {
      console.log(err)
    }
  }

  // Calling the approve function on the Erc20_Ayg contract
  // The amount to approve is set up to a high amount to improve user experience but less secure in case of a smart contract flaw

  const handlePriceFeed = async event => {
    event.preventDefault();
    try {
      const ethPrice = await contractVault.methods.getLatestPriceEth().call({from: accounts[0]});
      setEthPrice(Web3.utils.fromWei(ethPrice));
      const bnbPrice = await contractVault.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
      setBnbPrice(Web3.utils.fromWei(bnbPrice));
    } catch(err) {
      console.log(err)
    }
  }

  const handleVault = async event => {
    event.preventDefault();
    try {
      const amount = Web3.utils.toWei(inputValue);
      const receipt = await contractVault.methods.vaultDeposit(amount.toString()).send({from: accounts[0], value: amount});
      console.log(receipt);
      const allo = await contractAyg.methods.totalSupply().call();
      setAllo(allo);
    } catch(err) {
      console.log(err)
    }
  }

  const handleVaultWithdraw = async event => {
    event.preventDefault();
    try {
      const amount = Web3.utils.toWei(inputValue);
      const receipt = await contractVault.methods.vaultWithdraw(amount.toString()).send({from: accounts[0]});
      console.log(receipt);
      const allo = await contractAyg.methods.totalSupply().call();
      setAllo(allo);
    } catch(err) {
      console.log(err)
    }
    }
  

  return (
    <React.Fragment>
      {/* Head */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          STAKE
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Informations
        </Typography>
      </Container>
      {/* End Head */}

     
      <Container maxWidth="xl">
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              Stake&nbsp;<DrawIcoToken alt="eth" code="eth" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Earn&nbsp;<DrawIcoToken alt="dai" code="dai" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;APR&nbsp;<Chip label="0.01%" variant="outlined" />
            </Grid>

            <Grid item xs={6}>
              <Item>
                <h3>GRAPH LIQUIDITY</h3>
              </Item>
              <br />
              <Item>
                <h3>GRAPH APR</h3>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={2}>
                <Item>
                  <h3>REWARD</h3>
                  <Button
                    variant="contained"
                    startIcon={<IconApprove />}
                    onClick={(e) => {
                      alert("Contract approuved")
                    }}
                  >
                    Claim
                  </Button>
                  <br />
                  <br />
                </Item>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Item>
                <br />
                <Button
                  variant="contained"
                  startIcon={<IconApprove />}
                  o
                >
                  Approve contract
                </Button>
                <br />
                <br />
              </Item>
              <br />
              <Item>
                <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton value="stake" onClick={handleStake}>STAKE</ToggleButton>
                  <ToggleButton value="unstake" onClick={handleUnstake}>UNSTAKE</ToggleButton>
                </ToggleButtonGroup>
                <Button variant="contained" onClick={handlePriceFeed}>pricefeed</Button>

                <Button variant="contained" onClick={handleVault}>vault</Button>
                <Button variant="contained" onClick={handleVaultWithdraw}>burn vault</Button>
                
                <Typography>Eth price: {ethPrice}$</Typography>
                <Typography>Ayg price: {bnbPrice}$</Typography>
                <Typography>{allo}</Typography>
              
                <br />
                <br />
                <DrawIcoToken alt="eth" code="eth" />
                <br />
                <br />
                <TextField id="filled-basic" label="Filled" variant="filled" value={inputValue} onChange={handleInputChange}/>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>    
  );
}

export default StakeManage;
