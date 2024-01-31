import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { Autocomplete, TextField } from '@mui/material';

function PendingAdminPage({ pendingUser }) {
  const dispatch = useDispatch();

  const companyList = useSelector((store) => store.user.companyList);

  console.log('company list', companyList);

  const [openApproval, setApprovalOpen] = useState(false);

  const handleApprovalClickOpen = () => {
    setApprovalOpen(true);
  };

  const handleApprovalClose = () => {
    setApprovalOpen(false);
  };

  const approveUser = (companyInput) => {
    setApprovalOpen(false);

    console.log('approving user', companyInput);

    for (let i = 0; i < companyList.length; i++) {
      // const element = companyList[i];

      if (companyList[i].name === companyInput) {
        // console.log('you matched', i);

        let companyId = i;

        companyId += 1;

        dispatch({
          type: 'SAGA_APPROVE_USER',
          payload: {
            pendingUserId: pendingUser.user_id,
            companyId: companyId,
          },
        });
      } else if (companyList[i].name !== companyInput) {
        console.log('hi');
      }
    }

    // dispatch({
    //   type: 'SAGA_APPROVE_USER',
    //   payload: {
    //     pendingUserId: pendingUser.user_id,
    //   },
    // });
  };

  const company = ['prime', 'not', 'fordor', 'facebook'];

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
            sx={{ m: 1, width: 500 }}
            options={company}
            getOptionLabel={(option) => option}
            // disableCloseOnSelect
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                // id="name"
                value={pendingUser.pending_company_name || 'Company name here'}
                name="text"
                type="text"
                label="Company name here"
                placeholder={
                  pendingUser.pending_company_name || 'Company name here'
                }
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit">Approve</Button>
          <Button onClick={handleApprovalClose}>Cancel</Button>
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
          <Button onClick={handleDeleteClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
}

export default PendingAdminPage;
