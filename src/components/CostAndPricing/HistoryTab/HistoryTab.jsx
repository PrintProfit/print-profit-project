import styled from '@emotion/styled';
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import QuoteTableRow from './QuoteTableRow';

export default function HistoryTab() {
  const dispatch = useDispatch();
  const quoteHistory = useSelector((store) => store.quote.quoteHistory);
  const user = useSelector((store) => store.user);
  const companyId = user.currentUser.company_id;

  // fetches all the quotes for a given user's company
  useEffect(() => {
    dispatch({
      type: 'SAGA/FETCH_QUOTE_HISTORY',
      payload: companyId,
    });
  }, [dispatch, companyId]);

  // Modal constants
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell>Quote id</TableCell>
              <TableCell>Quote name</TableCell>
              <TableCell>Created by</TableCell>
              <TableCell>Date created</TableCell>
              <TableCell>Number of products</TableCell>
              <TableCell>Total selling price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quoteHistory.quotes?.map((row) => (
              <QuoteTableRow
                key={row.quote_id}
                id={row.quote_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                row={row}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
