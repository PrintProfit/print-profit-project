import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
export default function WaitingPage() {
  const history = useHistory();

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
          height: '100vh',
          border: 2,
          borderColor: 'green',
        }}
      >
        <h1>Thank you for Registering!</h1>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'primary.light',
          }}
        >
          <p>Your Account should be approved in 24-48 hours.</p>
          <p>
            If you have any questions or pressing concerns, please contact here
            (Link)
          </p>
          <p>Thank you for your Patience.</p>
        </Box>
        <Button onClick={() => history.push('/home')}>
          <ArrowBackIosIcon />
          <p>Home</p>
        </Button>
      </Box>
    </div>
  );
}
