import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApprovedAdminTable from '../ApprovedAdminTable/ApprovedAdminTable';
import PendingAdminTable from '../PendingAdminTable/PendingAdminTable';

function AdminPage() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user.currentUser);
  const pendingUsers = useSelector((store) => store.user.pendingUserReducer);
  const approvedUsers = useSelector((store) => store.user.approvedUserReducer);
  const companyList = useSelector((store) => store.user.companyList);

  // useEffect(() => {
  //   dispatch({ type: 'FETCH_USER' });
  // }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'SAGA_FETCH_ADMIN_USERS_FOR_TABLE' });
  }, [dispatch]);

  // console.log('pending', pendingUsers);

  // console.log('approved', approvedUsers);

  return (
    <div>
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

      {/* {companyList.map((company) => {
        return <p key={company.id}>{company.name}</p>;
      })} */}
    </div>
  );
}

export default AdminPage;
