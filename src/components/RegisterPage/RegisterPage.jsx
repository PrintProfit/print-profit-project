import { Box, Container } from '@mui/material';
import backgroundImage from '../../assets/printProfitBgFULL.png?h=768&format=webp';
import RegisterForm from '../RegisterForm/RegisterForm';

function RegisterPage() {
  return (
    <Box
      // classname="landingPageBox"
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
        <RegisterForm />
      </Container>
    </Box>
  );
}

export default RegisterPage;
