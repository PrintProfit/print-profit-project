import { ArrowBackIos } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import backgroundImage from '../../assets/printProfitBgLoginFULLv2.png';

export default function WaitingPage() {
  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
      }}
    >
      <Box>
        <Card raised>
          <CardHeader
            title="Thank you for Registering!"
            titleTypographyProps={{
              variant: 'h4',
              fontWeight: 600,
              textAlign: 'center',
            }}
          />
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography>
              Your account should be approved in 24-48 hours.
            </Typography>
            <Typography>
              If you have any questions or pressing concerns, please contact
              here.
            </Typography>
            <Typography>Thank you for your Patience.</Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/home"
              startIcon={<ArrowBackIos />}
            >
              Home
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
