import { useState } from 'react';
import { PricingTable } from './PricingTab/PricingTable';
import { quote as sampleQuote } from './PricingTab/sample-data';

export default function CostAndPricing() {
  const [quote, setQuote] = useState(sampleQuote);

  return (
    <div>
      <PricingTable quote={quote} setQuote={setQuote} />
    </div>
  );
}
