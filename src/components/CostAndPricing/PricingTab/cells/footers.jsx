import * as fmt from '../formats';
import { aggregate } from '../utils';

/**
 * @param {import("../prop-types").HeaderProps<unknown>} props
 */
export function NumberFooter({ table, column }) {
  const aggregate = column.getAggregationFn();
  const { rows } = table.getCoreRowModel();
  /** @type {number?} */
  return aggregate?.(column.id, [], rows);
}

/**
 * @param {import("../prop-types").HeaderProps<unknown>} props
 */
export function CurrencyFooter({ table, column }) {
  const aggregate = column.getAggregationFn();
  const { rows } = table.getCoreRowModel();
  /** @type {number?} */
  const total = aggregate?.(column.id, [], rows);
  return fmt.currency(total);
}

/**
 * @param {import("../prop-types").HeaderProps<unknown>} props
 */
export function ContributionFooter({ table, column }) {
  const divisorId = column.columnDef.meta?.footerContribDivisor;
  const format = column.columnDef.meta?.footerContribFormat ?? 'number';

  const contribution = aggregate(table, 'contributionDollars') ?? 0;
  const divisor = (divisorId ? aggregate(table, divisorId) : null) ?? 0;
  const result = divisor === 0 ? 0 : contribution / divisor;

  switch (format) {
    case 'currency':
      return fmt.currency(result);
    case 'percent':
      return fmt.percent(result);
    case 'accounting':
      return fmt.accounting(result);
    default:
      return result;
  }
}
