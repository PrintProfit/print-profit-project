import { Box, Container } from '@mui/material';
import backgroundImage from '../../assets/printProfitBgFULL.png?h=768&format=webp';
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
    >
      <Container paddingTop={4}>
        <LoginForm />
      </Container>
    </Box>
  );
}

export default LoginPage;
