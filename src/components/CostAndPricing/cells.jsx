// @ts-check

import { produce } from 'immer';
import { useEffect, useState } from 'react';

/**
 * A component that renders editable cells with dynamic costs
 * @template {(string|number)} T
 * @param {Object} props
 * @param {import("@tanstack/react-table").Getter<T>} props.getValue the getValue function from tanstack tables
 * @param {React.Dispatch<React.SetStateAction<Quote>>} props.setQuote the setter for the entire quote
 * @param {number} props.productIndex the index of the product in the quote.
 * @param {number} props.costIndex the index of the cost in the product.
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
      produce((/** @type {Quote} */ draft) => {
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
 * @param {Object} props
 * @param {import("@tanstack/react-table").Getter<T>} props.getValue the getValue function from tanstack tables
 * @param {React.Dispatch<React.SetStateAction<Quote>>} props.setQuote the setter for the entire quote
 * @param {number} props.productIndex the index of the product in the quote.
 * @param {("quantity"|"selling_price"|"total_selling_price"|"estimated_hours")} props.accessorKey the key for the property in the product being modified.
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
      produce((/** @type {Quote} */ draft) => {
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
