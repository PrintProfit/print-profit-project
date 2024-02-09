import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
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
      // why does Container cetner but Box doesnt??
    >
      <Box
        className="landingPageLoginBox"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto',
        }}
      >
        <Paper sx={{ width: 400 }}>
          <LoginForm />
        </Paper>
      </Box>
    </Box>
  );
}

export default LoginPage;
