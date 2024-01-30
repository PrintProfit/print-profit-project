// @ts-check

import { DataTable } from './DataTable';
import { staticColumns } from './columns';

/** @typedef {import('@tanstack/react-table').ColumnDef<Product>[]} ProductColumn */

/**
 * @param {object} props
 * @param {Quote} props.quote
 */
export function PricingTable({ quote }) {
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
   * @type {ProductColumn}
   */
  const dynamicColumns = quote.products[0].costs.map((cost, index) => ({
    accessorFn: (row) => row.costs[index].value,
    header: cost.name,
  }));

  /**
   * All the columns the table uses.
   * This *should* get recalculated on rerenders.
   */
  const columns = [...staticColumns, ...dynamicColumns];

  // The data table isn't a particularly generic component, but it's separated
  // from here so that it can be where the hook is used. That should ensure that
  // the table gets rerendered when the columns change.
  return <DataTable data={quote.products} columns={columns} />;
}
