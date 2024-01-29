import { combineReducers } from 'redux';

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

const pendingUserReducer = (state = {}, action) => {
  if (action.type === 'SET_PENDING_USERS') {
    return action.payload;
  }
  return state;
};

const approvedUserReducer = (state = {}, action) => {
  if (action.type === 'SET_APPROVED_USERS') {
    return action.payload;
  }
  return state;
};

// user will be on the redux state at:
// state.user
// export default userReducer;

// user will be on the redux state at:
// state.user.blank
export default combineReducers({
  userReducer,
  pendingUserReducer,
  approvedUserReducer,
});
