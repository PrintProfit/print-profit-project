import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: "url('public/images/printProfitBg.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          margin: 0,
        }}
      >
        <Box
          direction="column"
          alignItems="center"
          sx={{
            minHeight: '100vh',
            marginLeft: 'auto',
            marginRight: 17,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RegisterForm />
        </Box>
      </Box>
    </>
  );
}

export default LandingPage;
