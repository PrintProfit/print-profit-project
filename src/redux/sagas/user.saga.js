import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

// Grabs current user that inner joins with company table
function* fetchProfilePageUser() {
  // console.log('action.payload', action.payload);
  try {
    const profilePageUserResponse = yield axios.get('/api/user/profile/page');
    yield put({
      type: 'SET_PROFILE_PAGE_USER',
      payload: profilePageUserResponse.data,
    });
  } catch (error) {
    console.log('fetchProfilePageUser error:', error);
  }
}

// This will grab all the users and company for admin page
function* fetchAdminUsers() {
  // console.log('action.payload', action.payload);
  try {
    const pendingUserResponse = yield axios.get('/api/user/pending');
    const approvedUseResponse = yield axios.get('/api/user/approved');
    const companyResponse = yield axios.get('/api/user/company');
    yield put({
      type: 'SET_PENDING_USERS',
      payload: pendingUserResponse.data,
    });
    yield put({
      type: 'SET_APPROVED_USERS',
      payload: approvedUseResponse.data,
    });
    yield put({
      type: 'SET_COMPANY_LIST',
      payload: companyResponse.data,
    });
  } catch (error) {
    console.log('fetchAdminUsers error:', error);
  }
}

// put route to approve user to /api/user/approve/user
function* approveUser(action) {
  // console.log('action.payload', action.payload);
  try {
    const response = yield axios({
      method: 'PUT',
      url: '/api/user/approve',
      data: action.payload,
    });
    yield put({
      type: 'SAGA_FETCH_ADMIN_USERS_FOR_TABLE',
    });
  } catch (error) {
    console.log('Unable to put approval to server', error);
  }
}

function* softDeleteUser(action) {
  // console.log('action.payload', action.payload);
  try {
    const response = yield axios({
      method: 'PUT',
      url: '/api/user/delete/soft',
      data: action.payload,
    });
    yield put({
      type: 'SAGA_FETCH_ADMIN_USERS_FOR_TABLE',
    });
  } catch (error) {
    console.log('Unable to put soft delete to server', error);
  }
}

function* postNewCompany(action) {
  console.log('action', action.payloaad);
  try {
    const companyResponse = yield axios({
      method: 'POST',
      url: '/api/user/company',
      data: action.payload,
    });
    const approveResponse = yield axios({
      method: 'PUT',
      url: '/api/user/approve',
      data: action.payload,
    });
    yield put({
      type: 'SAGA_FETCH_ADMIN_USERS_FOR_TABLE',
    });
  } catch (error) {
    console.log(
      'Unable to posting new company and updating user compa to server',
      error,
    );
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('SAGA_FETCH_ADMIN_USERS_FOR_TABLE', fetchAdminUsers);
  yield takeLatest('SAGA_APPROVE_USER', approveUser);
  yield takeLatest('SAGA_SOFT_DELETE_USER', softDeleteUser);
  yield takeLatest('SAGA_FETCH_PROFILE_PAGE_USER', fetchProfilePageUser);
  yield takeLatest('SAGA_POST_NEW_COMPANY', postNewCompany);
}

export default userSaga;
