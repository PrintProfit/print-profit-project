import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import HomeGrid from '../Grid/HomeGrid';

function Homepage() {
  const user = useSelector((store) => store.user.currentUser);

  return (
    <>
      <Box>
        <HomeGrid />
      </Box>
    </>
  );
}

// this allows us to use <App /> in index.js
export default Homepage;
