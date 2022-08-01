import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import IconButton from '@mui/material/IconButton';
import IconGraph from '@mui/icons-material/Analytics';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Typography from '@mui/material/Typography';

function createData(token1, token2, apy, totalStaked) {
  return { token1, token2, apy, totalStaked };
}

const rows = [
  createData('ayg', 'ayg', 156.2, 87458, 2.47),
  createData('eth', 'ayg', 83.1, 54158, 1.25),
  createData('dai', 'ayg', 0, 0, 0),
  createData('usdt', 'ayg', 0, 0, 0),
  createData('link', 'ayg', 0, 0, 0),
];

function DrawIcoToken({ alt, code }) {
  const href= `ico_${code}.png`;
  const CODE = code.toUpperCase();
//  return <Avatar alt={alt} src={href} />;
  return <Chip
    avatar={<Avatar alt={alt} src={href} />}
    label={CODE}
    variant="outlined"
  />
}

function Stake() {
  const navigate = useNavigate();

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
          Stake for earn token !
        </Typography>
      </Container>
      {/* End Head */}
      <Container maxWidth="md" component="main">
        <Box>
          <FormControlLabel
            value="bottom"
            control={<Switch color="primary" />}
            label="Only STAKED"
            labelPlacement="bottom"
          />
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Stake</TableCell>
                  <TableCell>Staked</TableCell>
                  <TableCell>Earn</TableCell>
                  <TableCell>Earned</TableCell>
                  <TableCell>APY&nbsp;(%)</TableCell>
                  <TableCell>Liquidity&nbsp;($)</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={(e) => {
                      navigate('/StakeManage/AYG');
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <DrawIcoToken alt="ayg" code="ayg" />
                    </TableCell>
                    <TableCell>2.84</TableCell>
                    <TableCell component="th" scope="row">
                      <DrawIcoToken alt="ayg" code="ayg" />
                    </TableCell>
                    <TableCell>0.153</TableCell>
                    <TableCell>156 %</TableCell>
                    <TableCell>875412</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        size="large"
                        onClick={(e) => {
                          navigate('/StakeManage/AYG');
                        }}
                      >
                        <IconGraph fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Container>



    </React.Fragment>    
  );
}

export default Stake;
