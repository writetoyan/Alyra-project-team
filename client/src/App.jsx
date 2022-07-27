// Import NPM
import React from 'react';

// Import ASSETS
import './App.css';

// Import UI
import CssBaseline from '@mui/material/CssBaseline';

import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Footer from "./components/Footer";

function App() {

    return (
      <div className="App">

        <CssBaseline />

        <ResponsiveAppBar></ResponsiveAppBar>

        <Footer> </Footer>
      </div>
    );


};

export default App;