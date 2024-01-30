// @ts-check

import { produce } from 'immer';
import { useEffect, useState } from 'react';

/**
 * A component that renders editable cells with dynamic costs
 * @template {(string|number)} T
 * @param {Object} props
 * @param {import("@tanstack/react-table").Getter<T>} props.getValue
 * @param {import("react").Dispatch<import("react").SetStateAction<Quote>>} props.setQuote
 * @param {number} props.productIndex
 * @param {number} props.costIndex
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

  // onBlur is called when the input loses focus.
  const onBlur = () => {
    setQuote(
      produce((/** @type {Quote} */ draft) => {
        draft.products[productIndex].costs[costIndex].value = Number(value);
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

/**
 * A component for the quantity, selling price, total selling price, and estimated hours cells.
 * @template {(string|number)} T
 * @param {Object} props
 * @param {import("@tanstack/react-table").Getter<T>} props.getValue
 * @param {import("react").Dispatch<import("react").SetStateAction<Quote>>} props.setQuote
 * @param {number} props.productIndex
 * @param {("quantity"|"selling_price"|"total_selling_price"|"estimated_hours")} props.accessorKey
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

  // onBlur is called when the input loses focus.
  const onBlur = () => {
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
