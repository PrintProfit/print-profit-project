import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';

const drawerWidth = 200;
/**
 * TODO: Create Style for all List and ListItems in the SideBar
 */

export default function SideBar({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();

  const handleNavigationHome = () => {
    history.push('/user');
  };

  const handleMenu = (event) => {
    console.log('handleMenu');
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    console.log('handleMenu');
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <div style={{ cursor: 'pointer' }}>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Will change to logo will deal with later */}
          <img
            width={200}
            height={150}
            onClick={handleNavigationHome}
            src="public/images/printProfitLogoV2.svg"
            alt="printProfitLogo"
          />
        </div>

        <List sx={{ height: '100%', textAlign: 'center' }}>
          <h3>Tools Header</h3>
          <ListItem sx={{ height: '15%' }} disablePadding>
            <ListItemButton component={Link} to="/cost-and-pricing">
              <ListItemText primary="C&P" sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>

          <ListItem sx={{ height: '15%' }} disablePadding>
            <ListItemButton component={Link} to="/tool-two">
              <ListItemText primary="Tool 2" sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>

          <ListItem sx={{ height: '15%' }} disablePadding>
            <ListItemButton component={Link} to="/tool-three">
              <ListItemText primary="Tool 3" sx={{ textAlign: 'center' }} />
            </ListItemButton>
          </ListItem>

          <ListItem sx={{ height: '15%' }} disablePadding>
            <ListItemButton component={Link} to="/about">
              <ListItemText
                primary="About/Contact"
                sx={{ textAlign: 'center' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          paddingTop: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
