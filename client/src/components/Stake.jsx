import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Typography from '@mui/material/Typography';

function createData(token1, token2, apy, totalStaked, link, click) {
  return { token1, token2, apy, totalStaked, link, click };
}

const rows = [
  createData('ayg', 'ayg', 0, 0, '/StakeManage/AYG', 'Stake AYG'),
  createData('LP Token', 'ayg', 0, 0, '/StakeManage/LP', 'Stake LP token'),
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
          Stake to earn token !
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
              {rows.map((row) => (
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <DrawIcoToken alt={row.token1} code={row.token1} />
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell component="th" scope="row">
                      <DrawIcoToken alt={row.token2} code={row.token2} />
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0 %</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          navigate(`${row.link}`);
                        }}
                      >
                        {row.click}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Box>
      </Container>

    </React.Fragment>    
  );
}

export default Stake;
