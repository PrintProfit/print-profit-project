import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

export default function ContactPage() {
  const ToolCard = styled(Card)(({ theme }) => ({
    borderRadius: 10,
    height: 'auto',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    ':hover': {
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
      transform: 'scale(1.05)',
    },
    m: 4,
    padding: 0,
  }));

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <ToolCard
          sx={{
            m: 1.5,
            width: '30%',
            height: '250px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CardHeader
            title="Print Profit Team"
            sx={{
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.06)',
              color: 'white',
              textAlign: 'center',
              backgroundColor: 'primary.main',
              display: 'flex',
              width: '100%',
              m: 0,
            }}
          />
          <CardContent>
            <Typography variant="h5">Email: nick@printprofit.com</Typography>
          </CardContent>
        </ToolCard>
      </Box>
    </>
  );
}
