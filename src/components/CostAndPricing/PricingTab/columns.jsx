// @ts-check

import * as calc from './calculations';
import {
  ConsistentNumericCell,
  DollarCell,
  PercentCell,
  ProductNameCell,
} from './cells';

/**
 * Consistent columns that are always present.
 * @type {import("./data-types").ProductColumnDef[]}
 */
export const consistentColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ProductNameCell,
    footer: 'Total',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ConsistentNumericCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      return rows.reduce((sum, row) => sum + row.getValue('quantity'), 0);
    },
  },
  {
    accessorKey: 'selling_price',
    header: 'Selling Price',
    cell: ConsistentNumericCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const sellingPrice = rows.reduce(
        (sum, row) => sum + row.getValue('selling_price'),
        0,
      );
      return `$${sellingPrice.toFixed(2)}`;
    },
  },
  {
    accessorKey: 'total_selling_price',
    header: 'Total Selling Price',
    cell: ConsistentNumericCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const totalSellingPrice = rows.reduce(
        (sum, row) => sum + row.getValue('total_selling_price'),
        0,
      );
      return `$${totalSellingPrice.toFixed(2)}`;
    },
  },
];

/** @type {import("./data-types").ProductColumnDef[]} */
export const calculatedCosts = [
  {
    id: 'creditCardFee',
    accessorFn: calc.creditCardFee,
    header: 'Credit Card Fee',
    cell: DollarCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const totalCreditCardFee = rows.reduce(
        (sum, row) => sum + row.getValue('creditCardFee'),
        0,
      );
      return `$${totalCreditCardFee.toFixed(2)}`;
    },
  },
  {
    id: 'totalVariableCosts',
    accessorFn: calc.totalVariableCosts,
    header: 'Total Variable Costs',
    cell: DollarCell,
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const totalVariableCosts = rows.reduce(
        (sum, row) => sum + row.getValue('totalVariableCosts'),
        0,
      );
      return `$${totalVariableCosts.toFixed(2)}`;
    },
  },
];

/**
 * This has to be separated out from some other columns, since while it's
 * editable, it's below some calculated costs.
 * @type {import('./data-types').ProductColumnDef}
 */
export const estimatedHoursColumn = {
  accessorKey: 'estimated_hours',
  header: 'Estimated Hours',
  cell: ConsistentNumericCell,
  footer: ({ table }) => {
    const { rows } = table.getCoreRowModel();
    return rows.reduce((sum, row) => sum + row.getValue('estimated_hours'), 0);
  },
};

/** @type {import("./data-types").ProductColumnDef[]} */
export const contributionColumns = [
  {
    id: 'contributionDollars',
    accessorFn: calc.contribution,
    header: 'Contribution $',
    cell: DollarCell,
    // This happens to work, but it's not how the spreadsheet calculates it.
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const totalContribution = rows.reduce(
        (sum, row) => sum + row.getValue('contributionDollars'),
        0,
      );
      return `$${totalContribution.toFixed(2)}`;
    },
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
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const totalContribution = rows.reduce(
        (sum, row) => sum + row.getValue('contributionDollars'),
        0,
      );
      const totalHours = rows.reduce(
        (sum, row) => sum + row.getValue('estimated_hours'),
        0,
      );
      const perHour = totalHours === 0 ? 0 : totalContribution / totalHours;
      return `$${perHour.toFixed(2)}`;
    },
  },
];
