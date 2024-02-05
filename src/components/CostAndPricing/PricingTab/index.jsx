// @ts-check
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PricingTable } from './PricingTable';

export function PricingTab() {
  /** @type {import('./data-types').Quote} */
  const currentQuote = useSelector((state) => state.quote.current);
  const [quote, setQuote] = useState(currentQuote);

  return <PricingTable quote={quote} setQuote={setQuote} />;
}
