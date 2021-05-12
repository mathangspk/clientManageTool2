import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllBbdgktsSuccess,
  listAllBbdgktsFail,
  searchBbdgktSuccess,
  searchBbdgktFail,
  getIdBbdgktSuccess,
  getIdBbdgktFail,
  addBbdgktSuccess,
  addBbdgktFail,
  deleteBbdgktSuccess,
  deleteBbdgktFail,
  updateBbdgktSuccess,
  updateBbdgktFail,
} from '../actions/bbdgktActions';

import { getAllBbdgkt, searchBbdgkt, getIdBbdgkt, addBbdgktRequest, deleteBbdgktRequest, patchBbdgktRequest } from '../apis/bbdgkt';
import { getToken } from '../apis/auth';

import * as bbdgktTypes from '../constants/bbdgkt';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllBbdgktSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllBbdgkt, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllBbdgktsSuccess(data))
  } else {
    yield put(listAllBbdgktsFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_BBDGKTS_FAIL'))
  }
  yield put(hideLoading());
}

function* searchBbdgktSaga({ payload }) {
  console.log("search")
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchBbdgkt, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchBbdgktSuccess(data, payload))
  } else {
    yield put(searchBbdgktFail(data))
    yield put(returnErrors(data, status, 'SEARCH_BBDGKT_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdBbdgktSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdBbdgkt, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdBbdgktSuccess(data))
  } else {
    yield put(getIdBbdgktFail(data))
    yield put(returnErrors(data, status, 'GET_ID_BBDGKT_FAIL'))
  }
  yield put(hideLoading());
}

function* addBbdgktSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addBbdgktRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/bbdgkt-detail/' + data._id
    // yield put(addBbdgktSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addBbdgktFail(data));
    yield put(returnErrors(data, status, 'ADD_BBDGKT_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteBbdgktSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteBbdgktRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchBbdgkt, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchBbdgktSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteBbdgktFail(data));
  }
  yield put(hideLoading());
}

function* updateBbdgktSaga({ payload }) {
  const token = yield call(getToken);
  const bbdgktEdited = payload;
  const bbdgktEditting = yield select((state) => state.bbdgkts.bbdgkt);
  console.log(bbdgktEdited)
  const { _id } = bbdgktEditting;
  const bbdgktSendReducer = { _id, ...bbdgktEdited }
  yield put(showLoading());
  const resp = yield call(
    patchBbdgktRequest,
    token, _id, bbdgktEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateBbdgktSuccess(bbdgktSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateBbdgktFail(data));
  }
  yield put(hideLoading());
}

function* bbdgktSaga() {
  yield takeLatest(bbdgktTypes.GET_ALL_BBDGKT, getAllBbdgktSaga);
  yield takeLatest(bbdgktTypes.SEARCH_BBDGKT, searchBbdgktSaga);
  yield takeLatest(bbdgktTypes.GET_ID_BBDGKT, getIdBbdgktSaga);
  yield takeLatest(bbdgktTypes.ADD_BBDGKT, addBbdgktSaga);
  yield takeLatest(bbdgktTypes.DELETE_BBDGKT, deleteBbdgktSaga);
  yield takeLatest(bbdgktTypes.UPDATE_BBDGKT, updateBbdgktSaga);
}

export default (bbdgktSaga);
