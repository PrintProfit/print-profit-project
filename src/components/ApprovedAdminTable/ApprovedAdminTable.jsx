import {
  Archive as ArchiveIcon,
  CheckBox as CheckBoxIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableCell,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

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

  // formats inserted_at timestamp as readable string
  const stringifyDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stringifiedDate = date.toLocaleDateString('en-us', options);
    return stringifiedDate;
  };

  return (
    <TableRow>
      <TableCell>{approvedUser.user_name}</TableCell>
      <TableCell>{approvedUser.email}</TableCell>
      <TableCell>{approvedUser.company_name}</TableCell>
      <TableCell>{stringifyDate(approvedUser.created_at)}</TableCell>
      <TableCell
        sx={{ color: '#5CCD8B', fontWeight: 'bold', fontSize: 15 }}
        align="center"
      >
        <CheckBoxIcon /> Approved
      </TableCell>
      <TableCell align="center">
        <Button
          color="error"
          type="button"
          variant="outlined"
          onClick={handleDeleteClickOpen}
        >
          <ArchiveIcon /> Archive
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
          {'Are you sure you want to archive this account?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This account will be available in the archive tab if you decide to
            archive this user.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={deleteUser} autoFocus>
            <ArchiveIcon /> Archive
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleDeleteClose}>
            <CloseIcon /> Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}

export default ApprovedAdminPage;
