import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminArchivedUsers from '../AdminArchivedUsers/AdminArchivedUsers';
import AdminCreateNewUser from '../AdminCreateNewUser/AdminCreateNewUser';
import AdminView from '../AdminView/AdminView';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';
import './adminPage.css';

function AdminPage() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.currentUser);
  const pendingUsers = useSelector((store) => store.user.pendingUserReducer);
  const approvedUsers = useSelector((store) => store.user.approvedUserReducer);
  const companyList = useSelector((store) => store.user.companyList);

  const [value, setValue] = useState(0);

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_ADMIN_USERS_FOR_TABLE' });
  }, [dispatch]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="admin tabs">
            <Tab label="Admin View" {...a11yProps(0)} />
            <Tab label="Create New Account" {...a11yProps(1)} />
            <Tab label="Archive" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <AdminView />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AdminCreateNewUser />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AdminArchivedUsers />
        </TabPanel>
      </Box>
    </div>
  );
}
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

/**
 * @param {number} index
 */
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default AdminPage;
