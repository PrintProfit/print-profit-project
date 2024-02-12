import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

// Gets all quotes made by users of the same company
function* getQuoteHistory(action) {
  try {
    console.log('action.payload: ', action.payload);
    const response = yield axios({
      method: 'GET',
      url: `/api/quote/${action.payload}`,
    });
    yield put({
      type: 'SET_QUOTE_HISTORY',
      payload: response.data.quotes,
    });
    console.log(
      'response.data[0].quotes from getQuoteHistory sagaaa: ',
      response.data[0].quotes,
    );
    console.log('action.payload in Set Quote History call: ', action.payload);
  } catch (error) {
    console.log('Quote get request failed: ', error);
  }
}

function* saveQuote(action) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };
  try {
    yield axios.post('/api/quote', action.payload, config);
  } catch (error) {
    console.log('Error with saving quote: ', error);
  }
}

function* updateQuote(action) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  };
  try {
    yield axios.put('/api/quote', action.payload, config);
  } catch (error) {
    console.log('Error with saving quote: ', error);
  }
}

function* removeQuote(action) {
  try {
    yield axios.put('/api/quote/remove', action.payload);
  } catch (error) {
    console.log('Error with removing quote: ', error);
  }
}

function* deleteQuote(action) {
  try {
    yield axios.delete('/api/quote/', action.payload);
  } catch (error) {
    console.log('Error deleting quote: ', error);
  }
}

function* quoteSaga() {
  yield takeLatest('SAGA/FETCH_QUOTE_HISTORY', getQuoteHistory);
  yield takeLatest('SAGA/SAVE_QUOTE', saveQuote);
  yield takeLatest('SAGA/UPDATE_QUOTE', updateQuote);
  yield takeLatest('SAGA_SOFT_DELETE_QUOTE', removeQuote);
  yield takeLatest('SAGA/DELETE_QUOTE', deleteQuote);
}

export default quoteSaga;
