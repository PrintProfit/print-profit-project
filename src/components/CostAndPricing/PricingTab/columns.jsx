// @ts-check

import * as calc from './calculations';

// these are the "columns" that are always present.

/** @type {import("./data-types").ProductColumnDef[]} */
export const staticColumns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'quantity', header: 'Quantity' },
  { accessorKey: 'selling_price', header: 'Selling Price' },
  { accessorKey: 'total_selling_price', header: 'Total Selling Price' },
  { accessorKey: 'estimated_hours', header: 'Estimated Hours' },
];

/** @type {import("./data-types").ProductColumnDef[]} */
export const calculatedCosts = [
  { accessorFn: calc.creditCardFee, header: 'Credit Card Fee' },
  { accessorFn: calc.totalVariableCosts, header: 'Total Variable Costs' },
];

/** @type {import("./data-types").ProductColumnDef[]} */
export const contributionColumns = [
  { accessorFn: calc.contribution, header: 'Contribution $' },
  // This one *really* needs some formatting
  { accessorFn: calc.contributionMargin, header: 'Contribution %' },
  // Also, this one needs numbers truncated a bit
  { accessorFn: calc.contributionPerHour, header: 'Contribution / Hr' },
];
