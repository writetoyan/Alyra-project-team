import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import IconAdd from '@mui/icons-material/Add';
import IconMore from '@mui/icons-material/MoreHoriz';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Typography from '@mui/material/Typography';

function createData(token1, token2, poolValue, volume24, apr) {
  return { token1, token2, poolValue, volume24, apr };
}

const rows = [
  createData('AYG', 'NAYG', 0, 0, 0),
];

function DrawIcoToken({ alt, code }) {
  const href= `ico_${code}.png`;
  const CODE = code.toUpperCase()+" (50%)";
//  return <Avatar alt={alt} src={href} />;
  return <Chip
    avatar={<Avatar alt={alt} src={href} />}
    label={CODE}
    variant="outlined"
  />
}

function Pool() {
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
          POOL
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Nos POOLS de rendement
        </Typography>
      </Container>
      {/* End Head */}
      <Container maxWidth="md" component="main">
        <Box>
          <Button
            variant="contained"
            endIcon={<IconAdd />}
            onClick={(e) => {
              console.log(e.currentTarget.dataset.buttonKey);
              navigate('/PoolAdd');
            }}
          >
            Ajouter une POOL
          </Button>
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Pair</TableCell>
                  <TableCell align="right">Pool value&nbsp;($)</TableCell>
                  <TableCell align="right">Volume&nbsp;(24h)</TableCell>
                  <TableCell align="right">APR&nbsp;(%)</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    onClick={(e) => {
                      console.log("Detected Row Click");
                      console.log(e.currentTarget.dataset.buttonKey);
                      navigate('/PoolManage');
                    }}
        
                  >
                    <TableCell component="th" scope="row">
                      <Stack direction="row" spacing={1}>
                        <DrawIcoToken alt={row.token1} code={row.token1} />
                        <IconButton aria-label="more" size="small">
                          <IconAdd fontSize="inherit" />
                        </IconButton>
                        <DrawIcoToken alt={row.token2} code={row.token2} />
                      </Stack>
                    </TableCell>
                    <TableCell align="right">{row.poolValue}</TableCell>
                    <TableCell align="right">{row.volume24}</TableCell>
                    <TableCell align="right">{row.apr}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        Add liquidity
                      </IconButton>
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

export default Pool;
