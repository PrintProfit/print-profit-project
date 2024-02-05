// @ts-check
import { PricingTable } from './PricingTable';

/**
 * @param {import('./prop-types').PricingTabProps} props
 */
export function PricingTab({ quote, setQuote }) {
  return <PricingTable quote={quote} setQuote={setQuote} />;
}
