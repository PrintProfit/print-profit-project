import { AccountCircle, Email, LocationOn } from '@mui/icons-material';
import { Card, CardContent, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

export default function ContactPage() {
  return (
    <Grid
      paddingTop={8}
      container
      spacing={3}
      justifyContent="center"
      alignItems="center"
    >
      <Card>
        <CardContent>
          <AccountCircle />
          <Typography variant="h6">Contact</Typography>
          <Typography variant="body2">Software Engineer</Typography>
          <Button>Contact</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Email />
          <Typography variant="h6">john.doe@example.com</Typography>
          <Typography variant="body2">Contact Email</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <LocationOn />
          <Typography variant="h6">New York, USA</Typography>
          <Typography variant="body2">Location</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
