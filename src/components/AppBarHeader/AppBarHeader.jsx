import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const drawerWidth = 240;

export default function AppBarHeader() {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  // Check below link for info
  // https://mui.com/material-ui/react-app-bar/

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigationToMyAccountPage = () => {
    history.push('/my-account-page');
  };
  const handleLogOut = () => {
    // TODO: Add log out functionality
    history.push('/my-account-page');
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            {/* Text for AppBar Goes here */}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleNavigationToMyAccountPage}>
              My account
            </MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}
