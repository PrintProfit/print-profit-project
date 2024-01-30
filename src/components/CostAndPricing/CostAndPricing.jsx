import { useState } from 'react';
import { PricingTable } from './PricingTable';
import { quote as sampleQuote } from './sample-data';

export default function CostAndPricing() {
  const [quote, setQuote] = useState(sampleQuote);

  return (
    <div>
      <PricingTable quote={quote} />
    </div>
  );
}
