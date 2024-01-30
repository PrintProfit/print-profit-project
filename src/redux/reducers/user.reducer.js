import { combineReducers } from 'redux';

const currentUser = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

const profilePageUser = (state = {}, action) => {
  if (action.type === 'SET_PROFILE_PAGE_USER') {
    return action.payload;
  }
  return state;
};

const pendingUserReducer = (state = [], action) => {
  if (action.type === 'SET_PENDING_USERS') {
    return action.payload;
  }
  return state;
};

const approvedUserReducer = (state = [], action) => {
  if (action.type === 'SET_APPROVED_USERS') {
    return action.payload;
  }
  return state;
};

const companyList = (state = [], action) => {
  if (action.type === 'SET_COMPANY_LIST') {
    return action.payload;
  }
  return state;
};

// user will be on the redux state at:
// state.user.blank
export default combineReducers({
  currentUser,
  profilePageUser,
  pendingUserReducer,
  approvedUserReducer,
  companyList,
});
