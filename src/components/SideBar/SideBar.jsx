import { Typography, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';

const drawerWidth = 200;

const sidebarItems = [
  { label: 'C&P', path: '/cost-and-pricing', index: 0 },
  { label: 'Tool 2', path: '/tool-two', index: 1 },
  { label: 'Tool 3', path: '/tool-three', index: 2 },
  { label: 'About/Contact', path: '/about', index: 3 },
];

export default function SideBar({ children }) {
  const history = useHistory();
  const location = useLocation();
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

        {/* START HERE */}

        <List sx={{ height: '100%', textAlign: 'center' }}>
          {/* START HERE */}

          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/user'}
              component={Link}
              to={'/user'}
              sx={{
                textAlign: 'center',
                textDecoration:
                  location.pathname === '/user' ? 'underline' : 'none',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            >
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
            <ListItemButton
              selected={location.pathname === '/cost-and-pricing'}
              component={Link}
              to={'/cost-and-pricing'}
              sx={{
                textAlign: 'center',
                textDecoration:
                  location.pathname === '/cost-and-pricing'
                    ? 'underline'
                    : 'none',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            >
              <SidebarListItemText
                disableTypography
                primary={
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Cost and Pricing
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          {/* <ListItem disablePadding>
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
          </ListItem> */}
          <Divider />
          {/*
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
        */}
        </List>

        {/* END HERE */}
      </Drawer>

      {/* <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          paddingTop: '64px',
        }}
      >
        {children}
      </Box> */}
    </Box>
  );
}

const SidebarListItemText = styled(ListItemText)(({ theme }) => ({
  textAlign: 'center',
  color: '#646765',
}));
