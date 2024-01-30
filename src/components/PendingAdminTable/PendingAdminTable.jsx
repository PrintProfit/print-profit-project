import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function PendingAdminPage({ pendingUser }) {
  const dispatch = useDispatch();

  const [openApproval, setApprovalOpen] = useState(false);

  const handleApprovalClickOpen = () => {
    setApprovalOpen(true);
  };

  const handleApprovalClose = () => {
    setApprovalOpen(false);
  };

  const approveUser = () => {
    console.log('approving user');
    dispatch({
      type: 'SAGA_APPROVE_USER',
      payload: {
        pendingUserId: pendingUser.user_id,
      },
    });
  };

  const [openDelete, setDeleteOpen] = useState(false);

  const handleDeleteClickOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const deleteUser = (params) => {
    console.log('deleiting pending');
    dispatch({
      type: 'SAGA_SOFT_DELETE_USER',
      payload: {
        aboutToBeDeletedUser: pendingUser.user_id,
      },
    });
  };

  return (
    <tr>
      <td>{pendingUser.user_name}</td>
      <td>{pendingUser.email}</td>
      <td>{pendingUser.pending_company_name}</td>
      <td>{pendingUser.last_login}</td>
      <td>
        <button type="button" onClick={handleApprovalClickOpen}>
          Approve
        </button>
      </td>
      <td>
        <button type="button" onClick={() => handleDeleteClickOpen()}>
          Delete
        </button>
      </td>

      <Dialog
        open={openApproval}
        onClose={handleApprovalClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Are you sure you want to approve this account?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={approveUser} autoFocus>
            Approve
          </Button>
          <Button onClick={handleApprovalClose}>Close</Button>
        </DialogActions>
      </Dialog>

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

export default PendingAdminPage;
