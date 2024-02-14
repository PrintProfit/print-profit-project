import { Box, Paper } from '@mui/material';
import LoginForm from '../LoginForm/LoginForm';

function LoginPage() {
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
