// @ts-check
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PricingTable } from './PricingTable';
import { repairQuote } from './data-repair';

export function PricingTab() {
  /** @type {import('./data-types').Quote} */
  const currentQuote = useSelector((state) => repairQuote(state.quote.current));
  const [quote, setQuote] = useState(currentQuote);

  return <PricingTable quote={quote} setQuote={setQuote} />;
}
