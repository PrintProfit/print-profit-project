import { combineReducers } from 'redux';

const quoteHistory = (state = [], action) => {
  if (action.type === 'SET_QUOTE_HISTORY') {
    return action.payload;
  }
  return state;
};

const updateMode = (state = false, action) => {
  if (action.type === 'SET_QUOTE_UPDATE_MODE') {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  quoteHistory,
  updateMode,
});
