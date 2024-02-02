import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ApprovedAdminPage({ approvedUser }) {
  const dispatch = useDispatch();

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
      type: 'SAGA_SOFT_DELETE_USER',
      payload: {
        aboutToBeDeletedUser: approvedUser.user_id,
      },
    });
  };

  return (
    <TableRow>
      <TableCell>{approvedUser.user_name}</TableCell>
      <TableCell align="center">{approvedUser.email}</TableCell>
      <TableCell align="center">{approvedUser.company_name}</TableCell>
      <TableCell align="center">{approvedUser.last_login}</TableCell>
      <TableCell
        sx={{ color: '#5CCD8B', fontWeight: 'bold', fontSize: 15 }}
        align="center"
      >
        Approved
      </TableCell>
      <TableCell align="center">
        <Button color="error" type="button" onClick={handleDeleteClickOpen}>
          Delete
        </Button>
      </TableCell>

      {/* Delete Dialog */}
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

export default ApprovedAdminPage;
