import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
    <tr>
      <td>{archivedUser.user_name}</td>
      <td>{archivedUser.email}</td>
      <td>{archivedUser.last_login}</td>
      <td>
        <button type="button" onClick={handleRecoverClickOpen}>
          Recover
        </button>
      </td>
      <td>
        <button type="button" onClick={handleDeleteClickOpen}>
          Delete
        </button>
      </td>

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
          <Button onClick={handleRecoverClose}>Close</Button>
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
          <Button onClick={deleteUser} autoFocus>
            Delete
          </Button>
          <Button onClick={handleDeleteClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
}

export default ArchivedAdminPage;
