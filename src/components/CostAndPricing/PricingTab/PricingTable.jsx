// @ts-check

import { DataTable } from './DataTable';
import { ConsistentNumericCell, DynamicCostCell } from './cells';

/**
 * @param {object} props
 * @param {Quote} props.quote
 * @param {React.Dispatch<React.SetStateAction<Quote>>} props.setQuote
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
   * @type {ProductColumnDef[]}
   */
  const consistentColumns = [
    { accessorKey: 'name', header: 'Name' },
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
    },
    {
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
   * @type {ProductColumnDef[]}
   */
  const dynamicColumns = quote.products[0].costs.map((cost, index) => ({
    accessorFn: (row) => row.costs[index].value,
    header: cost.name,
    cell: ({ getValue, row }) => {
      return (
        <DynamicCostCell
          getValue={getValue}
          setQuote={setQuote}
          productIndex={row.index}
          costIndex={index}
        />
      );
    },
  }));

  /**
   * All the columns the table uses.
   * This *should* get recalculated on rerenders.
   */
  const columns = [...consistentColumns, ...dynamicColumns];

  // The data table isn't a particularly generic component, but it's separated
  // from here so that it can be where the hook is used. That should ensure that
  // the table gets rerendered when the columns change.
  return <DataTable data={quote.products} columns={columns} />;
}
