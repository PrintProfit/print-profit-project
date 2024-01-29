import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';

function AdminPage() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  });

  return (
    <div className="adminPage">
      <div>
        <h1>This about page is for admin to read!</h1>
        <p>{user.name}</p>
      </div>

      <div className="adminPendingTable">
        <h2>Pending Users</h2>

        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Company Name</th>
          <th>Last Login</th>
          <th>Status</th>
          <th>Delete</th>
        </thead>

        <tbody>
          {user.map((pendingUser) => {
            return (
              <div key={pendingUser.id}>
                <PendingAdminTable pendingUser={pendingUser} />
              </div>
            );
          })}
        </tbody>
      </div>

      <div className="adminUserTable">
        <h2>Approved Users</h2>

        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Company Name</th>
          <th>Last Login</th>
          <th>Status</th>
          <th>Delete</th>
        </thead>

        <tbody>
          {user.map((approvedUser) => {
            return (
              <div key={approvedUser.id}>
                <ApprovedAdminTable approvedUser={approvedUser} />
              </div>
            );
          })}
        </tbody>
      </div>
    </div>
  );
}

export default AdminPage;
