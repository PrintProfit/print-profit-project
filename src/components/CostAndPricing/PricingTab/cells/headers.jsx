// @ts-check

import { Delete } from '@mui/icons-material';
import { produce } from 'immer';
import { useState } from 'react';
import { ConfirmButtonDialog } from '../dialogs-wrapped';
import { TableTextField } from '../stylized';

/**
 * @param {import('../prop-types').HeaderProps<unknown>} props
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
      produce((/** @type {import('../data-types').Quote} */ draft) => {
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
      produce((/** @type {import('../data-types').Quote} */ draft) => {
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
