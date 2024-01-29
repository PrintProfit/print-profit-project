import { Box, Button } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user);
  return (
    <Box>
      <Button>hey there</Button>
      <div className="container">
        <h2>Welcome, {user.username}!</h2>
        <p>Your ID is: {user.id}</p>
        <LogOutButton className="btn" />
      </div>
    </Box>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
