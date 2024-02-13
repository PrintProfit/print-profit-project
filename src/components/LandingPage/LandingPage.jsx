import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoginForm from '../LoginForm/LoginForm.jsx';
import Header from '../UnprotectedRoutesHeader/Header.jsx';

function LandingPage() {
  const history = useHistory();
  return (
    <Box sx={{ overflow: 'hidden', height: '100vh' }}>
      <Box
        sx={{
          backgroundImage: "url('public/images/printProfitBgLanding2.png')",
          backgroundPosition: 'top',
          backgroundSize: 'cover',
          minWidth: '100%',
          backgroundRepeat: 'no-repeat',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignText: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'flex-end',
            pr: 10,
            width: '100%',
          }}
        >
          <Typography
            sx={{ pb: 0 }}
            variant="h1"
            color="white"
            fontFamily="Cormorant Variable"
            fontWeight="semibold"
          >
            Print Profit
          </Typography>
          <br />
          <Typography variant="h4" color="white" sx={{ alignText: 'center' }}>
            Transform how you do business
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '50%',
          }}
        >
          <img
            width={50}
            height={50}
            src="public/images/printProfitLogoV3.svg"
            alt="printProfitLogo"
          />
          <Box>
            <LoginForm />
          </Box>
        </Box>
      </Box>
      <Header />
    </Box>
  );
}

export default LandingPage;
