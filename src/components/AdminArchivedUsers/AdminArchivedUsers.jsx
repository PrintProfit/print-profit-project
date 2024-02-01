import { useDispatch, useSelector } from 'react-redux';
import ArchivedAdminTable from '../ArchivedAdminTable/ArchivedAdminTable';

export default function AdminArchivedUsers() {
  const archivedUsers = useSelector((store) => store.user.archivedUserReducer);

  return (
    <>
      <h2>Archived Users || {archivedUsers.length}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {archivedUsers.map((archivedUser) => {
            return (
              <ArchivedAdminTable
                key={archivedUser.user_id}
                archivedUser={archivedUser}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
