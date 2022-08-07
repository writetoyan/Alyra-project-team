import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'AYG-Labs © '}
      <Link color="inherit" href="https://www.alyra.fr/" target="_blank">
        Promo Ropsten
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const footers = [
  {
    title: 'DApp',
    links: [
      {
        title: 'Smarts Contracts & Docs',
        url: '/SmartsContracts',
      },
      {
        title: 'GitHub Readme',
        url: 'https://github.com/bad4token/Projet4_AYG-Labs_DeFi',
      },
    ],
  },
  {
    title: 'AYG-Labs',
    links: [
      {
        title: 'About',
        url: '/About',
      },
      {
        title: 'Team',
        url: '/Team',
      },
    ],
  },
];


function Footer() {
  return (
    <footer>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
          {footers.map((footer) => (
            <Grid item xs={6} sm={3} key={footer.title}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {footer.title}
              </Typography>
                {footer.links.map((link) => (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        typography: 'body1',
                        '& > :not(style) + :not(style)': {
                          ml: 2,
                        },
                      }}
//                      onClick={preventDefault}
                    >
                    <Link href={link.url} variant="subtitle1" color="text.secondary">
                      {link.title}
                    </Link>
                  </Box>
                ))}
            </Grid>
          ))}
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
      {/* End footer */}
    </footer >
  );
}

export default Footer;
