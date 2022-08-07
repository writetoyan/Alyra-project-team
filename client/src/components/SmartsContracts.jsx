import React, { useState } from 'react';

import {useNavigate} from 'react-router-dom';

// Import SC & Web3
import useEth from "./../contexts/EthContext/useEth";

import { styled } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function createData(contract, description, link, address) {
  return { contract, description, link, address };
}

function DrawLinkAHrefExplorer(props) {
  const url = `https://kovan.etherscan.io/address/${props.addr}`;
  return <a href={url} target='_blank'>{props.addr}</a>
}

function DrawLinkAHref(props) {
  return <a href={props.addr} target='_blank'>{props.addr}</a>
}


function SmartsContracts() {
  const navigate = useNavigate();

//  const { state: { contractAyg, contractNayg, contractNftayg, contractStaking, contractStakingNFT, contractVault, contractLPToken, contractPoolSwap } } = useEth();
/*
  let addressAyg, contractAyg;
  let addressNayg, contractNayg;
  let addressNftayg, contractNftayg;
  let addressStaking, contractStaking;
  let addressStakingNFT, contractStakingNFT;
  let addressVault, contractVault;
  let addressLPToken, contractLPToken;
  let addressPoolSwap, contractPoolSwap;
*/
  const rows = [

    createData('Erc20_AYG.sol', "Création ERC20 avec faucet pour le token $AYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/ERC20_Ayg.sol", "0x000..."),
    createData('Erc20_NAYG.sol', "Création ERC20 avec faucet pour le token $nAYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/ERC20_Nayg.sol", "0x000..."),
    createData('Erc721_NFTAYG.sol', "Création ERC721 pour la collection de 3 modèles NFT", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/ERC721_Nftayg.sol", "0x000..."),
    createData('EthVaultMintAyg.sol', "...", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/EthVaultMintAyg.sol", "0x000..."),
    createData('LPToken.sol', "Contrat de Liquidity provider", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/LPToken.sol", "0x000..."),
//    createData('Pausable.sol', "...", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/Pausable.sol", frfrfrf._address),
    createData('PoolSwapStake.sol', "...", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/PoolSwapStake.sol", "0x000..."),
    createData('Staking.sol', "Contrat de staking pour l'ERC20 $AYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/Staking.sol", "0x000..."),
//    createData('StakingLocked.sol', "Contrat de staking pour l'ERC20 $AYG avec option de locking !", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/StakingLocked.sol", contractStakingLocked._address),
    createData('StakingNFT.sol', "Contrat de staking NFT pour l'ER721 $NFTAYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/StakingNFT.sol", "0x000..."),

/*
    createData('Erc20_AYG.sol', "Création ERC20 avec faucet pour le token $AYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/ERC20_Ayg.sol", contractAyg._address),
    createData('Erc20_NAYG.sol', "Création ERC20 avec faucet pour le token $nAYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/ERC20_Nayg.sol", contractNayg._address),
    createData('Erc721_NFTAYG.sol', "Création ERC721 pour la collection de 3 modèles NFT", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/ERC721_Nftayg.sol", contractNftayg._address),
    createData('EthVaultMintAyg.sol', "...", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/EthVaultMintAyg.sol", contractVault._address),
    createData('LPToken.sol', "Contrat de Liquidity provider", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/LPToken.sol", contractLPToken._address),
//    createData('Pausable.sol', "...", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/Pausable.sol", frfrfrf._address),
    createData('PoolSwapStake.sol', "...", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/PoolSwapStake.sol", contractPoolSwap._address),
    createData('Staking.sol', "Contrat de staking pour l'ERC20 $AYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/Staking.sol", contractStaking._address),
//    createData('StakingLocked.sol', "Contrat de staking pour l'ERC20 $AYG avec option de locking !", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/StakingLocked.sol", contractStakingLocked._address),
    createData('StakingNFT.sol', "Contrat de staking NFT pour l'ER721 $NFTAYG", "https://github.com/bad4token/Projet4_AYG-Labs_DeFi/blob/develop/truffle/contracts/StakingNFT.sol", contractStakingNFT._address),
*/
  ];

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
          Smarts Contracts & Docs
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          ...need more informations ?
        </Typography>
      </Container>
      {/* End Head */}

      <Container maxWidth="xl">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Smart Contract</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>File .SOL</TableCell>
                <TableCell>Address deploy (Testnet Kovan)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.contract}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <strong>{row.contract}</strong>
                  </TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <DrawLinkAHref
                      addr={row.link}
                    />
                  </TableCell>
                  <TableCell>
                    <DrawLinkAHrefExplorer
                      addr={row.address}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Item>
                <h2>Pour plus d'informations vous pouvez consulter le Github du projet !</h2>
                <Button
                  fullWidth variant="contained"
                  size="large"
                  onClick={(e) => {
                    alert('Github !');
                  }}
                >
                  view Github
                </Button>
                <br />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>    
  );
}

export default SmartsContracts;

