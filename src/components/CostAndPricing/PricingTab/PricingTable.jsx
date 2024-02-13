// @ts-check

import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { PricingToolHelp } from '../../PricingToolHelp/PricingToolHelp';
import { TotalsHelp } from '../../PricingToolHelp/TotalsHelp';
import { TotalsTable } from './TotalsTable';
import { QuoteActions } from './actions';
import {
  AddProductCell,
  CurrencyFooter,
  DynamicCostCell,
  DynamicCostHeader,
} from './cells';
import {
  addDynamicCostColumn,
  calculatedCosts,
  consistentColumns,
  contributionColumns,
  estimatedHoursColumn,
} from './columns';
import { PricingTableRow as TableRow } from './stylized';
import { toCostNames, unique } from './utils';

/**
 * @param {import('./prop-types').PricingTableProps} props
 */
export function PricingTable({ quote, setQuote }) {
  // The @type JSDoc comments here are to get VSCode to understand
  // what these objects are.

  /** @type {boolean} */
  const updateMode = useSelector(
    (/** @type {any} */ state) => state.quote.updateMode,
  );

  const costNames = quote.products.flatMap(toCostNames).filter(unique);

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
   *
   * the `.flatMap` call gets the cost names for all the products, even if there aren't any.
   * the `.filter` call removes duplicates names.
   * @type {import('./data-types').ProductColumnDef[]}
   */
  const dynamicColumns = costNames.map((name) => ({
    // The ID is how we can use getValue for calculations.
    id: `dynamic-cost-${name}`,
    accessorFn: (row) => row.costs.find((c) => c.name === name)?.value ?? 0,
    header: DynamicCostHeader,
    cell: DynamicCostCell,
    aggregationFn: 'sum',
    footer: CurrencyFooter,
    meta: {
      costName: name,
    },
  }));

  /**
   * All the columns the table uses.
   * This *should* get recalculated on rerenders.
   */
  const columns = [
    ...consistentColumns,
    ...dynamicColumns,
    addDynamicCostColumn,
    ...calculatedCosts,
    estimatedHoursColumn,
    ...contributionColumns,
  ];

  const table = useReactTable({
    data: quote.products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // The meta option is how we can pass the setQuote function to the cells.
    meta: {
      setQuote,
      updateMode,
      costNames,
    },
  });

  /**
   * type-safe wrapper for flexRender
   * @template {object} T
   * @param {Parameters<typeof flexRender<T>>[0]} Comp
   * @param {(Parameters<typeof flexRender<T>>[1]|undefined)} props
   * @returns {ReturnType<typeof flexRender<T>>}
   */
  const safeFlexRender = (Comp, props) => {
    if (Comp && props) {
      return flexRender(Comp, props);
    }
    return null;
  };

  // This is sorta awkward, but it's so far the best way I've found to get the
  // table to have the correct layout. Most libraries lack a way to get cells
  // by data field, which is what our rows are.
  return (
    <Grid container columns={24} direction="row" spacing={2} mt={1}>
      {/*
        Grids have 12 columns by default, but the pricing tool looks best with
        an xs of 8.5, so we double the values.
        */}
      <Grid direction="column" xs={17}>
        <Stack direction="row" sx={{ alignItems: 'center', mb: 1 }} spacing={1}>
          <Typography variant="h5">Pricing Tool</Typography>
          <PricingToolHelp />
        </Stack>
        <Paper sx={{ width: '100%', overflow: 'hidden' }} variant="outlined">
          <TableContainer>
            <Table size="small" stickyHeader>
              <TableBody>
                {table.getAllFlatColumns().map((col, index) => (
                  <TableRow key={col.id}>
                    <TableCell
                      variant="head"
                      sx={{ minWidth: 170 }}
                      scope="row"
                    >
                      {safeFlexRender(
                        col.columnDef.header,
                        table
                          .getFlatHeaders()
                          .find((h) => h.id === col.id)
                          ?.getContext(),
                      )}
                    </TableCell>
                    {table.getCoreRowModel().rows.map((row) => (
                      <TableCell
                        key={row.id}
                        sx={{ minWidth: 170 }}
                        variant={col.columnDef.meta?.cellVariant}
                      >
                        {safeFlexRender(
                          col.columnDef.cell,
                          row
                            .getAllCells()
                            .find((cell) => cell.column.id === col.id)
                            ?.getContext(),
                        )}
                      </TableCell>
                    ))}
                    <TableCell variant={col.columnDef.meta?.cellVariant}>
                      {index === 0 && <AddProductCell table={table} />}
                    </TableCell>
                    <TableCell
                      variant={col.columnDef.meta?.footerVariant ?? 'footer'}
                    >
                      {safeFlexRender(
                        col.columnDef.footer,
                        table
                          .getFooterGroups()
                          .flatMap((g) => g.headers)
                          .find((h) => h.id === col.id)
                          ?.getContext(),
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: 1,
          }}
        >
          <QuoteActions quote={quote} setQuote={setQuote} />
        </Box>
      </Grid>
      <Grid xs>
        <Stack direction="row" sx={{ alignItems: 'center', mb: 1 }} spacing={1}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Totals
          </Typography>
          <TotalsHelp />
        </Stack>
        <TotalsTable quote={quote} setQuote={setQuote} table={table} />
      </Grid>
    </Grid>
  );
}
