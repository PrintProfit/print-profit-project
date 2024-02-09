import { Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

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
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <form onSubmit={login}>
          <h2>Login</h2>

          {errors.loginMessage && (
            <h3 className="alert" role="alert">
              {errors.loginMessage}
            </h3>
          )}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 1,
            }}
          >
            <TextField
              sx={{
                marginBottom: 1,
              }}
              id="email"
              type="text"
              label="e-mail"
              variant="outlined"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              sx={{
                marginBottom: 1,
              }}
              id="password"
              type="password"
              label="password"
              variant="outlined"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button onClick={login} variant="contained" type="submit">
              Login
            </Button>
          </Box>
        </form>
        <Button
          onClick={() => {
            history.push('/registration');
          }}
        >
          Register
        </Button>
      </Box>
    </>
  );
}

export default LoginForm;
