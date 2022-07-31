import React, { useEffect, useState } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { ConnectButton } from '@rainbow-me/rainbowkit';


import Logo from "./../assets/logoH.png";

import Home from "./../components/Home";
import Dashboard from "./../components/Dashboard";
import Token from "./../components/Token";
import Uniswap from './../components/Uniswap';
import Stake from "./../components/Stake";
import StakeManage from "./../components/StakeManage";
import Pool from "./../components/Pool";
import PoolAdd from "./../components/PoolAdd";
import PoolManage from "./../components/PoolManage";
import NFT from "./../components/NFT";
import Chip from '@mui/material/Chip';




const pages = ['Dashboard', 'Token', 'Swap', 'Stake', 'Pool', 'NFT'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = (props) => {

  const navigate = useNavigate();


  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };




  return (
    <React.Fragment>

      <AppBar position="static" color="primary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <img src={Logo} alt="AYG Labs !" height='60px' />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <img src={Logo} alt="AYG Labs !" height='60px' />
            {pages.map((page) => (
              <Button
                key={page}
                onClick={(e) => {
                  console.log(e.currentTarget.dataset.buttonKey);
                  navigate('/'+e.currentTarget.dataset.buttonKey);

                }}
                data-button-key={page}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <LogStatut addrUser={props.addrUser} />

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Account" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
         <ConnectButton />
        </Toolbar>
      </Container>
    </AppBar>
    </React.Fragment>
  );
};


function LogStatut(props) {

  const addrUser = props.addrUser;

  console.log("addrUser = "+addrUser)

  if(props.addrUser!=="0x0000000000000000000000000000000000000000"){
      return (
        <Chip label={props.addrUser} />
      );
  } else {
      return (
          <div className="LogWallet">
                  Vous n'êtes pas connecté<br /> 
                  <Button variant="primary">
                      Connecter un wallet
                  </Button>
          </div>
      );
  }

}

export default ResponsiveAppBar;
