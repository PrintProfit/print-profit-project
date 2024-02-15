import { flexRender } from '@tanstack/react-table';

/**
 * Runs a selected column's aggregation function on an entire column
 * @template {unknown} TData
 * @param {import("@tanstack/react-table").Table<TData>} table
 * @param {string} columnId
 * @returns {number | undefined}
 */
export function aggregate(table, columnId) {
  const { rows } = table.getCoreRowModel();
  const aggregationFn = table.getColumn(columnId)?.getAggregationFn();
  return aggregationFn?.(columnId, [], rows);
}

/**
 * Predicate to filter out duplicate values
 * @template T
 * @param {T} value
 * @param {number} index
 * @param {T[]} self
 * @returns {boolean}
 */
export const unique = (value, index, self) => self.indexOf(value) === index;

/**
 * Callback to map a product to its cost names
 * @param {import("./data-types").Product} product
 * @returns {string[]}
 */
export const toCostNames = (product) => product.costs.map((cost) => cost.name);

/**
 * type-safe wrapper for flexRender
 * @template {object} T
 * @param {Parameters<typeof flexRender<T>>[0]} Comp
 * @param {(Parameters<typeof flexRender<T>>[1]|undefined)} props
 * @returns {ReturnType<typeof flexRender<T>>}
 */
export const safeFlexRender = (Comp, props) =>
  Comp && props ? flexRender(Comp, props) : null;
