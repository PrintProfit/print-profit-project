import { Box, Tab, Tabs } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
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

  return (
    <div>
      <h2>Pending Users {pendingUsers.length}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Last Login</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Archive</TableCell>
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

      <h2>Approved Users {approvedUsers.length}</h2>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Last Login</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Archive</TableCell>
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
