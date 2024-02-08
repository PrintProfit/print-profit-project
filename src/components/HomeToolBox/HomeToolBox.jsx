import { Box } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function HomeToolBox() {
  const history = useHistory();
  const navigateToCostPricingTool = () => {
    history.push('/cost-and-pricing');
  };

  return (
    <>
      <Box>
        <Box border={3} onClick={navigateToCostPricingTool}>
          <h2>Cost & Pricing Tool</h2>
        </Box>
        <Box marginTop={1} border={2} padding={1}>
          <p>
            Keep track of multi-product order labor and material costs and
            calculate profit margins, all in one place.
          </p>
        </Box>
        <h3>Video demo</h3>
      </Box>
    </>
  );
}
