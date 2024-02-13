// @ts-check

import { Add, Cancel, Delete } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import { useState } from 'react';
import { BaseDialog } from './dialogs';
import { ConfirmButtonDialog } from './dialogs-wrapped';
import { PricingTableFab as Fab, TableTextField } from './stylized';

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
