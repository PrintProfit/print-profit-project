// @ts-check
import { Stack } from '@mui/material';
import { useState } from 'react';
import { PricingTable } from './PricingTable';
import { TotalsTable } from './TotalsTable';
import { quote as sampleQuote } from './sample-data';

export function PricingTab() {
  const [quote, setQuote] = useState(sampleQuote);

  return (
    <Stack direction="row" spacing={2}>
      <PricingTable quote={quote} setQuote={setQuote} />
      <TotalsTable quote={quote} />
    </Stack>
  );
}
