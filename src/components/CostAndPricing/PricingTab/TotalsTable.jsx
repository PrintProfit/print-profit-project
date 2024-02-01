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
