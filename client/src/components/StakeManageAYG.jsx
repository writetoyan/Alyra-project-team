// Import NPM
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

import { styled } from '@mui/material/styles';
import Web3 from "web3";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconApprove from '@mui/icons-material/AssignmentTurnedIn';
import LaunchIcon from '@mui/icons-material/Launch';
import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import useEth from "../contexts/EthContext/useEth";

// Import Recharts UI
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



function DrawIcoToken({ alt, code }) {
  const href= `../ico_${code}.png`;
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


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}





function StakeManage() {
  const navigate = useNavigate();

  const { state: { contractAyg, contractStaking, contractVault, accounts, addressStaking } } = useEth();

  const [alignment, setAlignment] = React.useState('stake');
  const [inputValue, setInputValue] = React.useState("");
  const [inputValue2, setInputValue2] = useState(0);
  const [totalSupplyAYG, setTotalSupplyAYG] = useState(0);
  const [yourSupplyAYG, setYourSupplyAYG] = useState(0);
  const [yourEarnedAYG, setYourEarnedAYG] = useState(0);
  const [poolUsdValue, setPoolUsdValue] = useState(0);
  const [moveStakingAYG, setDataStakingAYG] = useState([]);
//  const [nbStakAYG, setNbStakAYG] = useState(0);
  const [moveUnstakingAYG, setDataUnstakingAYG] = useState([]);
//  const [nbUnstakAYG, setNbUnstakAYG] = useState(0);
  const [graphStakingAYG, setDataGraphAYG] = useState([]);
  const [aygPrice, setAygPrice] = useState();
  const [ethPrice, setEthPrice] = useState();

  const [yourAprAYG, setYourAprAyg] = useState(0);
  
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    if(contractAyg){
    async function fetchData(){
        try {
          updateAYG(); 
        } catch(err) {
            console.error(err)
        }
    }
    fetchData();
    }
  }, []);


//  const [counter, setCounter] = useState(0)
  useEffect(() => {
    let interval
    const updateCounter = () => {
      //setCounter(currentValue => currentValue + 1)
      updateAYG();
    }
    interval = setInterval(() => {
      updateCounter()
    }, 10000)
    return () => {
      // Clear the interval when component is unmounted
      clearInterval(interval)
    }
  }, [])

  function web2(x) {
    return Number.parseFloat(x).toFixed(2);
  }


// =================================== STAKING SC CALL =======================================


  // staking/unstaking amount enterered by the user
  const handleInputChange = event => {
    setInputValue(event.target.value);
  }

  const handleInputChange2 = event => {
    setInputValue2(event.target.value);
  }

  // Calling the stakeAyg function on the Staking smart contract
    const handleStake = async () => {
      await contractAyg.methods.approve(addressStaking, Web3.utils.toWei(inputValue)).send({from: accounts[0]});
      await contractStaking.methods.stake(Web3.utils.toWei(inputValue)).send({from: accounts[0]})
        try{
          updateAYG();   
        } catch(err) {
          console.log(err);
        };
    }

  // Calling the unstakingAyg function to unstake the token on the Staking contract
  const handleUnstake = async () => {
    await contractStaking.methods.withdraw(Web3.utils.toWei(inputValue)).send({from: accounts[0]});
    try {
    await updateAYG();    
    } catch(err) {
        console.log(err);
    };
  }

  const getRewardAYG = async () => {
    try {
    await contractStaking.methods.getReward().send({ from: accounts[0] });
    } catch(err) {
        console.log(err);
    };
  }

  const exit = async () => {
    try {
    await contractStaking.methods.exit().send({ from: accounts[0] })
    } catch(err) {
        console.log(err);
    };
  }

//============================= UPDATE STATE ====================================

  const updateAYG = async () => {
    try {
      const totalSupplyAYG = await contractStaking.methods.totalSupply().call({ from: accounts[0] });
      setTotalSupplyAYG(Web3.utils.fromWei(totalSupplyAYG));

      const yourSupplyAYG = await contractStaking.methods.balanceOf(accounts[0]).call({from: accounts[0]});
      setYourSupplyAYG(Web3.utils.fromWei(yourSupplyAYG));

      const yourEarnedAYG = await contractStaking.methods.earned(accounts[0]).call({from: accounts[0]});
      setYourEarnedAYG(Web3.utils.fromWei(yourEarnedAYG));

      const aygPrice = await contractVault.methods.getLatestPriceBnbProxy().call({from: accounts[0]});
      setAygPrice(web2((Web3.utils.fromWei(aygPrice))));

      const ethPrice = await contractVault.methods.getLatestPriceEth().call({from: accounts[0]});
      setEthPrice(web2(Web3.utils.fromWei(ethPrice)));

      const poolUsdValue = web2(aygPrice * totalSupplyAYG / 10**36);
      setPoolUsdValue(poolUsdValue);

      const yourAprAgy = await contractVault.methods.getMyStakingApr().call({from: accounts[0]});
      setYourAprAyg(Web3.utils.fromWei(yourAprAgy));

    } catch(err) {
        console.log(err);
    };
    try {
    contractStaking.getPastEvents('Staked', { fromBlock: 0, toBlock: 'latest' })
    .then((results) => {
      let supplyTotal = 0;
      let moveStakingAYG = [];
//        let graphTokenAYG = [];
      results.forEach(async (result) => {

        moveStakingAYG.push({ blockNumber: result.blockNumber, amount: result.returnValues.amount, addr: result.returnValues.user });

        supplyTotal = result.returnValues.amount + supplyTotal;
        graphStakingAYG.push({ name: result.blockNumber, supply: supplyTotal, faucet: result.returnValues.amount, reward: 0  });
        setDataGraphAYG(graphStakingAYG);

      })
      setDataStakingAYG(moveStakingAYG);
//        setNbStakAYG(results.length);

      console.log(moveStakingAYG)
      console.log(graphStakingAYG)
    })
    .catch((err) => {
      console.log(err);
    });
    } catch(err) {
      console.log(err)
    }
  
  try {
      contractStaking.getPastEvents('Withdrawn', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        let moveUnstakingAYG = [];
        results.forEach(async (result) => {

          moveUnstakingAYG.push({ blockNumber: result.blockNumber, amount: -result.returnValues.amount, addr: result.returnValues.user });
/*
          supplyTotal = result.returnValues.amount/1000000000000000000 + supplyTotal;
          switch (result.returnValues.methode) {
            case 'getFaucet':
              graphTokenAYG.push({ name: result.blockNumber, supply: supplyTotal, faucet: result.returnValues.amount/1000000000000000000, reward: 0  });
              break;
            case 'getReward':
              graphTokenAYG.push({ name: result.blockNumber, supply: supplyTotal, faucet: 0, reward: result.returnValues.amount/1000000000000000000  });
              break;
            default:
              console.log(`Sorry !`);
          }
          setDataGraphAYG(graphTokenAYG);
*/
        })
        setDataUnstakingAYG(moveUnstakingAYG);
//        setNbUnstakAYG(results.length);

        console.log(moveUnstakingAYG)
      })
      .catch((err) => {
        console.log(err);
      });
  
  } catch(err) {
    console.log(err);
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
          STAKE AYG
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Informations
        </Typography>
      </Container>
      {/* End Head */}

{/*================================================= STAKING DATA ============================================================ */}    

      <Container maxWidth="xl">
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              Stake&nbsp;<DrawIcoToken alt="ayg" code="ayg" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Earn&nbsp;<DrawIcoToken alt="ayg" code="ayg" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;APR&nbsp;<Chip label="0.00 %" variant="outlined" />
            </Grid>

            <Grid item xs={3}>
              <Item>
                You STAKED
                <h2>{yourSupplyAYG} $AYG</h2>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                You EARNED
                <h2>{yourEarnedAYG} $AYG</h2>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                Total STAKING Supply
                <h2>{totalSupplyAYG}$AYG or {poolUsdValue} USD</h2>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                APR
                <h2>{yourAprAYG} %</h2>
              </Item>
            </Grid>

 {/*============================================= SC FRONT INTERACTION ========================================================= */}
           
            <Grid item xs={3}>
              <Item>
                <h3>STAKE YOUR AYG</h3> 
                <TextField id="filled-basic" label="Amount" variant="filled" value={inputValue} onChange={handleInputChange}/>
                <br />
                <br />
                <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                >
                  <ToggleButton value="stake" onClick={handleStake}>STAKE</ToggleButton>
                  <ToggleButton value="unstake" onClick={handleUnstake}>UNSTAKE</ToggleButton>

                </ToggleButtonGroup>
                <br />
                <br />
                <Button
                  variant="contained"
                  startIcon={<IconApprove />}
                  onClick={getRewardAYG}
                >
                  getReward ONLY
                </Button>
                <br />
                <br />
                <Button
                  variant="contained"
                  startIcon={<IconApprove />}
                  onClick={exit}
                >
                  getReward & unStakingAll
                </Button>
                <br />
                <br />
              </Item>
              <br />
              <br />
              <Item>
                <h3>TOOLS</h3>
                <Button
                  variant="contained"
                  startIcon={<IconApprove />}
                  onClick={updateAYG}  
                >
                  update_AYG
                </Button>
                <br />
                <br />
              </Item>
            </Grid>

 {/*============================================= GRAPH ========================================================= */}

            <Grid item xs={6}>
              <Item>
                <h3>GRAPH STAKING</h3>
                <ResponsiveContainer width='100%' aspect={4.0/1.0}>
                  <BarChart data={graphStakingAYG}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="supply" stackId="a" fill="#8884d8" />
                    <Bar dataKey="faucet" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="reward" stackId="a" fill="#df99a1" />
                  </BarChart>
                </ResponsiveContainer>

              </Item>
              <br />
              <Item>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="Staking - Unstaking">
                      <Tab label="Last Staking" {...a11yProps(0)} />
                      <Tab label="Last Unstaking" {...a11yProps(1)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Block#</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Address</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {moveStakingAYG.map((row) => (
                            <TableRow
                              key={row.blockNumber}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">{row.blockNumber}</TableCell>
                              <TableCell>{row.amount}</TableCell>
                              <TableCell>{row.addr}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                  <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Block#</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Address</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {moveUnstakingAYG.map((row) => (
                            <TableRow
                              key={row.blockNumber}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">{row.blockNumber}</TableCell>
                              <TableCell>{row.amount}</TableCell>
                              <TableCell>{row.addr}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>
                </Box>
              </Item>
            </Grid>

 {/*============================================= GRAPH ========================================================= */}

            <Grid item xs={3}>
              <Item>
                <h3>STACKING SIMULATION</h3>
                <TextField id="filled-basic" label="Amount" variant="filled" value={inputValue2} onChange={handleInputChange2}/>
                <br />
                <Button
                  variant="contained"
                  startIcon={<LaunchIcon />}
                  onClick={(e) => {
                    navigate('/NFT');
                  }}
                >
                  Get NFT
                </Button>
                <br />
                <br />
              </Item>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </React.Fragment>    
  );
}

export default StakeManage;