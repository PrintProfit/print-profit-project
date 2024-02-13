import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import React from 'react';

import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  return (
    <>
      <Box
        sx={{
          backgroundImage: "url('public/images/printProfitBgFull.png')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          margin: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pb: 45,
          }}
        >
          <RegisterForm />
        </Box>
      </Box>
    </>
  );
}

export default RegisterPage;
