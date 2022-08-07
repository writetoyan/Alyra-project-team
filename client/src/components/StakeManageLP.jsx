import React, { useState } from 'react';
import Web3 from 'web3';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import useEth from "../contexts/EthContext/useEth";


function StakeManageLP() {

  const { state: { contractLPToken, contractPoolSwap, addressPoolSwap, accounts } } = useEth();
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
  await contractPoolSwap.methods.unstake(Web3.utils.toWei(inputStakeId)).send({from: accounts[0]});
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