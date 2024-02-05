import { combineReducers } from 'redux';
import { initialQuote } from '../../components/CostAndPricing/PricingTab/sample-data';

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

/**
 * @type {import('redux').Reducer<import('../../components/CostAndPricing/PricingTab/data-types').Quote>}
 */
const currentQuote = (state = initialQuote, action) => {
  if (action.type === 'SET_CURRENT_QUOTE') {
    return action.payload;
  }
  if (action.type === 'CLEAR_CURRENT_QUOTE') {
    return initialQuote;
  }
  return state;
};

export default combineReducers({
  quoteHistory,
  updateMode,
  current: currentQuote,
});
