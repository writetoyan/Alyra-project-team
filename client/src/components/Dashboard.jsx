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
      <br />
      <Box
        component="img"
        sx={{
          height: 600,
          width: 1500,
          maxHeight: { xs: 200, md: 600 },
          maxWidth: { xs: 500, md: 1500 },
        }}
        alt="Staking NFT"
        src="./../dashboard.jpg"
        onClick={(e) => {
          navigate('/NFT/Staking');
        }}
      />

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
    </Container>
  );
}

export default Dashboard;
