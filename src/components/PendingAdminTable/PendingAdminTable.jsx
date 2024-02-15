import emailjs from '@emailjs/browser';
import {
  Archive as ArchiveIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableCell,
  TableRow,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const filter = createFilterOptions();

function PendingAdminPage({ pendingUser }) {
  const dispatch = useDispatch();

  const companyList = useSelector((store) => store.user.companyList);

  // console.log('company', pendingUser);

  const [newCompanyInput, setNewCompanyInput] = useState(
    pendingUser.pending_company_name,
  );
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

  const templateParams = {
    from_name: 'Print Profit',
    from_email: 'nick@printprofit.com',
    to_name: pendingUser.user_name,
    to_email: pendingUser.email,
    message: 'You have been accepted to use Print Profit',
  };

  // conditonally sends approval dispatch
  const approveUser = (companyInput) => {
    setOpenApproval(false);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_REGISTERED_AND_APPROVED_TEMPLATE_ID,
        templateParams,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      )
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );

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

  // formats inserted_at timestamp as readable string
  const stringifyDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const stringifiedDate = date.toLocaleDateString('en-us', options);
    return stringifiedDate;
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
      <TableCell>{pendingUser.email}</TableCell>
      <TableCell>{pendingUser.pending_company_name}</TableCell>
      <TableCell>{stringifyDate(pendingUser.created_at)}</TableCell>
      <TableCell align="center">
        <Button
          type="button"
          variant="contained"
          onClick={handleApprovalClickOpen}
        >
          <CheckCircleIcon /> Approve
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          color="error"
          type="button"
          variant="outlined"
          onClick={() => handleDeleteClickOpen()}
        >
          <ArchiveIcon /> Archive
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
            Please select ADD button before the new company name if you are
            entering a new company, or select a pre-existing company.
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
                color={
                  newCompanyInput === '' || newCompanyInput === null
                    ? 'error'
                    : ''
                }
                fullWidth
                variant="standard"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit">
            <CheckCircleIcon /> Approve
          </Button>
          <Button sx={{ color: 'black' }} onClick={handleApprovalClose}>
            <CloseIcon /> Cancel
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
            The user's account access will be revoked. You may recover archived
            accounts in the "Archive" tab.
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

export default PendingAdminPage;
