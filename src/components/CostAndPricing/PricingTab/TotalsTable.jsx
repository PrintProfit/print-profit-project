// @ts-check

import {
  Input,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { flexRender } from '@tanstack/react-table';
import { produce } from 'immer';
import { useCallback, useMemo, useState } from 'react';
import { unique } from './utils';

/**
 * @param {import("./prop-types").TotalsTableProps} props
 */
export function TotalsTable({ quote, setQuote, table }) {
  const [contributionPercent, setContributionPercent] = useState(
    quote.contributionPercent,
  );
  const [manualPrice, setManualPrice] = useState(quote.manualPrice);
  const [pricePerItem, setPricePerItem] = useState(quote.pricePerItem);

  const aggregate = useCallback(
    /**
     * @param {string} column
     * @returns {number}
     */
    (column) => {
      const aggregationFn = table.getColumn(column)?.getAggregationFn();
      return aggregationFn?.(column, [], table.getCoreRowModel().rows) || -1;
    },
    [table.getColumn, table.getCoreRowModel],
  );

  const getCMTotalSellingPrice = useCallback(
    () =>
      aggregate('totalVariableCosts') ?? 0 / (1 - contributionPercent / 100),
    [aggregate, contributionPercent],
  );

  const dynamicCostIds = quote.products
    .flatMap((product) =>
      product.costs.map((cost) => `dynamic-cost-${cost.name}`),
    )
    .filter(unique);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Price on target CM%</TableCell>
            <TableCell>Price on manual entry</TableCell>
            <TableCell>Price on price/item</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Total Variable Costs Row */}
          <TableRow>
            <TableCell>${getCMTotalSellingPrice().toFixed(2)}</TableCell>
            <TableCell>
              <Input
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={manualPrice}
                onChange={(e) => setManualPrice(Number(e.target.value))}
                onBlur={() => {
                  setQuote(
                    produce(
                      (/** @type {import('./data-types').Quote} */ draft) => {
                        draft.manualPrice = manualPrice;
                      },
                    ),
                  );
                }}
              />
            </TableCell>
            <TableCell>
              <Input
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={pricePerItem}
                onChange={(e) => setPricePerItem(Number(e.target.value))}
                onBlur={() => {
                  setQuote(
                    produce(
                      (/** @type {import('./data-types').Quote} */ draft) => {
                        draft.pricePerItem = pricePerItem;
                      },
                    ),
                  );
                }}
              />
            </TableCell>
          </TableRow>
          {dynamicCostIds.map((column) => (
            <TotalsTableRow key={column} table={table} column={column} />
          ))}
          <TotalsTableRow table={table} column="creditCardFee" />
          <TotalsTableRow table={table} column="totalVariableCosts" />
          <TotalsTableRow table={table} column="estimated_hours" />
          {/* This is  */}
          <ContributionRows
            profitMarginTotalPrice={getCMTotalSellingPrice()}
            totalVariableCosts={aggregate('totalVariableCosts')}
            estimatedTotalHours={aggregate('estimated_hours')}
            state={{ manualPrice, pricePerItem }}
            slots={{
              marginInput: (
                <Input
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  value={contributionPercent}
                  onChange={(e) =>
                    setContributionPercent(Number(e.target.value))
                  }
                  onBlur={() => {
                    setQuote(
                      produce(
                        (/** @type {import('./data-types').Quote} */ draft) => {
                          draft.contributionPercent = contributionPercent;
                        },
                      ),
                    );
                  }}
                />
              ),
            }}
          />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/**
 * All the contribution-related components.
 * Their calculations are very closely related, so this component calculates
 * them all.
 * @param {import('./prop-types').ContributionRowsProps} props
 */
function ContributionRows({
  slots: { marginInput },
  state: { manualPrice, pricePerItem },
  profitMarginTotalPrice,
  totalVariableCosts,
  estimatedTotalHours,
}) {
  const manualContrib = manualPrice - totalVariableCosts;
  const perItemContrib = pricePerItem - totalVariableCosts;
  const targetContrib = profitMarginTotalPrice - totalVariableCosts;

  return (
    <>
      {/* Contribution Row */}
      <TableRow>
        <TableCell>
          {targetContrib.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell>
        <TableCell>
          {manualContrib.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell>
        <TableCell>
          {perItemContrib.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell>
      </TableRow>
      {/* Contribution Margin Row */}
      <TableRow>
        <TableCell>{marginInput}</TableCell>
        <TableCell>
          {(manualContrib / manualPrice).toLocaleString(undefined, {
            style: 'percent',
          })}
        </TableCell>
        <TableCell>
          {(perItemContrib / pricePerItem).toLocaleString(undefined, {
            style: 'percent',
          })}
        </TableCell>
      </TableRow>
      {/* Contribution Per Hour Row */}
      <TableRow>
        <TableCell>
          {(targetContrib / estimatedTotalHours).toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell>
        <TableCell>
          {(manualContrib / estimatedTotalHours).toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell>
        <TableCell>
          {(perItemContrib / estimatedTotalHours).toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell>
      </TableRow>
    </>
  );
}

/**
 * Used for rows which have three columns that have the same value
 * @param {import('./prop-types').TotalsTableRowProps} props
 */
function TotalsTableRow({ table, column }) {
  // Attempt to cache the footer & context
  const [footer, context] = useMemo(
    () => getFooter(table, column),
    [table, column],
  );

  return (
    <TableRow>
      <TableCell>{context && flexRender(footer, context)}</TableCell>
      <TableCell>{context && flexRender(footer, context)}</TableCell>
      <TableCell>{context && flexRender(footer, context)}</TableCell>
    </TableRow>
  );
}

/**
 * Gets the footer & context for a column, so it can be passed to flexRender.
 * @template TData
 * @param {import('@tanstack/react-table').Table<TData>} table
 * @param {string} columnId
 * @returns {Parameters<typeof flexRender> | [undefined, undefined]}
 */
function getFooter(table, columnId) {
  const column = table.getColumn(columnId);
  const context = table
    .getFooterGroups()
    .flatMap((g) => g.headers)
    .find((h) => h.id === columnId)
    ?.getContext();

  const footerDef = column?.columnDef.footer;

  if (footerDef && context) {
    // This is *technically* the only thing here that isn't fully type-safe
    // @ts-ignore
    return [footerDef, context];
  }
  return [undefined, undefined];
}
