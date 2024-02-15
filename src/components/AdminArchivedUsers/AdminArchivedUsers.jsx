import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useSelector } from 'react-redux';
import ArchivedAdminTable from '../ArchivedAdminTable/ArchivedAdminTable';

export default function AdminArchivedUsers() {
  const archivedUsers = useSelector((store) => store.user.archivedUserReducer);

  return (
    <>
      <h3>Archived Users: {archivedUsers.length}</h3>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Created on</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {archivedUsers.map((archivedUser) => {
            return (
              <ArchivedAdminTable
                key={archivedUser.user_id}
                archivedUser={archivedUser}
              />
            );
          })}
        </TableBody>
      </Table>
    </>
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
