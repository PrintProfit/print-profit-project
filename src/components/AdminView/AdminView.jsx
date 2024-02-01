import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminArchivedUsers from '../AdminArchivedUsers/AdminArchivedUsers';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';

export default function AdminView() {
  const user = useSelector((store) => store.user.currentUser);
  const pendingUsers = useSelector((store) => store.user.pendingUserReducer);
  const approvedUsers = useSelector((store) => store.user.approvedUserReducer);
  const companyList = useSelector((store) => store.user.companyList);
  return (
    <div>
      <p>Admin View</p>
      <div>
        <h1>This about page is for admin to read!</h1>
        <p>{user.name}</p>
      </div>

      <h2>Pending Users || {pendingUsers.length}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company Name</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {pendingUsers.map((pendingUser) => {
            return (
              <PendingAdminTable
                key={pendingUser.user_id}
                pendingUser={pendingUser}
              />
            );
          })}
        </tbody>
      </table>

      <h2>Approved Users || {approvedUsers.length}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Company Name</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {approvedUsers.map((approvedUser) => {
            return (
              <ApprovedAdminTable
                key={approvedUser.user_id}
                approvedUser={approvedUser}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
