import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';

const tiers = [
  {
    title: 'Bronze NFT',
    subheader: 'Choix de départ',
    price: '1000',
    description: [
      '+5% boost',
    ],
    buttonText: 'Mint',
    buttonVariant: 'contained',
  },
  {
    title: 'Silver NFT',
    subheader: 'Bon choix',
    price: '2500',
    description: [
      '+15% boost',
    ],
    buttonText: 'Mint',
    buttonVariant: 'contained',
  },
  {
    title: 'Gold NFT',
    subheader: 'Meilleur choix',
    price: '4000',
    description: [
      '+50% boost',
    ],
    buttonText: 'Mint',
    buttonVariant: 'contained',
  },
];

function PricingContent() {
  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />

      {/* Head */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          NFT
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Améliorez votre rendement grâce aux AYG NFT.
        </Typography>
      </Container>
      {/* End Head */}





      <Container maxWidth="md" component="main">
        <Grid container spacing={2} alignItems="flex-end">
            <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardContent
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 700,
                    width: 500,
                    maxHeight: { xs: 233, md: 350 },
                    maxWidth: { xs: 166, md: 250 },
                  }}
                  alt="Captain Alyra NFT"
                  src="./ayg-nft_captain-alyra_ban.png"
                />
              </CardContent>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    1000
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /$AYG
                  </Typography>
                </Box>
                <ul>
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                    >
                      Avec ce NFT votre rendement<br />de staking AYG sera <br />boosté de <strong>+10%</strong>
                    </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth variant="contained"
                  onClick={(e) => {
                    alert('Coming Soon !');
                  }}
                >
                  Mint
                </Button>
              </CardActions>
            </Card>
          </Grid>
            <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardContent
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 700,
                    width: 500,
                    maxHeight: { xs: 233, md: 350 },
                    maxWidth: { xs: 166, md: 250 },
                  }}
                  alt="Super Alyra NFT"
                  src="./ayg-nft_super-alyra_ban.png"
                />
              </CardContent>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    2500
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /$AYG
                  </Typography>
                </Box>
                <ul>
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                    >
                      Avec ce NFT votre rendement<br />de staking AYG sera <br />boosté de <strong>+30%</strong>
                    </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth variant="contained"
                  onClick={(e) => {
                    alert('Coming Soon !');
                  }}
                >
                  Mint
                </Button>
              </CardActions>
            </Card>
          </Grid>
            <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Card>
              <CardContent
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[200]
                      : theme.palette.grey[700],
                }}
              >
                <Box
                  component="img"
                  sx={{
                    height: 700,
                    width: 500,
                    maxHeight: { xs: 233, md: 350 },
                    maxWidth: { xs: 166, md: 250 },
                  }}
                  alt="Wonder Alyra NFT"
                  src="./ayg-nft_wonder-alyra_ban.png"
                />
              </CardContent>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="text.primary">
                    4000
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    /$AYG
                  </Typography>
                </Box>
                <ul>
                    <Typography
                      component="li"
                      variant="subtitle1"
                      align="center"
                    >
                      Avec ce NFT votre rendement<br />de staking AYG sera <br />boosté de <strong>+50%</strong>
                    </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth variant="contained"
                  onClick={(e) => {
                    alert('Coming Soon !');
                  }}
                >
                  Mint
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

    </React.Fragment>
  );
}

export default function Pricing() {
  return <PricingContent />;
}