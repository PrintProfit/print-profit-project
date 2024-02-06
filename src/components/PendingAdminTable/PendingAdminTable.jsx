import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const filter = createFilterOptions();

function PendingAdminPage({ pendingUser }) {
  const dispatch = useDispatch();

  const companyList = useSelector((store) => store.user.companyList);

  // console.log('company', companyList);

  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [openApproval, setOpenApproval] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Opens Approval dialog
  const handleApprovalClickOpen = () => {
    setOpenApproval(true);
  };

  // Closes Approval Dialog
  const handleApprovalClose = () => {
    setOpenApproval(false);
  };

  // conditonally sends approval dispatch
  const approveUser = (companyInput) => {
    setOpenApproval(false);

    // This should do what that for loop was trying to do
    // findIndex returns -1 when the item is not found
    const company = companyList.find(
      (company) => company.name === companyInput,
    );
    if (company) {
      const companyId = company.id;

      dispatch({
        type: 'SAGA_APPROVE_USER',
        payload: {
          pendingUserId: pendingUser.user_id,
          companyId: companyId,
        },
      });
    } else {
      // console.log('company not found');

      dispatch({
        type: 'SAGA_POST_NEW_COMPANY',
        payload: {
          pendingUserId: pendingUser.user_id,
          newCompanyName: companyInput,
        },
      });
    }
  };

  // Opens Delete Dialog
  const handleDeleteClickOpen = () => {
    setOpenDelete(true);
  };

  // Closes Delete Dialog
  const handleDeleteClose = () => {
    setOpenDelete(false);
  };

  // Sends dispatch to delete the user
  const deleteUser = (params) => {
    dispatch({
      type: 'SAGA_SOFT_DELETE_USER',
      payload: {
        aboutToBeDeletedUser: pendingUser.user_id,
      },
    });
  };

  return (
    <TableRow>
      <TableCell variant="head" scope="row">
        {pendingUser.user_name}
      </TableCell>
      <TableCell align="center">{pendingUser.email}</TableCell>
      <TableCell align="center">{pendingUser.pending_company_name}</TableCell>
      <TableCell align="center">{pendingUser.last_login}</TableCell>
      <TableCell align="center">
        <Button type="button" onClick={handleApprovalClickOpen}>
          Approve
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          color="error"
          type="button"
          onClick={() => handleDeleteClickOpen()}
        >
          Archive
        </Button>
      </TableCell>

      {/* Approval Dialog */}
      <Dialog
        open={openApproval}
        onClose={handleApprovalClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const companyInput = formJson.text;
            console.log(companyInput);
            approveUser(companyInput);
          },
        }}
      >
        <DialogTitle>Are you sure you want to approve this user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the correct company or add a new company it doesn't
            already exsist.
          </DialogContentText>
          <Autocomplete
            value={newCompanyInput}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setNewCompanyInput({
                  name: newValue,
                });
              } else if (newValue?.inputValue) {
                // Create a new value from the user input
                setNewCompanyInput({
                  name: newValue.inputValue,
                });
              } else {
                setNewCompanyInput(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.name,
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  name: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={companyList}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                required
                margin="dense"
                name="text"
                type="text"
                label="Company Name Here"
                placeholder={pendingUser.pending_company_name || ''}
                fullWidth
                variant="standard"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit">
            Approve
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleApprovalClose}>
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
            Archive
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleDeleteClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}

export default PendingAdminPage;
