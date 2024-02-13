// @ts-check

import { Add, Calculate, Cancel, Clear, Delete } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { BaseDialog } from './dialogs';
import { ConfirmButtonDialog } from './dialogs-wrapped';
import * as fmt from './formats';
import { NumericInput } from './inputs';
import { PricingTableFab as Fab, TableTextField } from './stylized';
import { toCostNames, unique } from './utils';

/**
 * A component that renders editable cells with dynamic costs
 * @param {import('./prop-types').CellProps<unknown>} props
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
      produce((/** @type {import('./data-types').Quote} */ draft) => {
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
 * @param {import('./prop-types').CellProps<unknown>} props
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
      produce((/** @type {import('./data-types').Quote} */ draft) => {
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
 * @param {import('./prop-types').CellProps<unknown>} props
 * @returns {JSX.Element}
 */
export function TotalSellingPriceCell({ getValue, table, row, column }) {
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
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product) {
          product.total_selling_price = Number(value);
        }
      }),
    );
  };

  const clearCustomValue = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
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
 * @param {import('./prop-types').ProductNameCellProps} props
 */
export function ProductNameCell({ getValue, table, row }) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const updateMode = table.options.meta?.updateMode ?? false;

  // We need to use an onBlur to update the quote to avoid an early rerender of the entire table.
  const onBlur = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product) {
          product.name = value;
        }
      }),
    );
  };

  const deleteProduct = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
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
 * @param {import('./prop-types').DollarCellProps} props
 */
export function DollarCell({ getValue }) {
  const value = getValue();
  return fmt.currency(value);
}

/**
 * @param {import('./prop-types').PercentCellProps} props
 */
export function PercentCell({ getValue }) {
  const value = getValue();
  const percent = Number(value);
  return fmt.percent(percent);
}

/**
 * @param {import('./prop-types').AddProductCellProps} props
 */
export function AddProductCell({ table }) {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const onClose = () => {
    setOpen(false);
    setProductName('');
  };

  const addProduct = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        // This is probably the safest way to get a unique list of cost names.
        const costNames = draft.products.flatMap(toCostNames).filter(unique);

        // This *should* also work, but it might not order things correctly,
        // and we need to update the tsconfig/jsconfig to iterate through the
        // values.
        // const costs = new Set(
        //   draft.products.flatMap((p) => p.costs.map((c) => c.name)),
        // );

        draft.products.push({
          name: productName,
          quantity: 0,
          selling_price_per_unit: 0,
          estimated_hours: 0,
          costs: costNames.map((name) => ({ name, value: 0 })),
        });
      }),
    );
  };

  const onSubmit = () => {
    addProduct();
    onClose();
  };

  return (
    <>
      <Tooltip title="Add Product" arrow>
        <Fab
          size="small"
          aria-label="Add Product"
          onClick={() => setOpen(true)}
        >
          <Add />
        </Fab>
      </Tooltip>
      <BaseDialog
        open={open}
        title="Product Name"
        actions={
          <ButtonGroup variant="contained">
            <Button color="secondary" onClick={onClose} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button type="submit" startIcon={<Add />}>
              Add Product
            </Button>
          </ButtonGroup>
        }
        onClose={onClose}
        onSubmit={onSubmit}
      >
        <DialogContentText>
          Please specify the name of the new product.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="productName"
          name="productName"
          label="Product Name"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </BaseDialog>
    </>
  );
}
