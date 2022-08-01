import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import Typography from '@mui/material/Typography';


import Uniswap from "./Uniswap";

function Swap() {

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
          SWAP
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Need swap ?
        </Typography>
      </Container>
      {/* End Head */}
      <Container>
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
            </Grid>
            <Grid item xs={4}>
              <Uniswap />
            </Grid>
            <Grid item xs={4}>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>    
  );
}

export default Swap;
