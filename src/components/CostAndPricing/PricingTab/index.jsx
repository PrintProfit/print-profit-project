// @ts-check
import { produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PricingTable } from './PricingTable';
import { repairQuote } from './data-repair';
import { toCostNames, unique } from './utils';

export function PricingTab() {
  /** @type {import('./data-types').Quote} */
  const currentQuote = useSelector((/** @type {any} */ state) =>
    repairQuote(state.quote.current),
  );
  const [quote, setQuote] = useState(currentQuote);

  const demoInput = useCallback(() => {
    setQuote(
      produce((draft) => {
        const costNames = draft.products.flatMap(toCostNames).filter(unique);
        if (draft.products[3]) {
          const product = draft.products[3];
          product.quantity = 100;
          product.estimated_hours = 10;
          product.selling_price_per_unit = 40;
          product.total_selling_price = 3950;
          product.costs = costNames.map((name) => ({
            name,
            value: Math.round(Math.random() * 1000),
          }));
        }
      }),
    );
  }, []);

  useEffect(() => {
    /**
     * @param {KeyboardEvent} e
     */
    const onKeyDown = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        demoInput();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [demoInput]);

  return <PricingTable quote={quote} setQuote={setQuote} />;
}
