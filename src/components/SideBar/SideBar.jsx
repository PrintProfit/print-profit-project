import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  styled,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import logo from '../../assets/printProfitLogoV3.svg';

const drawerWidth = 200;

export default function SideBar({ children }) {
  const history = useHistory();
  const location = useLocation();
  const user = useSelector((store) => store.user.currentUser);

  const handleNavigationHome = () => {
    history.push('/home');
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
        <div style={{ cursor: 'pointer' }} id="logo">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Will change to logo will deal with later */}
          <img
            width={200}
            height={150}
            onClick={handleNavigationHome}
            src={logo}
            alt="Print Profit Logo"
          />
        </div>

        <List sx={{ height: '100%', textAlign: 'center' }}>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/home'}
              component={Link}
              to={'/home'}
              sx={{
                textAlign: 'center',
                // textDecoration:
                //   location.pathname === '/home' ? 'underline' : 'none',
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
                // textDecoration:
                //   location.pathname === '/cost-and-pricing'
                //     ? 'underline'
                //     : 'none',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            >
              <SidebarListItemText
                disableTypography
                primary={<Typography>Cost and Pricing</Typography>}
              />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/tool-two'}
              component={Link}
              to={'/tool-two'}
              sx={{
                textAlign: 'center',
                // textDecoration:
                //   location.pathname === '/tool-two' ? 'underline' : 'none',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            >
              <SidebarListItemText
                disableTypography
                primary={<Typography>Profit Metrics</Typography>}
              />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/tool-three'}
              component={Link}
              to={'/tool-three'}
              sx={{
                textAlign: 'center',
                // textDecoration:
                //   location.pathname === '/tool-three' ? 'underline' : 'none',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            >
              <SidebarListItemText
                disableTypography
                primary={<Typography>Decision Making</Typography>}
              />
            </ListItemButton>
          </ListItem>
          <Divider />

          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/about'}
              component={Link}
              to={'/about'}
              sx={{
                textAlign: 'center',
                // textDecoration:
                //   location.pathname === '/about' ? 'underline' : 'none',
                '&.Mui-selected': {
                  color: 'black',
                },
              }}
            >
              <SidebarListItemText
                disableTypography
                primary={
                  <Typography sx={{ fontWeight: 'bold' }}>About</Typography>
                }
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
                <ListItemButton
                  component={Link}
                  to="/admin"
                  selected={location.pathname === '/admin'}
                  sx={{
                    textAlign: 'center',
                    textDecoration: 'bold',
                    // textDecoration:
                    //   location.pathname === '/home' ? 'underline' : 'none',
                    '&.selected': {
                      color: 'black',
                    },
                  }}
                >
                  <SidebarListItemText
                    disableTypography
                    primary={
                      <Typography sx={{ fontWeight: 'bold' }}>Admin</Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}

          <Divider />
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/contact"
              selected={location.pathname === '/contact'}
            >
              <SidebarListItemText
                disableTypography
                primary={
                  <Typography sx={{ fontWeight: 'bold' }}>Contact</Typography>
                }
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

const SidebarListItemText = styled(ListItemText)(({ theme }) => ({
  textAlign: 'center',
  color: '#646765',
}));
