// @ts-check

import { Calculate, Clear, Delete } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { ConfirmButtonDialog } from '../dialogs-wrapped';
import * as fmt from '../formats';
import { NumericInput } from '../inputs';
import { TableTextField } from '../stylized';

/**
 * A component that renders editable cells with dynamic costs
 * @param {import('../prop-types').CellProps<unknown>} props
 * @returns {JSX.Element}
 */
export function DynamicCostCell({ getValue, table, row, column }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const costName = column.columnDef.meta?.costName;

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = () => {
    if (costName === undefined) {
      throw new Error('Malformed columnDef: costName is undefined');
    }
    table.options.meta?.setQuote(
      produce((/** @type {import('../data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product === undefined) {
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
  };

  // This useEffect comes from tanstack table examples. I'm not 100% sure it's actually needed.
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

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
      }}
    />
  );
}

/**
 * A component for the quantity, selling price, total selling price, and estimated hours cells.
 * @param {import('../prop-types').CellProps<unknown>} props
 * @returns {JSX.Element}
 */
export function ConsistentNumericCell({ getValue, table, row, column }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const { adornment, inputMode, productKey } = column.columnDef.meta ?? {};

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('../data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product && productKey) {
          product[productKey] = Number(value);
        }
      }),
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TableTextField
      size="small"
      fullWidth
      inputMode={inputMode}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={onBlur}
      InputProps={{
        startAdornment: adornment && (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ),
        inputComponent: /** @type {any} */ (NumericInput),
      }}
    />
  );
}

/**
 * A component for the total selling price cell
 * @param {import('../prop-types').CellProps<unknown>} props
 * @returns {JSX.Element}
 */
export function TotalSellingPriceCell({ getValue, table, row }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const isCustom = row.original.total_selling_price !== undefined;

  /**
   * onBlur is called when the input loses focus.
   * It updates the quote with the new value, using an immer produce function
   * to simplify state updates.
   * @see {@link https://immerjs.github.io/immer/example-setstate#usestate--immer useState + Immer}
   */
  const onBlur = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('../data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product) {
          product.total_selling_price = Number(value);
        }
      }),
    );
  };

  const clearCustomValue = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('../data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product) {
          product.total_selling_price = undefined;
        }
      }),
    );
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TableTextField
      size="small"
      fullWidth
      inputMode="decimal"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      onBlur={onBlur}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
      }}
    />
  );
}

/**
 * @param {import('../prop-types').ProductNameCellProps} props
 */
export function ProductNameCell({ getValue, table, row }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const updateMode = table.options.meta?.updateMode ?? false;

  // We need to use an onBlur to update the quote to avoid an early rerender of the entire table.
  const onBlur = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('../data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product) {
          product.name = value;
        }
      }),
    );
  };

  const deleteProduct = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('../data-types').Quote} */ draft) => {
        draft.products.splice(row.index, 1);
      }),
    );
  };

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
 * @param {import('../prop-types').DollarCellProps} props
 */
export function DollarCell({ getValue }) {
  const value = getValue();
  return fmt.currency(value);
}

/**
 * @param {import('../prop-types').PercentCellProps} props
 */
export function PercentCell({ getValue }) {
  const value = getValue();
  const percent = Number(value);
  return fmt.percent(percent);
}
