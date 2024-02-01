import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

/**
 * 
 * 
 <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justifyContent="center"
  sx={{ minHeight: '100vh' }}
>
  <Grid item xs={3}>
    <LoginForm />
  </Grid>
</Grid>
 */

import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <h2>Print Profit</h2>

      <RegisterForm />

      <div>
        <h4>Already a Member?</h4>
        <Button type="button" onClick={onLogin}>
          Login
        </Button>
      </div>
    </Grid>
  );
}

export default LandingPage;
