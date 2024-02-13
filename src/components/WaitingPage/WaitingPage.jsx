import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Box, Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
export default function WaitingPage() {
  const history = useHistory();

  return (
    <>
      <Box
        sx={{
          backgroundImage: "url('public/images/printProfitBgFull.png')",
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
            pb: 45,
          }}
        >
          <Box
            sx={{
              height: 'auto',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'primary.light',
              m: 4,
              padding: 0,
            }}
          >
            <Typography
              sx={{
                backgroundColor: '#12005C',
                color: 'white',
              }}
              variant="h4"
            >
              <h1>Thank you for Registering!</h1>
            </Typography>
            <Paper
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignText: 'center',
              }}
            >
              <Typography variant="h5">
                <p>Your Account should be approved in 24-48 hours.</p>
                <p>
                  If you have any questions or pressing concerns, please contact
                  here.
                </p>
                <p>Thank you for your Patience.</p>
              </Typography>
            </Paper>
          </Box>
          <Button onClick={() => history.push('/home')}>
            <ArrowBackIosIcon />
            <p>Home</p>
          </Button>
        </Box>
      </Box>
    </>
  );
}
