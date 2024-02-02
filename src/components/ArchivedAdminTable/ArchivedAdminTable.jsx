import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

function ArchivedAdminPage({ archivedUser }) {
  const dispatch = useDispatch();

  const [openRecover, setOpenRecover] = useState(false);

  // Opens Delete Dialog
  const handleRecoverClickOpen = () => {
    setOpenRecover(true);
  };

  // Closes Delete Dialog
  const handleRecoverClose = () => {
    setOpenRecover(false);
  };

  // sends dispatch to soft delete the user
  const recoverUser = () => {
    dispatch({
      type: 'SAGA_RECOVER_USER',
      payload: {
        aboutToBeRecoveredUser: archivedUser.user_id,
      },
    });
  };

  const [openDelete, setOpenDelete] = useState(false);

  // Opens Delete Dialog
  const handleDeleteClickOpen = () => {
    setOpenDelete(true);
  };

  // Closes Delete Dialog
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  // sends dispatch to soft delete the user
  const deleteUser = () => {
    dispatch({
      type: 'SAGA_HARD_DELETE_USER',
      payload: {
        aboutToBeDeletedUser: archivedUser.user_id,
      },
    });
  };

  return (
    <TableRow>
      <TableCell variant="head" scope="row">
        {archivedUser.user_name}
      </TableCell>
      <TableCell align="center">{archivedUser.email}</TableCell>
      <TableCell align="center">{archivedUser.last_login}</TableCell>
      <TableCell align="center">
        <Button type="button" onClick={handleRecoverClickOpen}>
          Recover
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button color="error" type="button" onClick={handleDeleteClickOpen}>
          Delete
        </Button>
      </TableCell>

      {/* Recover Dialog */}
      <Dialog
        open={openRecover}
        onClose={handleRecoverClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to recover this account?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This user will be allowed access to this app again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={recoverUser} autoFocus>
            Recover
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleRecoverClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to permanently delete this account?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Please be careful!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={deleteUser} autoFocus>
            Delete
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleDeleteClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}

export default ArchivedAdminPage;
