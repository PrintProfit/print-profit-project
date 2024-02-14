import { aggregate } from '../utils';
import { NumberFormatter } from './internal';

/**
 * Footer component for rows with no special number formatting needed.
 * @param {import("../prop-types").HeaderProps<unknown>} props
 * @returns {React.ReactNode}
 */
export function NumberFooter({ table, column }) {
  // We utilize aggregation to calculate totals, but this isn't really how
  // it's supposed to be used. It lets us skip writing a bunch of sum reducers,
  // and *probably* performs better than doing it manually since TanStack
  // Tables takes away most cache/memorization capabilities.
  const aggregate = column.getAggregationFn();
  const { rows } = table.getCoreRowModel();
  /** @type {number?} */
  const result = aggregate?.(column.id, [], rows);
  return result && <NumberFormatter value={result} />;
}

/**
 * Footer component for currency rows.
 * @param {import("../prop-types").HeaderProps<unknown>} props
 * @returns {React.ReactNode}
 */
export function CurrencyFooter({ table, column }) {
  const aggregate = column.getAggregationFn();
  const { rows } = table.getCoreRowModel();
  /** @type {number?} */
  const total = aggregate?.(column.id, [], rows);
  return total && <NumberFormatter value={total} variant="currency" />;
}

/**
 * Footer component for the contribution rows.
 * @param {import("../prop-types").HeaderProps<unknown>} props
 * @returns {React.ReactNode}
 */
export function ContributionFooter({ table, column }) {
  const divisorId = column.columnDef.meta?.footerContribDivisor;
  const format = column.columnDef.meta?.footerContribFormat ?? 'number';

  const contribution = aggregate(table, 'contributionDollars') ?? 0;
  const divisor = (divisorId ? aggregate(table, divisorId) : null) ?? 0;
  const result = divisor === 0 ? 0 : contribution / divisor;

  return <NumberFormatter value={result} variant={format} />;
}
