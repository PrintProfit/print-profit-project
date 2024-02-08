import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm';

function LoginPage() {
  const history = useHistory();

  return (
    <Box
      sx={{
        backgroundImage: 'url(public/images/printProfitBgFULL.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        margin: 0,
      }}
    >
      <Container paddingTop={4}>
        <LoginForm />
      </Container>
    </Box>
  );
}

export default LoginPage;
