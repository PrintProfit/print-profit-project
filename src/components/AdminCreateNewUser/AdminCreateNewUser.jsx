import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import CreateIcon from '@mui/icons-material/Create';

const filter = createFilterOptions();

function AdminCreateNewUser() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const companyList = useSelector((store) => store.user.companyList);

  const adminCreateUser = (event) => {
    event.preventDefault();
    if (password !== confirmedPassword) {
      dispatch({ type: 'REGISTRATION_FAILED_PASSWORDS_DONT_MATCH' });
    }
    console.log('creating user');

    // This should do what that for loop was trying to do
    // findIndex returns -1 when the item is not found
    const company = companyList.find(
      (company) => company.name === companyName.name,
    );
    if (company) {
      const companyId = company.id;

      dispatch({
        type: 'SAGA_ADMIN_POST_NEW_USER',
        payload: {
          companyId: companyId,
          email: email,
          name: name,
          password: password,
        },
      });
    } else {
      // console.log('company not found');

      dispatch({
        type: 'SAGA_ADMIN_POST_NEW_COMPANY_AND_USER',
        payload: {
          email: email,
          name: name,
          companyName: companyName.name,
          password: password,
        },
      });
    }
    setEmail('');
    setName('');
    setCompanyName('');
    setPassword('');
    setConfirmedPassword('');
  };

  return (
    <Box className="formPanel" textAlign={'center'} marginTop={'3%'}>
      <h2>Enter new information to create a member!</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={'column'}
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={adminCreateUser}
      >
        <TextField
          id="email"
          type="text"
          label="e-mail"
          variant="filled"
          value={email}
          required
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          id="name"
          type="text"
          label="Full Name"
          variant="filled"
          value={name}
          required
          onChange={(event) => setName(event.target.value)}
        />

        <Autocomplete
          value={companyName}
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setCompanyName({
                name: newValue,
              });
            } else if (newValue?.inputValue) {
              // Create a new value from the user input
              setCompanyName({
                name: newValue.inputValue,
              });
            } else {
              setCompanyName(newValue);
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
              required
              margin="dense"
              name="text"
              type="text"
              label="Company Name Here"
              placeholder={'Company Name Here'}
              fullWidth
              variant="filled"
            />
          )}
        />
        <TextField
          id="password"
          type="password"
          label="password"
          variant="filled"
          value={password}
          required
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          variant="filled"
          value={confirmedPassword}
          required
          onChange={(event) => setConfirmedPassword(event.target.value)}
        />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50%"
        >
          <Button
            variant="contained"
            type="submit"
            name="submit"
            value="Create New Account"
          >
            <CreateIcon /> Create New Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default AdminCreateNewUser;
