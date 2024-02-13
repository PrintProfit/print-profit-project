import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
export default function Header() {
  const history = useHistory();

  const handleNavigationToMyContactPage = () => {
    history.push('/contact');
  };

  const handleNavigationToMyAboutPage = () => {
    history.push('/about');
  };
  return (
    <AppBar color="secondary" position="static">
      <Toolbar>
        {/* Change font */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            pr: 10,
            width: '40%',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '20%', // adjust as needed
          }}
        >
          <Button
            onClick={handleNavigationToMyContactPage}
            disableRipple
            color="inherit"
          >
            About
          </Button>
          <Button
            onClick={handleNavigationToMyAboutPage}
            disableRipple
            color="inherit"
          >
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
