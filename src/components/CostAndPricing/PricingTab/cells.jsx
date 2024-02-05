// @ts-check

import { Add } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import { useEffect, useState } from 'react';
import { unique } from './utils';

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
    <Input
      size="small"
      startAdornment={<InputAdornment position="start">$</InputAdornment>}
      inputMode="decimal"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
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

  return (
    <Input
      size="small"
      value={costName}
      onChange={(e) => setCostName(e.target.value)}
      onBlur={onBlur}
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
    <Input
      size="small"
      startAdornment={
        adornment && (
          <InputAdornment position="start">{adornment}</InputAdornment>
        )
      }
      inputMode={inputMode}
      value={value}
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
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        const product = draft.products[row.index];
        if (product) {
          product.name = value;
        }
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

  const closeDialog = () => {
    setOpen(false);
    setCostName('');
  };

  /**
   * @param {import('react').FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    addCost();
    closeDialog();
  };

  return (
    <>
      <Tooltip title="Add Cost" arrow>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Add Cost"
          size="small"
        >
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Cost Name</DialogTitle>
        <DialogContent>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button type="submit">Add Cost</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * @param {import('./prop-types').AddProductCellProps} props
 */
export function AddProductCell({ table }) {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const closeDialog = () => {
    setOpen(false);
    setProductName('');
  };

  const addProduct = () => {
    table.options.meta?.setQuote(
      produce((/** @type {import('./data-types').Quote} */ draft) => {
        // This is probably the safest way to get a unique list of cost names.
        const costNames = draft.products
          .flatMap((p) => p.costs.map((c) => c.name))
          .filter(unique);

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

  /**
   * @param {import('react').FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct();
    closeDialog();
  };

  return (
    <>
      <Tooltip title="Add Product" arrow>
        <IconButton
          onClick={() => setOpen(true)}
          aria-label="Add Product"
          size="small"
        >
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Product Name</DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button type="submit">Add Product</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
