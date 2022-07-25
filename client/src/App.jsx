import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';

// Import COMPONENTS
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Body from "./components/Body";
import Footer from "./components/Footer";

function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

const App = () => {

//  const [BodyPage, setBodyPage] = React.useState(null);
//  setBodyPage('Footer');

  return (
    <React.Fragment>
      <CssBaseline />

      <ResponsiveAppBar></ResponsiveAppBar>

      <Body></Body>

      <Footer> </Footer>
      <Link uri={"https://soliditylang.org"} text={"Link"} />
    </React.Fragment>
  );
};
export default App;
