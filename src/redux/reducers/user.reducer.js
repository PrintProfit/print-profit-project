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

const profileUserReducer = (state = [], action) => {
  if (action.type === 'SET_PROFILE_PAGE_USER') {
    return action.payload;
  }
  return state;
};

const editUserEmail = (state = {}, action) => {
  if (action.type === 'SET_USER') {
    return action.payload;
  }
  if (action.type === 'CHANGE_EMAIL') {
    const newEmail = action.payload;
    return { ...state, email: newEmail };
  }
  if (action.type === 'RESET_EMAIL') {
    return action.payload;
  }
  return state;
};

const editUserName = (state = {}, action) => {
  if (action.type === 'SET_USER') {
    return action.payload;
  }
  if (action.type === 'CHANGE_NAME') {
    const newName = action.payload;
    return { ...state, name: newName };
  }
  if (action.type === 'RESET_NAME') {
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

const archivedUserReducer = (state = [], action) => {
  if (action.type === 'SET_ARCHIVED_USERS') {
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
  profileUserReducer,
  editUserEmail,
  editUserName,
  pendingUserReducer,
  approvedUserReducer,
  archivedUserReducer,
  companyList,
});
