import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import {useNavigate} from 'react-router-dom';
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


function StakeManageLP() {

  const navigate = useNavigate();

  const { state: { contractAyg, contractNayg, contractLPToken, contractPoolSwap, addressPoolSwap, accounts } } = useEth();
  const [inputStake, setInputStake] = useState("");
  const [inputStakeId, setInputStakeId] = useState("");

  const handleInputStake = event => {
    setInputStake(event.target.value);
  }

  const handleInputStakeId = event => {
    setInputStakeId(event.target.value);
  }

//============================================ STAKE ==================================================

const handleStakeLP = async () => {
  await contractLPToken.methods.approve(addressPoolSwap, Web3.utils.toWei(inputStake)).send({from: accounts[0]});
  await contractPoolSwap.methods.stake(Web3.utils.toWei(inputStake)).send({from: accounts[0]});
}

const handleUnstakeLP = async () => {
  await contractPoolSwap.methods.unstake(inputStakeId).send({from: accounts[0]});
}


//================================================ UI ======================================================

  return (
    
    <React.Fragment>
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            STAKE LP
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">   
            Stake your LP token to earn staking rewards
        </Typography>
      </Container>
      <Grid item xs={12} container spacing={4} justifyContent="center">

        <Grid item xs={4}>
          <Card>
              <br />
              <Typography variant="h4">Stake your LP</Typography>
              <Typography color="text.secondary">And earn 155 000% APR</Typography>
              <br />
              <TextField label="Amount" variant="filled" value={inputStake} onChange={handleInputStake}/>
              <br /><br />
              <Button size="large" variant="contained" onClick={handleStakeLP}>Stake LP Token</Button>
              <br /><br />
              <TextField label="Enter your stake ID" variant="filled" value={inputStakeId} onChange={handleInputStakeId}/>
              <br /><br />
              <Button size="large" variant="contained" onClick={handleUnstakeLP}>Unstake LP Token</Button>
              <br /><br />
          </Card>
          
        </Grid>
      </Grid>      
      
    </React.Fragment>

);}

export default StakeManageLP;