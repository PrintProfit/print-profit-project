import { Box, Paper, Typography } from '@mui/material';
import backgroundImage from '../../assets/printProfitBgLoginFULL.png';
import LoginForm from '../LoginForm/LoginForm';

function LoginPage() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
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
      <Box
        sx={{
          position: 'fixed',
          bottom: 5,
          width: '100%',
          height: 'auto',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" align="center">
          Print Profit
        </Typography>
        <Typography variant="h4">Transform how you do business.</Typography>
      </Box>
    </Box>
  );
}

export default LoginPage;
