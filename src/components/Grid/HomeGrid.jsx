import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
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
            <HomeToolBox />
          </Item>
        </Grid>
        <Grid item xs>
          <Item>
            <HomeToolBox />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
