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
import Button from '@mui/material/Button';
import IconApprove from '@mui/icons-material/AssignmentTurnedIn';
import TextField from '@mui/material/TextField';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import IconButton from '@mui/material/IconButton';
import StakeIcon from '@mui/icons-material/ArrowDropDownCircle';

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

function StakeManage() {

  const [alignment, setAlignment] = React.useState('stake');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };  
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

export default StakeManage;
