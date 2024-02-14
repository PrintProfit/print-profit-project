import '@fontsource-variable/cormorant';
import {
  AccountCircle as AccountCircleIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const drawerWidth = 200;

export default function AppBarHeader() {
  const history = useHistory();
  const user = useSelector((store) => store.user.currentUser);
  const [anchorEl, setAnchorEl] = useState(null);
  // Check below link for info
  // https://mui.com/material-ui/react-app-bar/

  const dispatch = useDispatch();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigationToMyAdminPage = () => {
    history.push('/admin');
  };
  const handleNavigationToMyAccountPage = () => {
    history.push('/my-account-page');
  };

  const handleNavigationToTools = () => {
    history.push('/home');
  };
  const handleLogOut = () => {
    dispatch({ type: 'LOGOUT' });

    history.push('/home');
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Text for AppBar */}
          <Typography
            variant="h4"
            noWrap
            // component="div"
            // fontWeight="bold"
            textAlign={'center'}
            sx={{
              flexGrow: 1,
              fontSize: 43,
              color: 'white',
              textDecoration: 'none',
            }}
            fontFamily="Cormorant Variable"
            fontWeight="semibold"
            component={Link}
            to="/home"
          >
            Print Profit
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user.is_admin ? <AdminPanelSettingsIcon /> : <AccountCircleIcon />}
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
            {/* conditionally renders an "admin" menu item if the current user is authorized as an admin */}
            {user.is_admin && (
              <MenuItem onClick={handleNavigationToMyAdminPage}>Admin</MenuItem>
            )}
            <MenuItem onClick={handleNavigationToMyAccountPage}>
              My account
            </MenuItem>
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}
