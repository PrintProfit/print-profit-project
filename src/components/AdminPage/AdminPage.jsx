import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminArchivedUsers from '../AdminArchivedUsers/AdminArchivedUsers';
import AdminView from '../AdminView/AdminView';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';

function AdminPage() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.currentUser);
  const pendingUsers = useSelector((store) => store.user.pendingUserReducer);
  const approvedUsers = useSelector((store) => store.user.approvedUserReducer);
  const companyList = useSelector((store) => store.user.companyList);

  const [value, setValue] = useState(0);

  /**
   *         <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Cost & Pricing tabs"
        >
          <Tab label="Pricing" {...a11yProps(0)} />
          <Tab label="History" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PricingTab />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoryTab />
      </TabPanel>
   */

  // useEffect(() => {
  //   dispatch({ type: 'FETCH_USER' });
  // }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_ADMIN_USERS_FOR_TABLE' });
  }, [dispatch]);

  // console.log('pending', pendingUsers);

  // console.log('approved', approvedUsers);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Cost & Pricing tabs"
          >
            <Tab label="Admin View" {...a11yProps(0)} />
            <Tab label="Archive" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <AdminView />
        </TabPanel>
        <TabPanel value={value} index={1}>
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
