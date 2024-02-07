import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

const drawerWidth = 200;
/**
 * TODO: Create map for sidebar items
 */

export default function SideBar({ children }) {
  const history = useHistory();
  const user = useSelector((store) => store.user.currentUser);

  const handleNavigationHome = () => {
    history.push('/user');
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
          <h3>User tools</h3>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/cost-and-pricing">
              <ListItemText
                primary="Cost and pricing"
                sx={{ textAlign: 'center', color: 'primary.contrastText' }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tool-two">
              <ListItemText
                primary="Tool 2"
                sx={{ textAlign: 'center', color: 'primary.contrastText' }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tool-three">
              <ListItemText
                primary="Tool 3"
                sx={{ textAlign: 'center', color: 'primary.contrastText' }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/about">
              <ListItemText
                primary="About"
                sx={{ textAlign: 'center', color: 'primary.contrastText' }}
              />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
        <List
          sx={{
            position: 'absolute',
            bottom: '0',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {user.is_admin && (
            <>
              <Divider />
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/admin">
                  <ListItemText
                    primary="Admin"
                    sx={{ textAlign: 'center', color: 'primary.contrastText' }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/contact">
              <ListItemText
                primary="Contact"
                sx={{ textAlign: 'center', color: 'primary.contrastText' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
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
