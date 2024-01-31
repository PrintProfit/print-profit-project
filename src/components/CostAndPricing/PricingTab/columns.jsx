// @ts-check

// these are the "columns" that are always present.

/** @type {import("./data-types").ProductColumnDef[]} */
export const staticColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'quantity', header: 'Quantity' },
  { accessorKey: 'selling_price', header: 'Selling Price' },
  { accessorKey: 'total_selling_price', header: 'Total Selling Price' },
  { accessorKey: 'estimated_hours', header: 'Estimated Hours' },
];

const CREDIT_CARD_FEE = 0.03;

/** @type {import("./data-types").ProductColumnDef[]} */
export const calculatedColumns = [
  {
    accessorFn: (row) => row.total_selling_price * CREDIT_CARD_FEE,
    header: 'Credit Card Fee',
  },
];
