// @ts-check

import { useEffect, useState } from 'react';
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

  /** @type {[ProductColumn, import('react').Dispatch<ProductColumn>]} */
  const [dynamicColumns, setDynamicColumns] = useState([]);

  /** @type {[ProductColumn, import('react').Dispatch<ProductColumn>]} */
  const [columns, setColumns] = useState([...staticColumns, ...dynamicColumns]);

  // This is a somewhat awkward, but functional way to set the dynamic columns correctly.
  // I suspect it will break a bit when the server actually gets used, and I don't know if
  // editing works correctly with it.
  // biome-ignore lint/correctness/useExhaustiveDependencies: Rule breaks on this code
  useEffect(() => {
    setDynamicColumns(
      quote.products[0].costs.map((cost, index) => ({
        accessorFn: (row) => row.costs[index].value,
        header: cost.name,
      })),
    );
  }, [quote.products]);

  // This sets the columns that the data table actually uses.
  useEffect(() => {
    setColumns([...staticColumns, ...dynamicColumns]);
  }, [dynamicColumns]);

  // The data table isn't a particularly generic component, but it's separated
  // from here so that it can be where the hook is used. That should ensure that
  // the table gets rerendered when the columns change.
  return <DataTable data={quote.products} columns={columns} />;
}
