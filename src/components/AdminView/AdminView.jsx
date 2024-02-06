import { Box, Tab, Tabs, styled } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';

export default function AdminView() {
  const user = useSelector((store) => store.user.currentUser);
  const pendingUsers = useSelector((store) => store.user.pendingUserReducer);
  const approvedUsers = useSelector((store) => store.user.approvedUserReducer);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <div>
      <h3>Pending Users: {pendingUsers.length}</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Last Login</StyledTableCell>
              <StyledTableCell align="center">Approve</StyledTableCell>
              <StyledTableCell align="center">Archive</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pendingUsers.map((pendingUser) => {
              return (
                <PendingAdminTable
                  key={pendingUser.user_id}
                  pendingUser={pendingUser}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <h3>Approved Users: {approvedUsers.length}</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Company Name</StyledTableCell>
              <StyledTableCell>Last Login</StyledTableCell>
              <StyledTableCell align="center">Status</StyledTableCell>
              <StyledTableCell align="center">Archive</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedUsers.map((approvedUser) => {
              return (
                <ApprovedAdminTable
                  key={approvedUser.user_id}
                  approvedUser={approvedUser}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
