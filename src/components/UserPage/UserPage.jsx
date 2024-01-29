import { Box } from '@mui/material';

import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '../Grid/HomeGrid';

function UserPage() {
  const user = useSelector((store) => store.user);

  return (
    <>
      <Box>
        <Grid />
      </Box>
    </>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
