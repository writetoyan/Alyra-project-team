import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import { styled } from '@mui/material/styles';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#999',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl">
      <Box>
        <h2>Dashboard</h2>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item>xs=8
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
            <Item>xs=4
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
        </Grid>
        <br />
        <Grid item xs={2}>
          <Box
            component="img"
            sx={{
              height: 200,
              width: 800,
              maxHeight: { xs: 100, md: 200 },
              maxWidth: { xs: 400, md: 800 },
            }}
            alt="AYG NFT Collection"
            src="./../ayg-nft_ban800x200.png"
            onClick={(e) => {
              navigate('/NFT');
            }}
          />
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
