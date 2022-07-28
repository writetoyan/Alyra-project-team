import * as React from 'react';


import Container from '@mui/material/Container';

import Typography from '@mui/material/Typography';



function PoolAdd() {

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
          POOL
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Ajouter une nouvelle POOL
        </Typography>
      </Container>
      {/* End Head */}
    </React.Fragment>    
  );
}

export default PoolAdd;
