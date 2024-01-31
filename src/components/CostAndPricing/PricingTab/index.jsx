// @ts-check
import { useState } from 'react';
import { PricingTable } from './PricingTable';
import { quote as sampleQuote } from './sample-data';

export function PricingTab() {
  const [quote, setQuote] = useState(sampleQuote);

  return <PricingTable quote={quote} setQuote={setQuote} />;
}
