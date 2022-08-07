import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import CardMedia from '@mui/material/CardMedia';

import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import useEth from "../contexts/EthContext/useEth";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#DDD',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));



function NFTstaking() {

  const { state: { contractNftayg, contractStakingNFT, accounts } } = useEth();

  const [rewardsPerHour, setRewardsPerHour] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [tokenUnstakedByOwner, setTokenUnstakedByOwner] = useState([]);
  const [rowUnstakedNFT, setRowUnstakedNFT] = useState([]);
  const [rowStakedNFT, setRowStakedNFT] = useState([]);

  
  const getData = async () => {
    contractStakingNFT.methods.rewardsPerHour().call({from: accounts[0]})
    .then((rewardsPerHour) => {
      rewardsPerHour = rewardsPerHour/10**18;
      rewardsPerHour = Math.round(rewardsPerHour * 100) / 100;
      setRewardsPerHour(rewardsPerHour);
      console.log("rewardsPerHour="+rewardsPerHour);
    })
    .catch((err) => {
      console.log(err);
    });
  }  

  const getUnstakedNFT = async () => {

    contractNftayg.methods.totalSupply().call({from: accounts[0]})
    .then((totalSupply) => {
      setTotalSupply(totalSupply);
      console.log("totalSupply="+totalSupply);
    
      for(let i=0; i<totalSupply; i++) {
        console.log("i="+i);
        contractNftayg.methods.tokenOfOwnerByIndex(accounts[0], i).call({from: accounts[0]})
        .then((tokenOfOwnerByIndex) => {
          setTokenUnstakedByOwner(tokenUnstakedByOwner => [...tokenUnstakedByOwner, tokenOfOwnerByIndex]);
          console.log("tokenOfOwnerByIndex = "+tokenOfOwnerByIndex);

          contractNftayg.methods.tokenURI(tokenOfOwnerByIndex).call({from: accounts[0]})
          .then((tokenURI) => {
            console.log("tokenURI = "+tokenURI);

            getDataFromTokenURI(tokenOfOwnerByIndex, tokenURI);
          })
          .catch((err) => {
            console.log(err);
          });
          
        })
        .catch((err) => {
          console.log(err);
        });
      }
      console.log("totalSupply = "+totalSupply);
    })
    .catch((err) => {
      console.log(err);
    });

    console.log("tokenUnstakedByOwner = "+tokenUnstakedByOwner);
  }


  const getStakedNFT = async () => {
    contractStakingNFT.methods.tokenStakedByOwner(accounts[0]).call({from: accounts[0]})
    .then((tokenStakedByOwner) => {
      console.log("tokenStakedByOwner = "+tokenStakedByOwner);

      for(let i=0; i<tokenStakedByOwner.length; i++) {
        console.log(tokenStakedByOwner[i]);
        contractNftayg.methods.tokenURI(tokenStakedByOwner[i]).call({from: accounts[0]})
          .then((tokenURI) => {
            console.log("tokenURI = "+tokenURI);
            getDataFromTokenURI2(tokenStakedByOwner[i], tokenURI);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function getDataFromTokenURI(id, tokenURI) {
    return fetch(tokenURI)
    .then((response) => response.json())
    .then((responseJson) => {
      let newNFT = createNFT(id, responseJson.name, responseJson.description, responseJson.image);
      setRowUnstakedNFT(rowUnstakedNFT => [...rowUnstakedNFT, newNFT]);
      console.log("rowUnstakedNFT = "+rowUnstakedNFT);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  function getDataFromTokenURI2(id, tokenURI) {
    return fetch(tokenURI)
    .then((response) => response.json())
    .then((responseJson) => {
      let newNFT = createNFT(id, responseJson.name, responseJson.description, responseJson.image);
      setRowStakedNFT(rowUnstakedNFT => [...rowUnstakedNFT, newNFT]);
      console.log("rowUnstakedNFT = "+rowUnstakedNFT);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  function createNFT(id, name, description, image) {
    return { id, name, description, image };
  }

 
  const updateData = async () => {
    try {
      await getData();
      await getUnstakedNFT();
      await getStakedNFT();

      } catch(err) {
        console.log(err);
    };
  }  

  useEffect(() => {
    if(contractNftayg){
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
          NFT Staking
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Les reward de staking sont de : {rewardsPerHour} $nAYG / heure.
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Item>
                <h1>NFT unstaked</h1>
                {rowUnstakedNFT.map((row) => (
                  <DrawBoxUnstakedNFT
                  key={row.id}
                  id={row.id}
                  name={row.name}
                  description={row.description}
                  image={row.image}
                  updateData={updateData}
                  rowStakedNFT={rowStakedNFT}
                  setRowStakedNFT={setRowStakedNFT}
                  rowUnstakedNFT={rowUnstakedNFT}
                  setRowUnstakedNFT={setRowUnstakedNFT}
                  >
                  </DrawBoxUnstakedNFT>
                ))}
                <br />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <h1>NFT staked</h1>
                {rowStakedNFT.map((row) => (
                  <DrawBoxStakedNFT
                  key={row.id}
                  id={row.id}
                  name={row.name}
                  description={row.description}
                  image={row.image}
                  updateData={updateData}
                  rowStakedNFT={rowStakedNFT}
                  setRowStakedNFT={setRowStakedNFT}
                  rowUnstakedNFT={rowUnstakedNFT}
                  setRowUnstakedNFT={setRowUnstakedNFT}
                  >
                  </DrawBoxStakedNFT>
                ))}
                <br />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>

    </React.Fragment>
  );
}


function DrawBoxUnstakedNFT(props) {
  const { state: { contractNftayg, contractStakingNFT, accounts, addressStakingNFT } } = useEth();

  const [tokenIds, setTokenIds] = useState([]);
    
  const doStakingNFT = async (e) => {
    let tokenId = e.target.getAttribute("data-id");
    console.log("tokenId = "+tokenId);

    let tokenIds = [];
    tokenIds.push(tokenId);
    console.log("tokenIds2 = "+tokenIds);

    await contractNftayg.methods.approve(addressStakingNFT, tokenId).send({from: accounts[0]});

    contractStakingNFT.methods.Stake(tokenIds).send({from: accounts[0]})
      .then((Stake) => {
        console.log("Stake = "+Stake);

        props.setRowStakedNFT([]);
        props.setRowUnstakedNFT([]);
        props.updateData();
      })
      .catch((err) => {
        console.log(err);
      });

  }

  return (
    <React.Fragment>
      <Card sx={{ display: 'flex' }}>
        <CardMedia
          component="img"
          sx={{ width: 300 }}
          image={props.image}
          alt="NFT"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5" align="left">
              {props.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div" align="left">
              NFT ID #{props.id}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div" align="left">
              {props.description}
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <Stack direction="row" spacing={2}>
              <Button
                data-id={props.id}
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={doStakingNFT}
              >
                Staking
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
      <br />
    </React.Fragment>
  );
}

function DrawBoxStakedNFT(props) {
  const { state: { contractStakingNFT, accounts } } = useEth();

  const [earnedReward, setEarnedReward] = useState(0);
  const [earnedBonus, setEarnedBonus] = useState(0);
  const [earnedTotal, setEarnedTotal] = useState(0);
  
  const doUnstakingNFT = async (e) => {
    let tokenId = e.target.getAttribute("data-id");
    let tokenIds = [];
    tokenIds.push(tokenId);
    console.log("tokenIds = "+tokenIds);
    contractStakingNFT.methods.unstake(tokenIds).send({from: accounts[0]})
      .then((Unstake) => {
        console.log("Unstake = "+Unstake);
        const id = e.target.getAttribute("data-id")
        props.setRowStakedNFT([]);
        props.setRowUnstakedNFT([]);
        props.updateData();
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const claimRewards = async (e) => {
    let tokenId = e.target.getAttribute("data-id");
    let tokenIds = [];
    tokenIds.push(tokenId);
    console.log("tokenIds = "+tokenIds);
    contractStakingNFT.methods.claim(tokenIds).send({from: accounts[0]})
      .then((claim) => {
        console.log("claim = "+claim);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const updateRewards = async (e) => {
    let earnedTotal = 0;
    //let tokenId = e.target.getAttribute("data-id");
    let tokenId = props.id;
    let tokenIds = [];
    tokenIds.push(tokenId);
    await contractStakingNFT.methods.getRewardAmount(accounts[0], tokenIds).call({from: accounts[0]})
      .then((getRewardAmount) => {
        getRewardAmount = getRewardAmount/10**18;
        getRewardAmount = Math.round(getRewardAmount * 100) / 100;
        setEarnedReward(getRewardAmount);
        earnedTotal = earnedTotal+getRewardAmount;
        setEarnedTotal(earnedTotal);
      })
      .catch((err) => {
        console.log(err);
      });
    await contractStakingNFT.methods.getBonusAmount(accounts[0], tokenIds).call({from: accounts[0]})
      .then((getBonusAmount) => {
        getBonusAmount = getBonusAmount/10**18;
        getBonusAmount = Math.round(getBonusAmount * 100) / 100;
        setEarnedBonus(getBonusAmount);
        earnedTotal = earnedTotal+getBonusAmount;
        earnedTotal = Math.round(earnedTotal * 100) / 100;
        setEarnedTotal(earnedTotal);
      })
      .catch((err) => {
        console.log(err);
      });

  }


  useEffect(() => {
    if(contractStakingNFT){
    async function fetchData(){
        try {
          updateRewards();
        } catch(err) {
          console.error(err)
        }
    }
    fetchData();
    }
  }, []);

  
  useEffect(() => {
    let interval
    const updateCounter = () => {
      updateRewards();
    }
    interval = setInterval(() => {
      updateCounter()
    }, 10000)
    return () => {
      // Clear the interval when component is unmounted
      clearInterval(interval)
    }
  }, [])

  return (
    <React.Fragment>
      <Card sx={{ display: 'flex' }}>
        <CardMedia
          component="img"
          sx={{ width: 300 }}
          image={props.image}
          alt="NFT"
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5" align="left">
              {props.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div" align="left">
              NFT ID #{props.id}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div" align="left">
              {props.description}
            </Typography>
            <Typography
              align="left"
              >
              Reward : {earnedReward} $nAYG<br />
              Bonus  : {earnedBonus} $nAYG<br /><br />
              <strong>TOTAL  : {earnedTotal} $nAYG</strong>
            </Typography>
          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <Stack direction="row" spacing={2}>
            <Button
                data-id={props.id}
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={doUnstakingNFT}
              >
                Unstaking
              </Button>
              <Button
                data-id={props.id}
                variant="contained"
                endIcon={<AttachMoneyIcon />}
                onClick={claimRewards}
              >
                Claim
              </Button>
            </Stack>
          </Box>
        </Box>
      </Card>
      <br />
    </React.Fragment>
  );
}


export default NFTstaking;