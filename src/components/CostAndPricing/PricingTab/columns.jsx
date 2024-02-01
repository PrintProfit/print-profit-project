// @ts-check

import * as calc from './calculations';
import { DollarCell, PercentCell } from './cells';

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
  {
    id: 'creditCardFee',
    accessorFn: calc.creditCardFee,
    header: 'Credit Card Fee',
    cell: DollarCell,
    footer: ({ table }) =>
      table
        .getCoreRowModel()
        .rows.reduce((sum, row) => sum + row.getValue('creditCardFee'), 0),
  },
  {
    id: 'totalVariableCosts',
    accessorFn: calc.totalVariableCosts,
    header: 'Total Variable Costs',
    cell: DollarCell,
    footer: ({ table }) =>
      table
        .getCoreRowModel()
        .rows.reduce((sum, row) => sum + row.getValue('totalVariableCosts'), 0),
  },
];

/** @type {import("./data-types").ProductColumnDef[]} */
export const contributionColumns = [
  {
    id: 'contributionDollars',
    accessorFn: calc.contribution,
    header: 'Contribution $',
    cell: DollarCell,
    // This happens to work, but it's not how the spreadsheet calculates it.
    footer: ({ table }) =>
      table
        .getCoreRowModel()
        .rows.reduce(
          (sum, row) => sum + row.getValue('contributionDollars'),
          0,
        ),
  },
  {
    accessorFn: calc.contributionMargin,
    header: 'Contribution %',
    cell: PercentCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const totalContribution = rows.reduce(
        (sum, row) => sum + row.getValue('contributionDollars'),
        0,
      );
      const totalSellingPrice = rows.reduce(
        (sum, row) => sum + row.getValue('total_selling_price'),
        0,
      );
      const percent = totalContribution / totalSellingPrice;
      return `${(percent * 100).toFixed(2)}%`;
    },
  },
  {
    accessorFn: calc.contributionPerHour,
    header: 'Contribution / Hr',
    cell: DollarCell,
    footer: 'TODO',
  },
];
