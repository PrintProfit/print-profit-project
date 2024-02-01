import axios from 'axios';
import { put, take, takeLatest } from 'redux-saga/effects';

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
      payload: response.data,
    });
    console.log('response.data from getQuoteHistory sagaaa: ', response.data);
  } catch (error) {
    console.log('Quote get request failed: ', error);
  }
}

function* quoteSaga() {
  yield takeLatest('SAGA/FETCH_QUOTE_HISTORY', getQuoteHistory);
}

export default quoteSaga;
