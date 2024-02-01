// @ts-check

import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DynamicCostCell } from './cells';
import {
  calculatedCosts,
  consistentColumns,
  contributionColumns,
  estimatedHoursColumn,
} from './columns';

/**
 * @param {import('./prop-types').PricingTableProps} props
 */
export function PricingTable({ quote, setQuote }) {
  // The @type JSDoc comments here are to get VSCode to understand
  // what these objects are.

  /**
   * The dynamic columns that the table uses. They're generated from the frist
   * product's costs.
   * This will most likely break when interacting with the server, since
   * there'll be a period of time where the quote is empty. I'll deal with that
   * when connecting this up to the server though.
   *
   * Originally, this was wrapped in a useEffect, but the react docs's
   * {@link https://react.dev/learn/you-might-not-need-an-effect You Might Not Need an Effect}
   * page suggests that this should be avoidable, and that this can be done
   * during rendering.
   * @type {import('./data-types').ProductColumnDef[]}
   */
  const dynamicColumns = quote.products[0].costs.map((cost, index) => ({
    // The ID is how we can use getValue for calculations.
    id: `dynamic-cost-${cost.name}`,
    accessorFn: (row) => row.costs[index].value,
    header: cost.name,
    cell: ({ getValue, row, table }) => (
      <DynamicCostCell
        getValue={getValue}
        costIndex={index}
        table={table}
        row={row}
      />
    ),
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      const total = rows.reduce(
        (sum, row) => sum + row.getValue(`dynamic-cost-${cost.name}`),
        0,
      );
      return `$${total.toFixed(2)}`;
    },
  }));

  /**
   * All the columns the table uses.
   * This *should* get recalculated on rerenders.
   */
  const columns = [
    ...consistentColumns,
    ...dynamicColumns,
    ...calculatedCosts,
    estimatedHoursColumn,
    ...contributionColumns,
  ];

  const table = useReactTable({
    data: quote.products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      setQuote,
    },
  });

  // This is sorta awkward, but it's so far the best way I've found to get the
  // table to have the correct layout. Most libraries lack a way to get cells
  // by data field, which is what our rows are.
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        {table.getAllFlatColumns().map((col) => (
          <TableRow key={col.id}>
            <TableCell variant="head">
              {flexRender(
                col.columnDef.header,
                table
                  .getFlatHeaders()
                  .find((h) => h.id === col.id)
                  .getContext(),
              )}
            </TableCell>
            {table.getCoreRowModel().rows.map((row) => (
              <TableCell key={row.id}>
                {flexRender(
                  col.columnDef.cell,
                  row
                    .getAllCells()
                    .find((cell) => cell.column.id === col.id)
                    .getContext(),
                )}
              </TableCell>
            ))}
            <TableCell variant="footer">
              {flexRender(
                col.columnDef.footer,
                table
                  .getFooterGroups()
                  .flatMap((g) => g.headers)
                  .find((h) => h.id === col.id)
                  .getContext(),
              )}
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </TableContainer>
  );
}
