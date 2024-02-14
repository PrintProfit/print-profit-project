// @ts-check

import { Calculate, Clear, Delete } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmButtonDialog } from '../dialogs-wrapped';
import { NumericInput } from '../inputs';
import { TableTextField } from '../stylized';
import { NumberFormatter } from './internal';

/**
 * A component that renders editable cells with dynamic costs
 * @param {import('../prop-types').CellProps<unknown>} props
 * @returns {React.ReactNode}
 */
export function DynamicCostCell({ getValue, table, row, column }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const costName = column.columnDef.meta?.costName;
  const setQuote = table.options.meta?.setQuote;

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = useCallback(() => {
    if (costName === undefined) {
      throw new Error('Malformed columnDef: costName is undefined');
    }
    setQuote?.(
      produce((draft) => {
        const productIndex = row.index;
        const product = draft.products[productIndex];
        if (product === undefined) {
          // This is basically just a type guard so VSCode knows product is
          // defined. It should be completely impossible, since the cell would
          // never be rendered if the product didn't exist.
          throw new Error('Inpossible state reached: product is undefined');
        }
        const cost = product.costs.find((c) => c.name === costName);
        if (cost) {
          cost.value = Number(value);
        } else {
          // The quote is malformed, but fixable.
          product.costs.push({
            name: costName,
            value: Number(value),
          });
        }
      }),
    );
  }, [costName, setQuote, row.index, value]);

  // This useEffect comes from tanstack table examples. I'm not 100% sure it's actually needed.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  /** @satisfies {import('react-number-format').NumericFormatProps} */
  const inputProps = {
    allowNegative: false,
    decimalScale: 2,
    fixedDecimalScale: true,
  };

  return (
    <TableTextField
      size="small"
      inputMode="decimal"
      fullWidth
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={onBlur}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        inputComponent: /** @type {any} */ (NumericInput),
        inputProps,
      }}
    />
  );
}

/**
 * A component for the quantity, selling price, total selling price, and estimated hours cells.
 * @param {import('../prop-types').CellProps<unknown>} props
 * @returns {React.ReactNode}
 */
export function ConsistentNumericCell({ getValue, table, row, column }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const meta = column.columnDef.meta ?? {};

  const { adornment, inputMode, productKey, inputProps } = meta;

  const setQuote = table.options.meta?.setQuote;

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        const productIndex = row.index;
        const product = draft.products[productIndex];
        if (product && productKey) {
          product[productKey] = Number(value);
        }
      }),
    );
  }, [productKey, row.index, setQuote, value]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TableTextField
      size="small"
      fullWidth
      inputMode={inputMode}
      value={value}
      // We don't have access to valueAsNumber, but we still want the be
      // a number.
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={onBlur}
      InputProps={{
        startAdornment: adornment && (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ),
        // These props let us use a custom input component, so we can have an
        // an improved number input.
        inputComponent: /** @type {any} */ (NumericInput),
        inputProps: /** @type {any} */ (inputProps),
      }}
    />
  );
}

/**
 * A component for the total selling price cell
 * @param {import('../prop-types').CellProps<unknown>} props
 * @returns {React.ReactNode}
 */
export function TotalSellingPriceCell({ getValue, table, row }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const isCustom = row.original.total_selling_price !== undefined;

  const setQuote = table.options.meta?.setQuote;

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        const index = row.index;
        const product = draft.products[index];
        if (product) {
          product.total_selling_price = Number(value);
        }
      }),
    );
  }, [row.index, setQuote, value]);

  const clearCustomValue = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        const index = row.index;
        const product = draft.products[index];
        if (product) {
          product.total_selling_price = undefined;
        }
      }),
    );
  }, [row.index, setQuote]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  /** @satisfies {import('react-number-format').NumericFormatProps} */
  const inputProps = {
    allowNegative: false,
    decimalScale: 2,
    fixedDecimalScale: true,
  };

  return (
    <TableTextField
      size="small"
      fullWidth
      inputMode="decimal"
      value={value}
      // We don't have access to valueAsNumber, but we still want the be
      // a number.
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={onBlur}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
        // The end adornment here is an icon to indicate whether the value has
        // been modified or not. If it has, then clicking the icon will reset
        // it to the calculated value.
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              title={
                isCustom
                  ? 'Remove Custom Value'
                  : 'Automatically generated value'
              }
              arrow
            >
              {isCustom ? (
                <IconButton
                  aria-label="Remove Custom Value"
                  size="small"
                  onClick={clearCustomValue}
                  edge="end"
                >
                  <Clear fontSize="small" />
                </IconButton>
              ) : (
                <Calculate fontSize="small" />
              )}
            </Tooltip>
          </InputAdornment>
        ),
        inputComponent: /** @type {any} */ (NumericInput),
        inputProps: inputProps,
      }}
    />
  );
}

/**
 * A cell for product names
 * @param {import('../prop-types').CellProps<string>} props
 * @returns {React.ReactNode}
 */
export function ProductNameCell({ getValue, table, row }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const updateMode = table.options.meta?.updateMode ?? false;
  const setQuote = table.options.meta?.setQuote;

  // We need to use an onBlur to update the quote to avoid an early rerender of the entire table.
  const onBlur = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        const index = row.index;
        const product = draft.products[index];
        if (product) {
          product.name = value;
        }
      }),
    );
  }, [row.index, setQuote, value]);

  const deleteProduct = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        draft.products.splice(row.index, 1);
      }),
    );
  }, [row.index, setQuote]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TextField
      size="small"
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      InputProps={{
        // The end adornment is a button to delete the product.
        // The component it's using abstracts away dialog management.
        endAdornment: updateMode || (
          <ConfirmButtonDialog
            buttonType="icon"
            buttonText="Remove Product"
            IconProps={{
              'aria-label': 'Remove Product',
              size: 'small',
              disabled: updateMode,
              edge: 'end',
              children: <Delete fontSize="inherit" />,
            }}
            TooltipProps={{ title: 'Remove Product', arrow: true }}
            onConfirm={deleteProduct}
            title="Remove Product"
            text="Are you sure you want to remove this product?"
            confirmText="Remove"
          />
        ),
      }}
    />
  );
}

/**
 * Cell for non-editable values of money (ex. derived amounts)
 * @param {import('../prop-types').CellProps<number>} props
 * @returns {React.ReactNode}
 */
export function DollarCell({ getValue }) {
  const value = getValue();
  return value ? <NumberFormatter value={value} variant="currency" /> : null;
}

/**
 * Cell for non-editable precentage values (ex. derived amounts)
 * @param {import('../prop-types').CellProps<number>} props
 * @returns {React.ReactNode}
 */
export function PercentCell({ getValue }) {
  const value = getValue();
  return value ? <NumberFormatter value={value} variant="percent" /> : null;
}
