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

function DrawLinkAHrefExplorer(props) {
  const url = `https://kovan.etherscan.io/address/${props.addr}`;
  return <a href={url} target='_blank'>{props.addr}</a>
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function TokenManageNAYG() {

  const { state: { contractAyg, contractNayg, contractNftayg, contractStaking, contractStakingNFT, accounts, addressStaking, addressStakingNFT } } = useEth();

  const [addr_NAYG, setAddr_NAYG] = useState(contractNayg._address);
  const [name_NAYG, setName_NAYG] = useState(0);
  const [decimals_NAYG, setDecimals_NAYG] = useState(0);
  const [symbol_NAYG, setSymbol_NAYG] = useState(0);
  const [totalsupply_NAYG, setTotalSupply_NAYG] = useState(0);
  const [amountFaucet_NAYG, setAmountFaucet_NAYG] = useState(0);
  const [moveTokenNAYG, setDataMoveNAYG] = useState([]);
  const [graphTokenNAYG, setDataGraphNAYG] = useState([]);

  const [nbMoveNAYG, setNbMoveNAYG] = useState(0);


  useEffect(() => {
    if(contractNayg){
    async function fetchData(){
        try {
          updateNAYG();
        } catch(err) {
            console.error(err)
        }
    }
    fetchData();
    }
  }, []);

  const faucetNAYG = async () => {
    contractNayg.methods.getFaucet(accounts[0]).send({from: accounts[0]})
      .then((results) => {
        console.log(results);
        console.log(results.events.MintSupply.returnValues.amount);
        updateNAYG();
      })
      .catch((err) => {
        console.log(err);
      });
  }
 
  const setFaucetNAYG = async () => {
    let amount = 2000; // ETH (test)
    amount = eval(amount*10**18);
    contractNayg.methods.setFaucet(amount).send({from: accounts[0]})
      .then((results) => {
        console.log(results);
        updateNAYG();
      })
      .catch((err) => {
        console.log(err);
      });    
  }
  
  const updateNAYG = async () => {
    contractNayg.methods.totalSupply().call({ from: accounts[0] })
      .then((totalsupply_NAYG) => {
        totalsupply_NAYG = totalsupply_NAYG/10**18;
        totalsupply_NAYG = Math.round(totalsupply_NAYG * 100) / 100;
        setTotalSupply_NAYG(totalsupply_NAYG);
        console.log("totalsupply_NAYG = "+totalsupply_NAYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractNayg.methods.name().call({ from: accounts[0] })
      .then((name_NAYG) => {
        setName_NAYG(name_NAYG);
        console.log("name_NAYG = "+name_NAYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractNayg.methods.decimals().call({ from: accounts[0] })
      .then((decimals_NAYG) => {
        setDecimals_NAYG(decimals_NAYG);
        console.log("decimals_NAYG = "+decimals_NAYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractNayg.methods.symbol().call({ from: accounts[0] })
      .then((symbol_NAYG) => {
        setSymbol_NAYG(symbol_NAYG);
        console.log("symbol_NAYG = "+symbol_NAYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractNayg.methods.amountFaucet().call({ from: accounts[0] })
      .then((amountFaucet_NAYG) => {
        setAmountFaucet_NAYG(amountFaucet_NAYG/10**18);
        console.log("amountFaucet_NAYG = "+amountFaucet_NAYG);
      })
      .catch((err) => {
        console.log(err);
      });

    contractNayg.getPastEvents('MintSupply', { fromBlock: 0, toBlock: 'latest' })
      .then((results) => {
        let supplyTotal = 0;
        let moveTokenNAYG = [];
        let graphTokenNAYG = [];
        results.forEach(async (result) => {
/*
          const getTimeByBlock = async(txHash) => {
            const blockN = resultawait web3.eth.getTransaction(txHash)
            const blockData = await web3.eth.getBlock(blockN.blockNumber)
          
            return blockData.timestamp
          }
*/
/*
          contract_Erc20_NAYG.getBlock(result.blockNumber)
          .then((blockData) => {
            console.log(blockData.timestamp);
          }
*/


          moveTokenNAYG.push({ methode: result.returnValues.methode, blockNumber: result.blockNumber, amount: result.returnValues.amount/10**18, addr: result.returnValues.addr, transactionHash: result.transactionHash });
          setDataMoveNAYG(moveTokenNAYG);
          supplyTotal = result.returnValues.amount/10**18 + supplyTotal;
          switch (result.returnValues.methode) {
            case 'getFaucet':
              graphTokenNAYG.push({ name: result.blockNumber, supply: supplyTotal, faucet: result.returnValues.amount/10**18, reward: 0  });
              break;
            case 'getReward':
              graphTokenNAYG.push({ name: result.blockNumber, supply: supplyTotal, faucet: 0, reward: result.returnValues.amount/10**18  });
              break;
            default:
              console.log(`Sorry !`);
          }
          setDataGraphNAYG(graphTokenNAYG);
        })
        setNbMoveNAYG(results.length);

        console.log(moveTokenNAYG)
        console.log(graphTokenNAYG)
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
        <DrawIcoToken alt="nayg" code="nayg" />&nbsp;NAYG Token
        </Typography>
        <Typography variant="h7" align="center" color="text.secondary" component="p">
        <br />CONTRACT&nbsp;ERC20&nbsp;:&nbsp;
        <DrawLinkAHrefExplorer
          addr={addr_NAYG}
        />
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl">
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Item>
                <h3>TOTAL SUPPLY</h3>
                <h1>{totalsupply_NAYG} $nAYG</h1>
              </Item>
              <br />
              <Item>
                <h3>CLAIM FAUCET</h3>
                <Button
                  variant="contained"
                  startIcon={<IconFaucet />}
                  onClick={faucetNAYG}
                >
                  {amountFaucet_NAYG} NAYG 
                </Button>
                <br />claim unlimited
                <br />
              </Item>
              <br />
              <Item>
                <h3>SET FAUCET (onlyOwner)</h3>
                <TextField id="faucetAmount" label="amount" variant="outlined" value={amountFaucet_NAYG} />
                <br />
                <Button
                  variant="contained"
                  startIcon={<IconFaucet />}
                  onClick={setFaucetNAYG}
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
                  <BarChart data={graphTokenNAYG}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="supply" stackId="a" fill="#8884d8" />
                    <Bar dataKey="faucet" stackId="b" fill="#82ca9d" />
                    <Bar dataKey="reward" stackId="c" fill="#df99a1" />
                  </BarChart>
                </ResponsiveContainer>
                <br />
              </Item>
              <br />
              <Item>
                <h3>LAST MOUVEMENT ({nbMoveNAYG})</h3>
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
                      {moveTokenNAYG.map((row) => (
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

export default TokenManageNAYG;
