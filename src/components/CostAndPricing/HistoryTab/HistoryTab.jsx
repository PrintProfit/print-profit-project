import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function HistoryTab() {
  const dispatch = useDispatch();
  const quoteHistory = useSelector((store) => store.quote.quoteHistory);
  const user = useSelector((store) => store.user);
  const companyId = user.currentUser.company_id;

  useEffect(() => {
    dispatch({
      type: 'SAGA/FETCH_QUOTE_HISTORY',
      payload: companyId,
    });
  }, [dispatch, companyId]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Quote id</TableCell>
            <TableCell>Date created</TableCell>
            <TableCell>Created by</TableCell>
            <TableCell>Number of products</TableCell>
            <TableCell>Total selling price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quoteHistory.quotes?.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <button type="button">See details</button>
              </TableCell>
              <TableCell variant="head" scope="row">
                {row.quote_id}
              </TableCell>
              <TableCell>{row.quote_name}</TableCell>
              <TableCell>{row.created_at}</TableCell>
              <TableCell>{row.products.length}</TableCell>
              <TableCell>{row.products.total_selling_price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
