import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useSelector } from 'react-redux';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';

export default function AdminView() {
  const pendingUsers = useSelector((store) => store.user.pendingUserReducer);
  const approvedUsers = useSelector((store) => store.user.approvedUserReducer);

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
              <StyledTableCell>Created on</StyledTableCell>
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
              <StyledTableCell>Created on</StyledTableCell>
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
