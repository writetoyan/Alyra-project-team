// Import NPM
import React, { useEffect, useState, PureComponent } from 'react';

// Import SC & Web3
import useEth from "./../contexts/EthContext/useEth";

import { styled } from '@mui/material/styles';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconFaucet from '@mui/icons-material/CleanHands';
import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


// Import Recharts UI
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



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


function TokenManageAYG() {

  const { state: { contractAyg, accounts, address_Dapp } } = useEth();

  const [name_AYG, setName_AYG] = useState(0);
  const [decimals_AYG, setDecimals_AYG] = useState(0);
  const [symbol_AYG, setSymbol_AYG] = useState(0);
  const [totalsupply_AYG, setTotalSupply_AYG] = useState(0);
  const [amountFaucet_AYG, setAmountFaucet_AYG] = useState(0);
  const [moveTokenAYG, setDataMoveAYG] = useState([]);
  const [graphTokenAYG, setDataGraphAYG] = useState([]);

  const [nbMoveAYG, setNbMoveAYG] = useState(0);


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

  const faucetAYG = async () => {
    contractAyg.methods.faucet(accounts[0]).send({from: accounts[0]})
      .then((results) => {
        console.log(results);
        console.log(results.events.MintSupply.returnValues.amount);
        updateAYG();
      })
      .catch((err) => {
        console.log(err);
      });
  }
 
  const setFaucetAYG = async () => {
    let amount = 2000; // ETH (test)
    amount = eval(amount*1000000000000000000);
    contractAyg.methods.setFaucet(amount).send({from: accounts[0]})
      .then((results) => {
        console.log(results);
        updateAYG();
      })
      .catch((err) => {
        console.log(err);
      });    
  }
  
  const updateAYG = async () => {
    contractAyg.methods.totalSupply().call({ from: accounts[0] })
      .then((totalsupply_AYG) => {
        setTotalSupply_AYG(totalsupply_AYG/1000000000000000000);
        console.log("totalsupply_AYG = "+totalsupply_AYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractAyg.methods.name().call({ from: accounts[0] })
      .then((name_AYG) => {
        setName_AYG(name_AYG);
        console.log("name_AYG = "+name_AYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractAyg.methods.decimals().call({ from: accounts[0] })
      .then((decimals_AYG) => {
        setDecimals_AYG(decimals_AYG);
        console.log("decimals_AYG = "+decimals_AYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractAyg.methods.symbol().call({ from: accounts[0] })
      .then((symbol_AYG) => {
        setSymbol_AYG(symbol_AYG);
        console.log("symbol_AYG = "+symbol_AYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractAyg.methods.amountFaucet().call({ from: accounts[0] })
      .then((amountFaucet_AYG) => {
        setAmountFaucet_AYG(amountFaucet_AYG/1000000000000000000);
        console.log("amountFaucet_AYG = "+amountFaucet_AYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractAyg.getPastEvents('MintSupply', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        let supplyTotal = 0;
        let moveTokenAYG = [];
        let graphTokenAYG = [];
        results.forEach(async (result) => {
/*
          const getTimeByBlock = async(txHash) => {
            const blockN = resultawait web3.eth.getTransaction(txHash)
            const blockData = await web3.eth.getBlock(blockN.blockNumber)
          
            return blockData.timestamp
          }
*/
/*
          contract_Erc20_AYG.getBlock(result.blockNumber)
          .then((blockData) => {
            console.log(blockData.timestamp);
          }
*/


          moveTokenAYG.push({ methode: result.returnValues.methode, blockNumber: result.blockNumber, amount: result.returnValues.amount/1000000000000000000, addr: result.returnValues.addr, transactionHash: result.transactionHash });
          setDataMoveAYG(moveTokenAYG);
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
        })
        setNbMoveAYG(results.length);

        console.log(moveTokenAYG)
        console.log(graphTokenAYG)
      })
      .catch((err) => {
        console.log(err);
      });

  }




  function createData(type, date, amount, to) {
    return { type, date, amount, to };
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
          TOKEN
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
        <DrawIcoToken alt="ayg" code="ayg" />&nbsp;AYG Token
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl">
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <h3>TOTAL SUPPLY</h3>
                <h1>{totalsupply_AYG}</h1>
              </Item>
              <br />
              <Item>
                <h3>CLAIM FAUCET</h3>
                <Button
                  variant="contained"
                  startIcon={<IconFaucet />}
                  onClick={faucetAYG}
                >
                  {amountFaucet_AYG} AYG 
                </Button>
                <br />
                <br />
              </Item>
              <br />
              <Item>
                <h3>SET FAUCET (onlyOwner)</h3>
                <TextField id="faucetAmount" label="amount" variant="outlined" value={amountFaucet_AYG} />
                <br />
                <Button
                  variant="contained"
                  startIcon={<IconFaucet />}
                  onClick={setFaucetAYG}
                >
                  SET 
                </Button>
                <br />
                <br />
              </Item>
            </Grid>

            <Grid item xs={9}>
              <Item>
                <h3>GRAPH SUPPLY</h3>
                <ResponsiveContainer width='100%' aspect={4.0/1.0}>
                  <BarChart data={graphTokenAYG}>
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
                <br />
              </Item>
              <br />
              <Item>
                <h3>LAST MOUVEMENT ({nbMoveAYG})</h3>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Block#</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>To</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {moveTokenAYG.map((row) => (
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {row.methode}
                          </TableCell>
                          <TableCell>{row.blockNumber}</TableCell>
                          <TableCell>{row.amount}</TableCell>
                          <TableCell>{row.addr}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>    
  );
}

export default TokenManageAYG;
