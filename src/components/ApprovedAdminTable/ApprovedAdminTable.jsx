import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ApprovedAdminPage({ approvedUser }) {
  const dispatch = useDispatch();

  const deleteUser = (params) => {
    // console.log('paramas', params);
    // dispatch({
    //     type: 'SAGA_FETCH_LEVEL_ENEMY',
    //     payload: params
    // });
  };

  return (
    <div className="approvedTable">
      <td>{approvedUser.name}</td>
      <td>{approvedUser.email}</td>
      <td>{approvedUser.companyName}</td>
      <td>again{approvedUser.name}</td>
      <td>Approved</td>
      <td>
        <button type="button" onClick={deleteUser}>
          Delete
        </button>
      </td>
    </div>
  );
}

export default ApprovedAdminPage;
