// @ts-check
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PricingTable } from './PricingTable';
import { repairQuote } from './data-repair';

/**
 * The whole pricing tab.
 *
 * It has the pricing table, but it's also a good place for anything like
 * shortcuts to be put.
 *
 * @returns {JSX.Element}
 */
export function PricingTab() {
  /**
   * The initial quote to load into the pricing table.
   *
   * The state ends up detached from the redux store, as once the quote is in
   * the pricing table, we need near-constant access to it to perform any edits
   * to it.
   *
   * @type {import('./data-types').DamaagedQuote}
   */
  const currentQuote = useSelector(
    (/** @type {any} */ state) => state.quote.current,
  );

  /** Internal state for the quote */
  const [quote, setQuote] = useState(repairQuote(currentQuote));

  return <PricingTable quote={quote} setQuote={setQuote} />;
}
