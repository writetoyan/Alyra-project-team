import * as React from 'react';

import { styled } from '@mui/material/styles';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';


function DrawIcoToken({ alt, code }) {
  const href= `ico_${code}.png`;
  const CODE = code.toUpperCase()+" (50%)";
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

function PoolManage() {

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
          Informations
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack direction="row" spacing={1}>
                <DrawIcoToken alt="eth" code="eth" />
                <DrawIcoToken alt="dai" code="dai" />
                <Chip
                  label="Pool Fees 0.01%"
                  variant="outlined"
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Item>
                Pool value
                <h2>$ 151840</h2>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                Volume (24h)
                <h2>$ 4851.10</h2>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                Fee (24h)
                <h2>$ 422.50</h2>
              </Item>
            </Grid>
            <Grid item xs={3}>
              <Item>
                APR
                <h2>4.5 %</h2>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <h3>GRAPH LIQUIDITY</h3>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <h3>...</h3>
                <br />
                <br />
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <h3>TABLE HISTORIQUE</h3>
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

export default PoolManage;
