// @ts-check

import {
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useCallback, useState } from 'react';

/**
 * @param {import("./prop-types").TotalsTableProps} props
 */
export function TotalsTable({ quote, table }) {
  const [contributionPercent, setContributionPercent] = useState(0);
  const [manualPrice, setManualPrice] = useState(0);
  const [pricePerItem, setPricePerItem] = useState(0);

  // the total selling price's aggregation function
  const getTotalSellingPrice = useCallback(
    table.getColumn('total_selling_price').getAggregationFn(),
    [],
  );
  const dynamicCostIds = quote.products[0].costs.map(
    (cost) => `dynamic-cost-${cost.name}`,
  );

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
          {/* Total Selling Price Row */}
          <TableRow>
            <TableCell>
              $
              {(
                getTotalSellingPrice(
                  'total_selling_price',
                  [],
                  table.getCoreRowModel().rows,
                ) /
                (1 - contributionPercent / 100)
              ).toFixed(2)}
            </TableCell>
            <TableCell>
              <Input
                value={manualPrice}
                onChange={(e) => setManualPrice(Number(e.target.value))}
              />
            </TableCell>
            <TableCell>
              <Input
                value={pricePerItem}
                onChange={(e) => setPricePerItem(Number(e.target.value))}
              />
            </TableCell>
          </TableRow>
          {dynamicCostIds.map((column) => (
            <TotalsTableRow key={column} table={table} column={column} />
          ))}
          <TotalsTableRow table={table} column="creditCardFee" />
          <TotalsTableRow table={table} column="totalVariableCosts" />
          <TotalsTableRow table={table} column="estimated_hours" />
          {/* Contribution Margin Row */}
          <TableRow>
            <TableCell>
              <Input
                value={contributionPercent}
                onChange={(e) => setContributionPercent(Number(e.target.value))}
              />
            </TableCell>
            <TableCell>TODO</TableCell>
            <TableCell>TODO</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

/**
 * Used for rows which have three columns that have the same value
 * @param {import('./prop-types').TotalsTableRowProps} props
 */
function TotalsTableRow({ table, column }) {
  // It might be better to use the footer here
  const aggregate = table.getColumn(column).getAggregationFn();
  const { rows } = table.getCoreRowModel();
  const total = aggregate(column, [], rows);

  return (
    <TableRow>
      <TableCell>{total}</TableCell>
      <TableCell>{total}</TableCell>
      <TableCell>{total}</TableCell>
    </TableRow>
  );
}
