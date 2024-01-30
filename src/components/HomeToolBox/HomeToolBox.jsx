import { Box } from '@mui/material';
import React from 'react';

export default function HomeToolBox() {
  return (
    <>
      <Box>
        <Box border={3}>
          <h2>Nested Box</h2>
        </Box>
        <h2>Tutorial</h2>
      </Box>
    </>
  );
}
