// Import NPM
import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

// Import SC & Web3
import useEth from "./../contexts/EthContext/useEth";

// Import UI
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import IconFaucet from '@mui/icons-material/CleanHands';
import IconGraph from '@mui/icons-material/Analytics';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function DrawLinkAHrefExplorer(props) {
  const url = `https://kovan.etherscan.io/address/${props.addr}`;
  return <a href={url} target="_blank" rel="noreferrer">{props.addr}</a>
}

function Token() {

  const { state: { contractAyg, contractNayg, accounts } } = useEth();

console.log(contractNayg._address);
  // AYG
  const [addr_AYG, setAddr_AYG] = useState(contractAyg._address);
  const [name_AYG, setName_AYG] = useState(0);
  const [decimals_AYG, setDecimals_AYG] = useState(0);
  const [symbol_AYG, setSymbol_AYG] = useState(0);
  const [totalsupply_AYG, setTotalSupply_AYG] = useState(0);

  // NAYG
  const [addr_NAYG, setAddr_NAYG] = useState(contractNayg._address);
  const [name_NAYG, setName_NAYG] = useState(0);
  const [decimals_NAYG, setDecimals_NAYG] = useState(0);
  const [symbol_NAYG, setSymbol_NAYG] = useState(0);
  const [totalsupply_NAYG, setTotalSupply_NAYG] = useState(0);

  useEffect(() => {
    if(contractAyg && contractNayg){
    async function fetchData(){
        try {
          updateAYG();
          updateNAYG();
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
    const updateAYG = async () => {
      contractAyg.methods.totalSupply().call({ from: accounts[0] })
        .then((totalsupply_AYG) => {
          totalsupply_AYG = totalsupply_AYG/10**18;
          totalsupply_AYG = Math.round(totalsupply_AYG * 100) / 100;
          setTotalSupply_AYG(totalsupply_AYG);
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

    }



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
          setSymbol_AYG(symbol_NAYG);
          console.log("symbol_NAYG = "+symbol_NAYG);
        })
        .catch((err) => {
          console.log(err);
        });

    }



  const navigate = useNavigate();

  return (
    <div className="Token">
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
          ADMIN
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl" component="main">
        <Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Decimals</TableCell>
                  <TableCell>TotalSupply</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Manage</TableCell>
                  <TableCell>Faucet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Chip avatar={<Avatar alt="AYG" src="./ico_ayg.png" />} label="AYG" variant="outlined" />
                    </TableCell>
                    <TableCell>{name_AYG}</TableCell>
                    <TableCell>{decimals_AYG}</TableCell>
                    <TableCell>{totalsupply_AYG}</TableCell>
                    <TableCell>
                      <DrawLinkAHrefExplorer
                        addr={addr_AYG}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={(e) => {
                          navigate('/TokenManage/AYG');
                        }}
                      >
                        <IconGraph
                          fontSize="inherit"
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={faucetAYG}
                      >
                        <IconFaucet
                          fontSize="inherit"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Chip avatar={<Avatar alt="NAYG" src="./ico_nayg.png" />} label="NAYG" variant="outlined" />
                    </TableCell>
                    <TableCell>{name_NAYG}</TableCell>
                    <TableCell>{decimals_NAYG}</TableCell>
                    <TableCell>{totalsupply_NAYG}</TableCell>
                    <TableCell>
                      <DrawLinkAHrefExplorer
                        addr={addr_NAYG}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={(e) => {
                          navigate('/TokenManage/nAYG');
                        }}
                      >
                        <IconGraph
                          fontSize="inherit"
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={faucetNAYG}
                      >
                        <IconFaucet
                          fontSize="inherit"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>

              </TableBody>
            </Table>
          </TableContainer>


        </Box>
      </Container>

    </div>
  );
}

export default Token;
