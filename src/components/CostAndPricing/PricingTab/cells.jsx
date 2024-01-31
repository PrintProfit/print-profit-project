// @ts-check

import { produce } from 'immer';
import { useEffect, useState } from 'react';

/**
 * A component that renders editable cells with dynamic costs
 * @template {(string|number)} T
 * @param {import('./prop-types').DynamicCostCellProps<T>} props
 * @returns {JSX.Element}
 */
export function DynamicCostCell({
  getValue,
  setQuote,
  productIndex,
  costIndex,
}) {
  /** @type {T} */
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = () => {
    setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        draft.products[productIndex].costs[costIndex].value = Number(value);
      }),
    );
  };

  // This useEffect comes from tanstack table examples. I'm not 100% sure it's actually needed.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      // @ts-ignore
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}

/**
 * A component for the quantity, selling price, total selling price, and estimated hours cells.
 * @template {(string|number)} T
 * @param {import('./prop-types').ConsistentNumericCellProps<T>} props
 * @returns {JSX.Element}
 */
export function ConsistentNumericCell({
  getValue,
  setQuote,
  productIndex,
  accessorKey,
}) {
  /** @type {T} */
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */ const onBlur = () => {
    setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        draft.products[productIndex][accessorKey] = Number(value);
      }),
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      // @ts-ignore
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}
