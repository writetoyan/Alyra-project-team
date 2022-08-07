import * as React from 'react';
import {useNavigate} from 'react-router-dom';

import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function Team() {
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
          TEAM
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
        i am what i am !
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl">
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Item>
                <h2>Alex</h2>
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: 200,
                    maxHeight: { xs: 100, md: 150 },
                    maxWidth: { xs: 100, md: 150 },
                  }}
                  alt="Alex"
                  src="./../team_user1.png"
                  onClick={(e) => {
                    navigate('/NFT/Staking');
                  }}
                />
                <Button
                  fullWidth variant="contained"
                  size="large"
                  onClick={(e) => {
                    alert('Github !');
                  }}
                >
                  view Github
                </Button>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <h2>Yannick</h2>
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: 200,
                    maxHeight: { xs: 100, md: 150 },
                    maxWidth: { xs: 100, md: 150 },
                  }}
                  alt="Yannick"
                  src="./../team_user2.png"
                />
                <Button
                  fullWidth variant="contained"
                  size="large"
                  onClick={(e) => {
                    alert('Github !');
                  }}
                >
                  view Github
                </Button>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <h2>Greg</h2>
                <Box
                  component="img"
                  sx={{
                    height: 200,
                    width: 200,
                    maxHeight: { xs: 100, md: 150 },
                    maxWidth: { xs: 100, md: 150 },
                  }}
                  alt="Greg"
                  src="./../team_user3.png"
                />
                <Button
                  fullWidth variant="contained"
                  size="large"
                  onClick={(e) => {
                    alert('Github !');
                  }}
                >
                  view Github
                </Button>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>    
  );
}

export default Team;