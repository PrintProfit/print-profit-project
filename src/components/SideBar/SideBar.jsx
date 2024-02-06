import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

const drawerWidth = 200;

const sidebarItems = [
  { label: 'C&P', path: '/cost-and-pricing', index: 0 },
  { label: 'Tool 2', path: '/tool-two', index: 1 },
  { label: 'Tool 3', path: '/tool-three', index: 2 },
  { label: 'About/Contact', path: '/about', index: 3 },
];

export default function SideBar({ children }) {
  const location = useLocation();
  const history = useHistory();
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
          <h3>Tools Header</h3>
          {sidebarItems.map((item) => {
            return (
              <Box>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      textAlign: 'center',
                      color:
                        location.pathname === item.path
                          ? 'primary.main'
                          : 'primary.contrastText',
                      textDecoration:
                        location.pathname === item.path ? 'underline' : 'none',
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              </Box>
            );
          })}
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
