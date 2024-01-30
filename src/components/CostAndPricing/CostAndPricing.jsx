import { PricingTable } from './PricingTable';
import { quote as sampleQuote } from './sample-data';

export default function CostAndPricing() {
  return (
    <div>
      <PricingTable quote={sampleQuote} />
    </div>
  );
}
