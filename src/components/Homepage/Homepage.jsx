import { Box } from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '../Grid/HomeGrid';

function Homepage() {
  const user = useSelector((store) => store.user.currentUser);

  return (
    <>
      <Box>
        <Grid />
      </Box>
    </>
  );
}

// this allows us to use <App /> in index.js
export default Homepage;
