import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  const history = useHistory();

  return (
    <Box
      classname="landingPageBox"
      sx={{
        backgroundImage: "url('public/images/printProfitBgFull.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        margin: 0,
      }}
    >
      <Container paddingTop={4}>
        <RegisterForm />
      </Container>
    </Box>
  );
}

export default RegisterPage;
