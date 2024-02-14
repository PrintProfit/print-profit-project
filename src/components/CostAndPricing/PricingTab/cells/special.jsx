// @ts-check

import { Add, Cancel } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import { useCallback, useState } from 'react';
import { BaseDialog } from '../dialogs';
import { PricingTableFab as Fab } from '../stylized';
import { toCostNames, unique } from '../utils';

/**
 * The header component for dynamic (user-editable) costs.
 * @param {import('../prop-types').HeaderProps<unknown>} props
 * @returns {JSX.Element}
 */
export function AddCostHeader({ table }) {
  const [open, setOpen] = useState(false);
  const [costName, setCostName] = useState('');

  const setQuote = table.options.meta?.setQuote;

  // We need to ensure that the cost name is unique.
  const costNameExists = table.options.meta?.costNames.includes(costName);

  const addCost = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        for (const product of draft.products) {
          product.costs.push({
            name: costName,
            value: 0,
          });
        }
      }),
    );
  }, [costName, setQuote]);

  const onClose = useCallback(() => {
    setOpen(false);
    setCostName('');
  }, []);

  const onSubmit = useCallback(() => {
    addCost();
    onClose();
  }, [addCost, onClose]);

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
 * The add product button cell.
 * @param {import('../prop-types').AddProductCellProps} props
 * @returns {JSX.Element}
 */
export function AddProductCell({ table }) {
  const [open, setOpen] = useState(false);
  const [productName, setProductName] = useState('');

  const setQuote = table.options.meta?.setQuote;

  const onClose = useCallback(() => {
    setOpen(false);
    setProductName('');
  }, []);

  const addProduct = useCallback(() => {
    setQuote?.(
      produce((draft) => {
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
  }, [setQuote, productName]);

  const onSubmit = useCallback(() => {
    addProduct();
    onClose();
  }, [addProduct, onClose]);

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
