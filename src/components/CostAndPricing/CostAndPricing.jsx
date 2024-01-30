import { Box } from '@mui/material';
import { useState } from 'react';
import { PricingTable } from './PricingTable';
import { quote as sampleQuote } from './sample-data';

export default function CostAndPricing() {
  const [quote, setQuote] = useState(sampleQuote);

  // The sx prop should get removed later when the overall app layout is finished
  return (
    <Box
      sx={{
        padding: '3rem',
      }}
    >
      <PricingTable quote={quote} setQuote={setQuote} />
    </Box>
  );
}
