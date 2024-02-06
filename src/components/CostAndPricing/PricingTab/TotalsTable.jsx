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
import { useCallback, useMemo } from 'react';
import { unique } from './utils';

/**
 * @param {import("./prop-types").TotalsTableProps} props
 */
export function TotalsTable({ quote, setQuote, table }) {
  const pricePerItem = quote.pricePerItem ?? 0;

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
      aggregate('totalVariableCosts') /
      ((100 - (quote.manual_contribution_percent ?? 0)) / 100),
    [aggregate, quote.manual_contribution_percent],
  );

  const dynamicCostNames = quote.products
    .flatMap((product) => product.costs.map((cost) => cost.name))
    .filter(unique);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{/* Padding for correct layout */}</TableCell>
            <TableCell>Price on target CM%</TableCell>
            <TableCell>Price on manual entry</TableCell>
            {/* <TableCell>Price on price/item</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Total Variable Costs Row */}
          <TableRow>
            <TableCell variant="head">Total Variable Costs</TableCell>
            <TableCell>
              {getCMTotalSellingPrice().toLocaleString(undefined, {
                style: 'currency',
                currency: 'USD',
              })}
            </TableCell>
            <TableCell>
              <Input
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={quote.manual_total_selling_price ?? 0}
                onChange={(e) => {
                  console.log(e.target.value);
                  setQuote(
                    produce(
                      (/** @type {import('./data-types').Quote} */ draft) => {
                        draft.manual_total_selling_price = Number(
                          e.target.value,
                        );
                      },
                    ),
                  );
                }}
              />
            </TableCell>
            {/* <TableCell>
              <Input
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                value={pricePerItem}
                onChange={(e) => setPricePerItem(Number(e.target.value))}
                onBlur={() => {
                  setQuote(
                    produce(
                      (/** @type {import('./data-types').Quote} * / draft) => {
                        draft.pricePerItem = pricePerItem;
                      },
                    ),
                  );
                }}
              />
            </TableCell> */}
          </TableRow>
          {dynamicCostNames.map((name) => (
            <TotalsTableRow
              key={name}
              table={table}
              column={`dynamic-cost-${name}`}
              title={name}
            />
          ))}
          <TotalsTableRow
            table={table}
            column="creditCardFee"
            title="Credit Card Fee"
          />
          <TotalsTableRow
            table={table}
            column="totalVariableCosts"
            title="Total Variable Costs"
          />
          <TotalsTableRow
            table={table}
            column="estimated_hours"
            title="Estimated Hours"
          />
          {/* This is  */}
          <ContributionRows
            profitMarginTotalPrice={getCMTotalSellingPrice()}
            totalVariableCosts={aggregate('totalVariableCosts')}
            estimatedTotalHours={aggregate('estimated_hours')}
            state={{
              manualPrice: quote.manual_total_selling_price ?? 0,
              pricePerItem,
            }}
            slots={{
              marginInput: (
                <Input
                  type="number"
                  endAdornment={
                    <InputAdornment position="end">%</InputAdornment>
                  }
                  value={quote.manual_contribution_percent ?? 0}
                  onChange={(e) => {
                    setQuote(
                      produce(
                        (/** @type {import('./data-types').Quote} */ draft) => {
                          draft.manual_contribution_percent = Number(
                            e.target.value,
                          );
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
  // const perItemContrib = pricePerItem - totalVariableCosts;
  const targetContrib = profitMarginTotalPrice - totalVariableCosts;

  return (
    <>
      {/* Contribution Row */}
      <TableRow>
        <TableCell variant="head">Contribution</TableCell>
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
        {/* <TableCell>
          {perItemContrib.toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell> */}
      </TableRow>
      {/* Contribution Margin Row */}
      <TableRow>
        <TableCell variant="head">Contribution %</TableCell>
        <TableCell>{marginInput}</TableCell>
        <TableCell>
          {(manualContrib / manualPrice).toLocaleString(undefined, {
            style: 'percent',
          })}
        </TableCell>
        {/* <TableCell>
          {(perItemContrib / pricePerItem).toLocaleString(undefined, {
            style: 'percent',
          })}
        </TableCell> */}
      </TableRow>
      {/* Contribution Per Hour Row */}
      <TableRow>
        <TableCell variant="head">Contribution / Hr</TableCell>
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
        {/* <TableCell>
          {(perItemContrib / estimatedTotalHours).toLocaleString(undefined, {
            style: 'currency',
            currency: 'USD',
          })}
        </TableCell> */}
      </TableRow>
    </>
  );
}

/**
 * Used for rows which have three columns that have the same value
 * @param {import('./prop-types').TotalsTableRowProps} props
 */
function TotalsTableRow({ table, column, title }) {
  // Attempt to cache the footer & context
  const [footer, context] = useMemo(
    () => getFooter(table, column),
    [table, column],
  );

  return (
    <TableRow>
      <TableCell variant="head">{title}</TableCell>
      <TableCell>{context && flexRender(footer, context)}</TableCell>
      <TableCell>{context && flexRender(footer, context)}</TableCell>
      {/* <TableCell>{context && flexRender(footer, context)}</TableCell> */}
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
