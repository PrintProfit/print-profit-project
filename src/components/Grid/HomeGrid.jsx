import { Box, Grid, Paper, styled } from '@mui/material';
import * as React from 'react';
import HomeToolBox from '../HomeToolBox/HomeToolBox';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
          <Item>
            <Box>
              <Box border={3}>
                <h2>Profit metrics</h2>
              </Box>
              <Box marginTop={1} border={2} padding={1}>
                <p>
                  See shop labor and material costs over time in this data
                  visualizer.
                </p>
              </Box>
              <h3>Video demo</h3>
            </Box>
          </Item>
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
