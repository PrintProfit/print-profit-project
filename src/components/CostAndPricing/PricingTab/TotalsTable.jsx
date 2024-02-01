// @ts-check

import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useState } from 'react';

/**
 * @param {import("./prop-types").TotalsTableProps} props
 */
export function TotalsTable({ quote }) {
  const [contributionPercent, setContributionPercent] = useState(0);
  const [manualPrice, setManualPrice] = useState(0);
  const [pricePerItem, setPricePerItem] = useState(0);

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
      </Table>
    </TableContainer>
  );
}
