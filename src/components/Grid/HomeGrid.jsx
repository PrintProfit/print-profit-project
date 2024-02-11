import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Paper,
  styled,
} from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import * as React from 'react';
import HomeToolBox from '../HomeToolBox/HomeToolBox';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const ToolCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  borderRadius: 10,
  height: 'auto',
  boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  ':hover': {
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
    transform: 'scale(1.05)',
  },
  padding: 0,
}));

// Kinda want these to be cards instead of boxes
export default function HomeGrid() {
  return (
    <Box sx={{ flexGrow: 1, paddingTop: 35 }}>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs>
          <Item>
            <HomeToolBox />
          </Item>
        </Grid>
        <Grid item xs>
          <ToolCard>
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
            <CardContent marginTop={1} padding={1} sx={{ textAlign: 'center' }}>
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
        </Grid>
        <Grid item xs>
          <Item>
            <Box>
              <Box border={3}>
                <h2>Decision making</h2>
              </Box>
              <Box marginTop={1} border={2} padding={1}>
                <p>
                  Simplify complex decision-making with this customizable tool.
                </p>
              </Box>
              <h3>Video demo</h3>
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
