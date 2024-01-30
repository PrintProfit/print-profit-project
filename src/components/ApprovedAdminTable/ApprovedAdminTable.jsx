import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function ApprovedAdminPage({ approvedUser }) {
  const dispatch = useDispatch();

  const [openDelete, setDeleteOpen] = useState(false);

  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const deleteUser = () => {
    console.log('deleting approved');
    dispatch({
      type: 'SAGA_SOFT_DELETE_USER',
      payload: {
        aboutToBeDeletedUser: approvedUser.user_id,
      },
    });
  };

  return (
    <tr>
      <td>{approvedUser.user_name}</td>
      <td>{approvedUser.email}</td>
      <td>{approvedUser.company_name}</td>
      <td>{approvedUser.last_login}</td>
      <td>Approved</td>
      <td>
        <button type="button" onClick={handleDeleteClickOpen}>
          Delete
        </button>
      </td>

      <Dialog
        open={openDelete}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to delete this account?'}
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

export default ApprovedAdminPage;
