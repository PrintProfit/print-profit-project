import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  const history = useHistory();

  return (
    <Box paddingTop={4}>
      <RegisterForm />
      <center>
        <Button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
      </center>
    </Box>
  );
}

export default RegisterPage;
