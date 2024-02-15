import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Paper,
  Typography,
  styled,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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

// Kinda want these to be cards instead of boxes
export default function HomeGrid() {
  const history = useHistory();
  const navigateToCostPricingTool = () => {
    history.push('/cost-and-pricing');
  };
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h2" sx={{ pb: 30, pt: 2 }}>
          Welcome to User Tools!
        </Typography>
      </Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            height: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ToolCard
            onClick={navigateToCostPricingTool}
            sx={{ m: 1.5, width: '30%' }}
          >
            <CardHeader
              title="Cost & Pricing Tool"
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
            <CardContent sx={{ textAlign: 'center' }}>
              <p>
                Keep track of multi-product order labor and material costs and
                calculate profit margins, all in one place.
              </p>
            </CardContent>
            <CardActions sx={{ padding: 0 }}>
              <Button disabled sx={{ width: '100%', height: 'auto' }}>
                Video demo
              </Button>
            </CardActions>
          </ToolCard>

          <ToolCard sx={{ m: 1.5, width: '30%' }}>
            <CardHeader
              title="Profit Metrics Tool"
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
            <CardContent sx={{ textAlign: 'center' }}>
              <p>
                See shop labor and material costs over time in this data
                visualizer.
              </p>
            </CardContent>
            <CardActions sx={{ padding: 0 }}>
              <Button disabled sx={{ width: '100%', height: 'auto' }}>
                Video demo
              </Button>
            </CardActions>
          </ToolCard>

          <ToolCard sx={{ m: 1.5, width: '30%' }}>
            <CardHeader
              title="Decision Making"
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
            <CardContent sx={{ textAlign: 'center' }}>
              <p>
                Simplify complex decision-making with this customizable tool.
              </p>
            </CardContent>
            <CardActions sx={{ padding: 0 }}>
              <Button disabled sx={{ width: '100%', height: 'auto' }}>
                Video demo
              </Button>
            </CardActions>
          </ToolCard>
        </Box>
      </Box>
    </>
  );
}
