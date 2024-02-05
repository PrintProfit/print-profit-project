import { Box } from '@mui/material';
import React from 'react';

export default function HomeToolBox() {
  return (
    <>
      <Box>
        <Box border={3}>
          <h2>Cost & Pricing Tool</h2>
        </Box>
        <Box marginTop={1} border={2}>
          <p>
            This tool is a multi purpose tool to help printers to up their game.
            Print shop gives customer a quote for the order and feels confident
            knowing the true costs and how much profit there is.
          </p>
        </Box>
        <h3>Tutorial</h3>
      </Box>
    </>
  );
}
