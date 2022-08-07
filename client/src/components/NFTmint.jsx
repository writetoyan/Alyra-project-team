import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';

import useEth from "../contexts/EthContext/useEth";

function DrawLinkAHrefExplorer(props) {
  const url = `https://kovan.etherscan.io/address/${props.addr}`;
  return <a href={url} target="_blank" rel="noreferrer">{props.addr}</a>
}


function NFTmint() {
  const navigate = useNavigate();

  const { state: { contractAyg, contractNftayg, accounts } } = useEth();

  const [addr_NFTAYG, setAddr_NFTAYG] = useState(contractNftayg._address);
  const [totalSupply, setTotalSupply] = useState(0);
  const [mintButton, setMintButton] = useState(false);
  const [mintStatus, setMintStatus] = useState("MINT");


  useEffect(() => {
    if(contractAyg){
    async function fetchData(){
        try {
          updateData();
        } catch(err) {
            console.error(err)
        }
    }
    fetchData();
    }
  }, []);

  
  const mint1 = async () => {
    contractNftayg.methods.mint1(accounts[0]).send({value: 1000000000000000, from: accounts[0]})
      .then((handleStake) => {
        console.log("handleStake = "+handleStake);
        updateData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const mint2 = async () => {
    contractNftayg.methods.mint2(accounts[0]).send({value: 2000000000000000, from: accounts[0]})
      .then((handleStake) => {
        console.log("handleStake = "+handleStake);
        updateData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const mint3 = async () => {
    contractNftayg.methods.mint3(accounts[0]).send({value: 3000000000000000, from: accounts[0]})
      .then((handleStake) => {
        console.log("handleStake = "+handleStake);
        updateData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const updateData = async () => {

    contractNftayg.methods.totalSupply().call({from: accounts[0]})
      .then((totalSupply) => {
        setTotalSupply(totalSupply);
        console.log("totalSupply = "+totalSupply);
        if(totalSupply==5)
        {
          setMintStatus("SOLD OUT");
          setMintButton("true");
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />

      {/* Head */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          NFT Mint
        </Typography>

        <Typography>
          CONTRACT ERC721&nbsp;:&nbsp;
          <DrawLinkAHrefExplorer
            addr={addr_NFTAYG}
          />
        </Typography>
        <br />

        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Grace au staking de NFTs<br />vous obtenez du <strong>$nAYG</strong> en récompense.<br />
          La supply totale est de <strong>5</strong> NFTs tout type confondu.<br />
          <strong>{totalSupply}/5</strong> NFTs ont été déjà minté par les utilisateurs !
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="md" component="main">
        <Grid container spacing={2} alignItems="flex-end">
            <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardContent
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 700,
                    width: 500,
                    maxHeight: { xs: 233, md: 350 },
                    maxWidth: { xs: 166, md: 250 },
                  }}
                  alt="Captain Alyra NFT"
                  src="./../ayg-nft_captain-alyra_ban.png"
                />
              </CardContent>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    0.001
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /$kETH
                  </Typography>
                </Box>
                <ul>
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                    >
                      Obtenez <strong>+10%</strong> $nAYG <br />avec le staking de ce NFT.
                    </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth variant="contained"
                  disabled={mintButton}
                  size="large"
                  onClick={mint1}
                >
                  {mintStatus}
                </Button>
              </CardActions>
            </Card>
          </Grid>
            <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardContent
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 700,
                    width: 500,
                    maxHeight: { xs: 233, md: 350 },
                    maxWidth: { xs: 166, md: 250 },
                  }}
                  alt="Super Alyra NFT"
                  src="./../ayg-nft_super-alyra_ban.png"
                />
              </CardContent>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    0.002
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /$kETH
                  </Typography>
                </Box>
                <ul>
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                    >
                      Obtenez <strong>+30%</strong> $nAYG <br />avec le staking de ce NFT.
                    </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth variant="contained"
                  disabled={mintButton}
                  size="large"
                  onClick={mint2}
                >
                  {mintStatus}
                </Button>
              </CardActions>
            </Card>
          </Grid>
            <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardContent
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 700,
                    width: 500,
                    maxHeight: { xs: 233, md: 350 },
                    maxWidth: { xs: 166, md: 250 },
                  }}
                  alt="Wonder Alyra NFT"
                  src="./../ayg-nft_wonder-alyra_ban.png"
                />
              </CardContent>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    0.003
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /$kETH
                  </Typography>
                </Box>
                <ul>
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                    >
                      Obtenez <strong>+50%</strong> $nAYG <br />avec le staking de ce NFT.
                    </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth variant="contained"
                  disabled={mintButton}
                  size="large"
                  onClick={mint3}
                >
                  {mintStatus}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Foot */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h4"
          variant="h4"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Commencer le staking NFT ?
        </Typography>
        <Button
          fullWidth variant="contained"
          size="large"
          onClick={(e) => {
            navigate('/NFT/Staking');
          }}
        >
          Let's go to make more money !
        </Button>
      </Container>
      {/* End Foot */}

    </React.Fragment>
  );
}

export default NFTmint;