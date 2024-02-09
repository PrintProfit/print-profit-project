import { Box } from '@mui/material';
import printProfitBg from '../../assets/printProfitBg.png?h=768&format=webp';
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  return (
    <div>
      <Box
        // className="landingPageBox"
        sx={{
          backgroundImage: `url(${printProfitBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
          display: 'flex',
          margin: 0,
        }}
      >
        <Box
          // direction="column"
          alignItems="center"
          sx={{
            minHeight: '100vh',
            marginLeft: 'auto',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RegisterForm />
        </Box>
      </Box>
    </div>
  );
}

export default LandingPage;
