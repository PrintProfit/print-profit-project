import { Box } from '@mui/material';
import backgroundImage from '../../assets/printProfitBgFULL.png';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
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
          }}
        >
          <RegisterForm />
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterPage;
