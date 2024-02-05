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
      payload: response.data[0].quotes,
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
    yield axios.post('/api/quote', config, action.payload);
  } catch (error) {
    console.log('Error with saving quote: ', error);
  }
}

function* quoteSaga() {
  yield takeLatest('SAGA/FETCH_QUOTE_HISTORY', getQuoteHistory);
  yield takeLatest('SAGA/SAVE_QUOTE', saveQuote);
}

export default quoteSaga;
