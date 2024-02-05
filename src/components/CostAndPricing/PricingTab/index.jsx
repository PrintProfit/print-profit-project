// @ts-check
import { useState } from 'react';
import { PricingTable } from './PricingTable';
import { emptyQuote } from './sample-data';

export function PricingTab() {
  const [quote, setQuote] = useState(emptyQuote);

  return <PricingTable quote={quote} setQuote={setQuote} />;
}
