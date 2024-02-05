import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = (event) => {
    event.preventDefault();
    if (password !== confirmedPassword) {
      dispatch({ type: 'REGISTRATION_FAILED_PASSWORDS_DONT_MATCH' });
    }

    dispatch({
      type: 'REGISTER',
      payload: {
        email: email,
        name: name,
        companyName: companyName,
        password: password,
      },
    });
    history.push('/waiting-page');
  }; // end registerUser

  return (
    <Box>
      <form className="formPanel" onSubmit={registerUser}>
        <h2>Enter your information to become a member!</h2>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="email"
            type="text"
            label="e-mail"
            variant="outlined"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            id="name"
            type="text"
            label="Full Name"
            variant="outlined"
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            id="companyName"
            type="text"
            label="Company Name"
            variant="outlined"
            value={companyName}
            required
            onChange={(event) => setCompanyName(event.target.value)}
          />
          <TextField
            id="password"
            type="password"
            label="password"
            variant="outlined"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            variant="outlined"
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
              value="Register"
            >
              Register
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default RegisterForm;
