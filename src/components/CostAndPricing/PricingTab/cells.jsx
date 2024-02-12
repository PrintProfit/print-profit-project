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
 * @param {import('./prop-types').HeaderProps<unknown>} props
 */
export function DynamicCostHeader({ column, table }) {
  const initialCostName = column.columnDef.meta?.costName;
  if (initialCostName === undefined) {
    throw new Error('Malformed columnDef: costName is undefined');
  }
  const [costName, setCostName] = useState(initialCostName);

  const updateMode = table.options.meta?.updateMode ?? false;

  const onBlur = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        for (const product of draft.products) {
          const cost = product.costs.find((c) => c.name === initialCostName);
          if (cost) {
            cost.name = costName;
          }
        }
      }),
    );
  };

  const deleteCost = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        for (const product of draft.products) {
          const index = product.costs.findIndex((c) => c.name === costName);
          if (index !== -1) {
            // If the cost doesn't exist on a product, then the product is
            // malformed, but it doesn't really matter here.
            product.costs.splice(index, 1);
          }
        }
      }),
    );
  };

  return (
    <TableTextField
      size="small"
      fullWidth
      value={costName}
      onChange={(e) => setCostName(e.target.value)}
      onBlur={onBlur}
      InputProps={{
        endAdornment: updateMode || (
          <ConfirmButtonDialog
            buttonType="icon"
            buttonText="Remove Cost"
            IconProps={{
              'aria-label': 'Remove Cost',
              size: 'small',
              disabled: updateMode,
              edge: 'end',
              children: <Delete fontSize="inherit" />,
            }}
            TooltipProps={{ title: 'Remove Cost', arrow: true }}
            onConfirm={deleteCost}
            title="Remove Cost"
            text="Are you sure you want to remove this cost?"
            confirmText="Remove"
            // snackbars can't work here
          />
        ),
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
          <Tooltip title="Remove Product" arrow>
            <IconButton
              size="small"
              aria-label="Remove Product"
              disabled={updateMode}
              onClick={deleteProduct}
              edge="end"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
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
 * @param {import('./prop-types').AddCostHeaderProps} props
 */
export function AddCostHeader({ table }) {
  const [open, setOpen] = useState(false);
  const [costName, setCostName] = useState('');

  const addCost = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        for (const product of draft.products) {
          product.costs.push({
            name: costName,
            value: 0,
          });
        }
      }),
    );
  };

  const onClose = () => {
    setOpen(false);
    setCostName('');
  };

  const onSubmit = () => {
    addCost();
    onClose();
  };

  // We need to ensure that the cost name is unique.
  const costNameExists = table.options.meta?.costNames.includes(costName);

  return (
    <>
      <Tooltip title="Add Cost" arrow>
        <Fab
          variant="extended"
          size="small"
          aria-label="Add Cost"
          onClick={() => setOpen(true)}
        >
          <Add sx={{ mr: 1 }} />
          Add Cost
        </Fab>
      </Tooltip>
      <BaseDialog
        open={open}
        onClose={onClose}
        onSubmit={onSubmit}
        title="Cost Name"
        actions={
          <ButtonGroup variant="contained">
            <Button color="secondary" onClick={onClose} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button type="submit" startIcon={<Add />}>
              Add Cost
            </Button>
          </ButtonGroup>
        }
      >
        <DialogContentText>
          Please specify the name of the new cost.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="costName"
          name="costName"
          label="Cost Name"
          fullWidth
          value={costName}
          onChange={(e) => setCostName(e.target.value)}
          error={costNameExists}
          helperText={costNameExists && 'Cost name already exists'}
        />
      </BaseDialog>
    </>
  );
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
