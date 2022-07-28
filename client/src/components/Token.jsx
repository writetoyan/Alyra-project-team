import React from 'react';
import {useNavigate} from 'react-router-dom';

import { styled } from '@mui/material/styles';

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

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import IconAdd from '@mui/icons-material/Add';
import IconMore from '@mui/icons-material/MoreHoriz';
import IconFaucet from '@mui/icons-material/CleanHands';

function createData(name, symbol, decimals, totalsupply, address) {
  return { name, symbol, decimals, totalsupply, address };
}

const rows = [
  createData('AYG token', 'AYG', 18, 50000000000000000000, '0x84E0d217CD3Af6F5CCe2759442bA84b9A1D59253'),
];

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





function Token() {


  const navigate = useNavigate();

  const [alignment, setAlignment] = React.useState('stake');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };  



  const asyncFunc = async () => {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("I am a done promise!"), 3000)
    });

    let result = await promise

    alert(result);
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
          ADMIN
        </Typography>
      </Container>
      {/* End Head */}

      <TextField id="outlined-basic" label="address contract ERC20" variant="outlined" />
      <br />
      <Button
        variant="contained"
        endIcon={<IconAdd />}
      >
        Ajouter un TOKEN
      </Button>
      <br />
      <br />

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
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <DrawIcoToken alt={row.symbol} code={row.symbol} />
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.decimals}</TableCell>
                    <TableCell>{row.totalsupply}</TableCell>
                    <TableCell><a href="https://kovan.etherscan.io/address/{row.address}" target="_blank" rel="noreferrer">{row.address}</a></TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={(e) => {
                          navigate('/StakeManage');
                        }}
                      >
                        <IconMore
                          fontSize="inherit"
                        />
                      </IconButton>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={asyncFunc}
                      >
                        <IconFaucet
                          fontSize="inherit"
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Container>

     
      <Container maxWidth="xl">
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              AYG Token&nbsp;<DrawIcoToken alt="ayg" code="ayg" />
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
                  onClick={(e) => {
                    alert("Contract approuved")
                  }}
                >
                  Approuve contract
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
                  <ToggleButton value="stake">STAKE</ToggleButton>
                  <ToggleButton value="unstake">UNSTAKE</ToggleButton>
                </ToggleButtonGroup>
                <br />
                <br />
                <DrawIcoToken alt="eth" code="eth" />
                <br />
                <br />
                <TextField id="filled-basic" label="Filled" variant="filled" />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <h3>GRAPH SUPPLY TOKEN</h3>
                <br />
                <br />
                <br />
                <br />
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

export default Token;
