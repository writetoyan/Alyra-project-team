import * as React from 'react';

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
  return (
    <Container maxWidth="xl">
      <Box>
        <h2>Dashboard</h2>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Item>xs=8</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={4}>
            <Item>xs=4</Item>
          </Grid>
          <Grid item xs={8}>
            <Item>xs=8</Item>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
