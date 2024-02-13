import * as fmt from './formats';

/**
 * @param {import("./prop-types").HeaderProps<unknown>} props
 */
export function NumberFooter({ table, column }) {
  const aggregate = column.getAggregationFn();
  const { rows } = table.getCoreRowModel();
  /** @type {number?} */
  return aggregate?.(column.id, [], rows);
}

/**
 * @param {import("./prop-types").HeaderProps<unknown>} props
 */
export function CurrencyFooter({ table, column }) {
  const aggregate = column.getAggregationFn();
  const { rows } = table.getCoreRowModel();
  /** @type {number?} */
  const total = aggregate?.(column.id, [], rows);
  return fmt.currency(total);
}
