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
import {
  ConsistentNumericCell,
  DynamicCostCell,
  ProductNameCell,
} from './cells';
import { calculatedCosts, contributionColumns } from './columns';

/**
 * @param {import('./prop-types').PricingTableProps} props
 */
export function PricingTable({ quote, setQuote }) {
  // The @type JSDoc comments here are to get VSCode to understand
  // what these objects are.

  /**
   * Consistent columns that are always present.
   *
   * While I'd prefer having these defined in a completely separate file, they
   * need to be defined as a part of this component so that the quote setter
   * can get passed down to the cells.
   *
   * @type {import('./data-types').ProductColumnDef[]}
   */
  const consistentColumns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ProductNameCell,
      footer: 'Total',
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ getValue, row }) => (
        <ConsistentNumericCell
          getValue={getValue}
          setQuote={setQuote}
          productIndex={row.index}
          accessorKey="quantity"
        />
      ),
      footer: ({ table }) => {
        const { rows } = table.getCoreRowModel();
        return rows.reduce((sum, row) => sum + row.getValue('quantity'), 0);
      },
    },
    {
      accessorKey: 'selling_price',
      header: 'Selling Price',
      cell: ({ getValue, row }) => (
        <ConsistentNumericCell
          getValue={getValue}
          setQuote={setQuote}
          productIndex={row.index}
          accessorKey="selling_price"
        />
      ),
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
      cell: ({ getValue, row }) => (
        <ConsistentNumericCell
          getValue={getValue}
          setQuote={setQuote}
          productIndex={row.index}
          accessorKey="total_selling_price"
        />
      ),
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
    cell: ({ getValue, row }) => (
      <DynamicCostCell
        getValue={getValue}
        setQuote={setQuote}
        productIndex={row.index}
        costIndex={index}
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
   * This has to be separated out from some other columns, since while it's
   * editable, it's below some calculated costs.
   * @type {import('./data-types').ProductColumnDef}
   */
  const estimatedHoursColumn = {
    accessorKey: 'estimated_hours',
    header: 'Estimated Hours',
    cell: ({ getValue, row }) => (
      <ConsistentNumericCell
        getValue={getValue}
        setQuote={setQuote}
        productIndex={row.index}
        accessorKey="estimated_hours"
      />
    ),
    footer: ({ table }) => {
      const { rows } = table.getCoreRowModel();
      return rows.reduce(
        (sum, row) => sum + row.getValue('estimated_hours'),
        0,
      );
    },
  };

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

  // The data table isn't a particularly generic component, but it's separated
  // from here so that it can be where the hook is used. That should ensure that
  // the table gets rerendered when the columns change.
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
