import { Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
            src="public/images/printProfitLogoV3.svg"
            alt="printProfitLogo"
          />
        </div>

        <List sx={{ height: '100%', textAlign: 'center' }}>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user">
              <SidebarListItemText
                disableTypography
                primary={
                  <Typography sx={{ fontWeight: 'bold' }}>
                    User Tools
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/cost-and-pricing">
              <SidebarListItemText primary="Cost and pricing" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tool-two">
              <SidebarListItemText primary="Profit metrics" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/tool-three">
              <SidebarListItemText primary="Decision making" />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/about">
              <SidebarListItemText primary="About" />
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
                  <SidebarListItemText primary="Admin" />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <Divider />
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/contact">
              <SidebarListItemText primary="Contact" />
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

const SidebarListItemText = styled(ListItemText)(({ theme }) => ({
  textAlign: 'center',
  color: '#646765',
}));
