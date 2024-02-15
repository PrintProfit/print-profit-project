// @ts-check

import { Delete } from '@mui/icons-material';
import { produce } from 'immer';
import { useCallback, useState } from 'react';
import { ConfirmButtonDialog } from '../dialogs-wrapped';
import { TableTextField } from '../stylized';

/**
 * The header component for dynamic (user-editable) costs.
 * @param {import('../prop-types').HeaderProps<unknown>} props
 * @returns {JSX.Element}
 */
export function DynamicCostHeader({ column, table }) {
  // We utilize the original cost name for products to find what to update.
  const initialCostName = column.columnDef.meta?.costName;
  if (initialCostName === undefined) {
    // If you're seeing this error, something is very wrong.
    throw new Error('Malformed columnDef: costName is undefined');
  }
  const [costName, setCostName] = useState(initialCostName);

  // If the table is in update mode, costs can't be deleted.
  // It's probably better to check if the cost has an ID instead, though that's
  // also a lot more complex.
  const updateMode = table.options.meta?.updateMode ?? false;
  const setQuote = table.options.meta?.setQuote;

  // we have to use onBlur to update everything within the tanstack tables
  // context to avoid an early rerender of the table while the user is typing.
  const onBlur = useCallback(() => {
    setQuote?.(
      produce((draft) => {
        // Loop through the products and update the cost names
        for (const product of draft.products) {
          const cost = product.costs.find((c) => c.name === initialCostName);
          if (cost) {
            cost.name = costName;
          }
        }
      }),
    );
  }, [costName, initialCostName, setQuote]);

  const deleteCost = useCallback(() => {
    setQuote?.(
      produce((draft) => {
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
  }, [costName, setQuote]);

  return (
    <TableTextField
      size="small"
      fullWidth
      value={costName}
      onChange={(e) => setCostName(e.target.value)}
      onBlur={onBlur}
      InputProps={{
        // End adornment with a delete button for the cost
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
