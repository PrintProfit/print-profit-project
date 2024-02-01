import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const filter = createFilterOptions();

function PendingAdminPage({ pendingUser }) {
  const dispatch = useDispatch();

  const companyList = useSelector((store) => store.user.companyList);

  // console.log('company list', companyList);

  const [newCompanyInput, setNewCompanyInput] = useState('');

  const [openApproval, setOpenApproval] = useState(false);

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

    console.log('approving user', companyInput);

    // This should do what that for loop was trying to do
    // findIndex returns -1 when the item is not found
    const companyIndex = companyList.findIndex(
      (company) => company.name === companyInput,
    );
    if (companyIndex >= 0) {
      const companyId = companyIndex + 1;

      console.log('company id', companyId);

      dispatch({
        type: 'SAGA_APPROVE_USER',
        payload: {
          pendingUserId: pendingUser.user_id,
          companyId: companyId,
        },
      });
    } else {
      console.log('company not found');

      const newCompanyId = companyList.length + 1;

      // console.log('newCompanyId', newCompanyId);

      dispatch({
        type: 'SAGA_POST_NEW_COMPANY',
        payload: {
          pendingUserId: pendingUser.user_id,
          newCompanyName: companyInput,
          companyId: newCompanyId,
        },
      });
    }
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

  // Sends dispatch to delete the user
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
            Please select the correct company that this user will be using this
            with.
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
            // id="free-solo-with-text-demo"
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
                // id="name"
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
          <Button type="submit">Approve</Button>
          <Button onClick={handleApprovalClose}>Cancel</Button>
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
          <Button onClick={handleDeleteClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
}

export default PendingAdminPage;
