import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function PendingAdminPage({ pendingUser }) {
  const dispatch = useDispatch();

  const approveUser = (params) => {
    // console.log('paramas', params);
    // dispatch({
    //     type: 'SAGA_FETCH_LEVEL_ENEMY',
    //     payload: params
    // });
  };

  const deleteUser = (params) => {
    // console.log('paramas', params);
    // dispatch({
    //     type: 'SAGA_FETCH_LEVEL_ENEMY',
    //     payload: params
    // });
  };

  return (
    <div className="pendingTable">
      <td>{pendingUser.name}</td>
      <td>{pendingUser.email}</td>
      <td>{pendingUser.companyName}</td>
      <td>again{pendingUser.name}</td>
      <td>
        <button type="button" onClick={approveUser}>
          Approve
        </button>
      </td>
      <td>
        <button type="button" onClick={deleteUser}>
          Delete
        </button>
      </td>
    </div>
  );
}

export default PendingAdminPage;
