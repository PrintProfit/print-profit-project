import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';
import React, { useState } from 'react';
import LoginForm from '../LoginForm/LoginForm.jsx';
import Header from '../UnprotectedRoutesHeader/Header.jsx';

function LandingPage() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: "url('public/images/printProfitBg.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          // minWidth: '70%',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <Box sx={{ display: 'flex', paddingRight: '9%' }}>
          <LoginForm />
        </Box>
      </Box>
    </>
  );
}

export default LandingPage;
