// @ts-check

import { Add } from '@mui/icons-material';
import { IconButton, Input } from '@mui/material';
import { produce } from 'immer';
import { useEffect, useState } from 'react';

/**
 * A component that renders editable cells with dynamic costs
 * @template {(string|number)} T
 * @param {import('./prop-types').DynamicCostCellProps<T>} props
 * @returns {JSX.Element}
 */
export function DynamicCostCell({ getValue, costIndex, table, row }) {
  /** @type {T} */
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const productIndex = row.index;

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = () => {
    table.options.meta?.setQuote(
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
    <Input
      size="small"
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
export function ConsistentNumericCell({ getValue, table, row, column }) {
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
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        draft.products[row.index][column.id] = Number(value);
      }),
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      size="small"
      value={value}
      // @ts-ignore
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}

/**
 * @param {import('./prop-types').ProductNameCellProps} props
 */
export function ProductNameCell({ getValue, table, row }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // We need to use an onBlur to update the quote to avoid an early rerender of the entire table.
  const onBlur = () => {
    table.options.meta.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        draft.products[row.index].name = value;
      }),
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      size="small"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}

/**
 * Cell for non-editable values of money (ex. derived amounts)
 * @param {import('./prop-types').DollarCellProps} props
 */
export function DollarCell({ getValue }) {
  const value = getValue();
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  });
}

/**
 * @param {import('./prop-types').PercentCellProps} props
 */
export function PercentCell({ getValue }) {
  const value = getValue();
  const percent = Number(value);
  return percent.toLocaleString(undefined, {
    style: 'percent',
  });
}

/**
 * @param {import('./prop-types').AddCostHeaderProps} props
 */
export function AddCostHeader({ table }) {
  const addCost = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        for (const product of draft.products) {
          product.costs.push({
            name: 'New Cost',
            value: 0,
          });
        }
      }),
    );
  };

  return (
    <IconButton onClick={addCost} aria-label="add">
      <Add />
    </IconButton>
  );
}
