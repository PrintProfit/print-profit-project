import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

const drawerWidth = 200;

const sidebarItems = [
  { label: 'C&P', path: '/cost-and-pricing', index: 0 },
  { label: 'Tool 2', path: '/tool-two', index: 1 },
  { label: 'Tool 3', path: '/tool-three', index: 2 },
  { label: 'About/Contact', path: '/about', index: 3 },
];

export default function SideBar({ children }) {
  const history = useHistory();
  const [selectedListItem, setSelectedListItem] = useState(0);
  // console.log('index:', selected);

  //  useEffect(() => {
  //     console.log('index:', selectedListItem);

  //  }, [selectedListItem]);
  const handleNavigationHome = () => {
    history.push('/user');
  };

  const handleClick = (index) => {
    console.log('index:', index);
    setSelectedListItem(index);
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
                <ListItem
                  disablePadding
                  // style={{
                  //   backgroundColor:
                  //     selected === index ? 'lightgray' : 'transparent',
                  //   textDecoration: selected === index ? 'underline' : 'none',
                  // }}
                >
                  <ListItemButton
                    onClick={() => handleClick(item.index)}
                    component={Link}
                    to={item.path}
                  >
                    <ListItemText
                      primary={item.label}
                      sx={{
                        textAlign: 'center',
                        color:
                          selectedListItem === item.index
                            ? 'primary.main'
                            : 'primary.contrastText',
                        textDecoration:
                          selectedListItem === item.index
                            ? 'underline'
                            : 'none',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Box>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
}

// return(
// <ListItem
//   key={index}
//   disablePadding
//   sx={{
//     Color: selected === index ? 'primary.main' : 'yellow',
//     textDecoration: selected === index ? 'underline' : 'none',
//   }}
// >
//   <ListItemButton component={Link} to={item.path} onClick={() => handleClick(index)}>
//     <ListItemText
//       primary={item.label}
//       sx={{
//         textAlign: 'center',
//         Color: selected === index ? 'primary.main' : 'yellow',
//         textDecoration: selected === index ? 'underline' : 'none',
//       }}

//     />
//   </ListItemButton>
// </ListItem>

// ))}

//           </ListItem>
//         </List>

//       </Drawer>

//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           bgcolor: 'background.default',
//           p: 3,
//           paddingTop: '64px',
//         }}
//       >
//         {children}
//       </Box>
//     </Box>
//   );
// }

// <Box sx={{ display: 'flex' }}>
//   <Drawer
//     sx={{
//       width: drawerWidth,
//       flexShrink: 0,
//       '& .MuiDrawer-paper': {
//         width: drawerWidth,
//         boxSizing: 'border-box',
//       },
//     }}
//     variant="permanent"
//     anchor="left"
//   >
//     <div style={{ cursor: 'pointer' }}>
//       {/* biome-ignore lint/a11y/useKeyWithClickEvents: Will change to logo will deal with later */}
//       <img
//         width={200}
//         height={150}
//         onClick={handleNavigationHome}
//         src="public/images/printProfitLogoV2.svg"
//         alt="printProfitLogo"
//       />
//     </div>

//     <List sx={{ height: '100%', textAlign: 'center' }}>
//       <h3>Tools Header</h3>

//       <ListItem
//         disablePadding
//         style={{
//           backgroundColor: selected === index ? 'lightgray' : 'transparent',
//           textDecoration: selected === index ? 'underline' : 'none',
//         }}
//       >
//         <ListItemButton component={Link} to="/cost-and-pricing">
//           <ListItemText
//             primary="C&P"
//             sx={{ textAlign: 'center', color: 'primary.contrastText' }}
//           />
//         </ListItemButton>
//       </ListItem>
//       <Divider />

//       <ListItem disablePadding>
//         <ListItemButton component={Link} to="/tool-two">
//           <ListItemText
//             primary="Tool 2"
//             sx={{ textAlign: 'center', color: 'primary.contrastText' }}
//           />
//         </ListItemButton>
//       </ListItem>
//       <Divider />

//       <ListItem disablePadding>
//         <ListItemButton component={Link} to="/tool-three">
//           <ListItemText
//             primary="Tool 3"
//             sx={{ textAlign: 'center', color: 'primary.contrastText' }}
//           />
//         </ListItemButton>
//       </ListItem>
//       <Divider />

//       <ListItem disablePadding>
//         <ListItemButton component={Link} to="/about">
//           <ListItemText
//             primary="About/Contact"
//             sx={{ textAlign: 'center', color: 'primary.contrastText' }}
//           />
//         </ListItemButton>
//       </ListItem>
//     </List>
//     <Divider />
//   </Drawer>
//   <Box
//     component="main"
//     sx={{
//       flexGrow: 1,
//       bgcolor: 'background.default',
//       p: 3,
//       paddingTop: '64px',
//     }}
//   >
//     {children}
//   </Box>
// </Box>
//   );
// }

//     {/* <ListItem disablePadding>
//       <ListItemButton component={Link} to="/about">
//         <ListItemText
//           primary="About/Contact"
//           sx={{ textAlign: 'center', color: 'primary.contrastText' }}
//         />
//       </ListItemButton>
