import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (email && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: email,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  /**
   * TODO: Will need to handle what happens if a user tries to login but is not approved
   */

  return (
    <Box>
      <form className="formPanel" onSubmit={login}>
        <h2>Login</h2>
        {errors.loginMessage && (
          <h3 className="alert" role="alert">
            {errors.loginMessage}
          </h3>
        )}
        <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}>
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
            id="password"
            type="password"
            label="password"
            variant="outlined"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        </Box>
        <Button onClick={login} variant="contained">
          Login
        </Button>
      </form>
    </Box>
  );
}

export default LoginForm;
