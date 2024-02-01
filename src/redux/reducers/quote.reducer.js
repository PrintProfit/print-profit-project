import { combineReducers } from 'redux';

const quoteHistory = (state = [], action) => {
  if (action.type === 'SET_QUOTE_HISTORY') {
    return action.payload;
  }
  return state;
};

export default combineReducers({
  quoteHistory,
});
