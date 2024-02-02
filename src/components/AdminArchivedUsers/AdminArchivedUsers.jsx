import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import ArchivedAdminTable from '../ArchivedAdminTable/ArchivedAdminTable';

export default function AdminArchivedUsers() {
  const archivedUsers = useSelector((store) => store.user.archivedUserReducer);

  return (
    <>
      <h2>Archived Users {archivedUsers.length}</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Last Login</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Delete</TableCell>
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
