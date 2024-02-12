import emailjs from '@emailjs/browser';
import CreateIcon from '@mui/icons-material/Create';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

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

  const [openSnack, setOpenSnack] = useState(false);

  const companyList = useSelector((store) => store.user.companyList);

  // console.log(password.length);

  const handleSnackClick = () => {
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const templateParams = {
    to_name: name,
    to_email: email,
    to_password: password,
  };

  const adminCreateUser = (event) => {
    event.preventDefault();
    if (
      password !== confirmedPassword ||
      password === '' ||
      password === null ||
      password.length < 8
    ) {
      dispatch({ type: 'CREATE_USER_FAILED_PASSWORDS_DONT_MATCH' });
    } else if (
      email === '' ||
      name === '' ||
      email === null ||
      name === null ||
      companyName === '' ||
      companyName === null
    ) {
      dispatch({ type: 'CREATE_USER_FAILED' });
    } else {
      setOpenSnack(true);

      // emailjs
      //   .send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_ADMIN_CREATE_TEMPLATE_ID, templateParams, {
      //     publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      //   })
      //   .then(
      //     () => {
      //       console.log('SUCCESS!');
      //     },
      //     (error) => {
      //       console.log('FAILED...', error.text);
      //     },
      //   );

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
      dispatch({ type: 'CLEAR_CREATE_USER_ERROR' });
      setEmail('');
      setName('');
      setCompanyName('');
      setPassword('');
      setConfirmedPassword('');
    }
  };

  return (
    <Box className="adminCreateUserCss" textAlign={'center'} marginTop={'3%'}>
      <h2>
        {errors.adminCreateUserMessage === ''
          ? 'Enter new information to create a member!'
          : ''}
      </h2>
      {errors.adminCreateUserMessage && (
        <h3 id="createUserAlertId" className="alert" role="alert">
          {errors.adminCreateUserMessage}
        </h3>
      )}
      <Box
        className="adminCreateNewUserForm"
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection={'column'}
        sx={{
          '& > :not(style)': { m: 1, width: '30ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={adminCreateUser}
      >
        <TextField
          id="email"
          type="text"
          label="E-mail"
          variant="filled"
          value={email}
          // color={email === '' ? 'error' : ''}
          required
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          id="name"
          type="text"
          label="Full Name"
          variant="filled"
          value={name}
          // color={name === '' ? 'error' : ''}
          required
          onChange={(event) => setName(event.target.value)}
        />

        <Tooltip
          title='Click the "Add" button if you want to create a new company'
          placement="top"
          slotProps={{
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '-2.5px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: '0px',
                  },
              },
            },
          }}
        >
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
                color={
                  companyName === '' || companyName === null ? 'error' : ''
                }
                fullWidth
                variant="filled"
              />
            )}
          />
        </Tooltip>

        <Tooltip
          title={
            password.length < 8 ? 'password must be 8 or more characters' : ''
          }
          placement="top"
          slotProps={{
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '1px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: '0px',
                  },
              },
            },
          }}
        >
          <TextField
            id="password"
            type="password"
            label="Password"
            variant="filled"
            value={password}
            color={password.length < 8 && password !== '' ? 'error' : ''}
            // helperText={
            //   confirmedPassword !== password ? 'passwords do not match' : ''
            // }
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </Tooltip>

        <Tooltip
          title={
            confirmedPassword.length < 8
              ? 'password must be 8 or more characters'
              : ''
          }
          placement="top"
          slotProps={{
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '-1px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: '0px',
                  },
              },
            },
          }}
        >
          <TextField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            variant="filled"
            value={confirmedPassword}
            color={
              confirmedPassword.length < 8 && confirmedPassword !== ''
                ? 'error'
                : confirmedPassword !== password
                  ? 'error'
                  : ''
            }
            helperText={
              confirmedPassword !== password ? 'passwords do not match' : ''
            }
            required
            onChange={(event) => setConfirmedPassword(event.target.value)}
          />
        </Tooltip>

        <Box display="flex" justifyContent="center" alignItems="center">
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
      <Snackbar
        open={openSnack}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        message="A New Account Has Been Made"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Box>
  );
}

export default AdminCreateNewUser;
