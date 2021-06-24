import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllThongkesSuccess,
  listAllThongkesFail,
  searchThongkeSuccess,
  searchThongkeFail,
  getIdThongkeSuccess,
  getIdThongkeFail,
  addThongkeSuccess,
  addThongkeFail,
  deleteThongkeSuccess,
  deleteThongkeFail,
  updateThongkeSuccess,
  updateThongkeFail,
} from '../actions/thongkeActions';

import { getAllThongke, searchThongke, getIdThongke, addThongkeRequest, deleteThongkeRequest, patchThongkeRequest } from '../apis/thongke';
import { getToken } from '../apis/auth';

import * as thongkeTypes from '../constants/thongke';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllThongkeSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllThongke, token, payload);
  console.log('aaaa')
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllThongkesSuccess(data))
  } else {
    yield put(listAllThongkesFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_THONGKES_FAIL'))
  }
  yield put(hideLoading());
}

function* searchThongkeSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchThongke, token, payload);
  console.log(resp)
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchThongkeSuccess(data, payload))
  } else {
    yield put(searchThongkeFail(data))
    yield put(returnErrors(data, status, 'SEARCH_THONGKE_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdThongkeSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdThongke, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdThongkeSuccess(data))
  } else {
    yield put(getIdThongkeFail(data))
    yield put(returnErrors(data, status, 'GET_ID_THONGKE_FAIL'))
  }
  yield put(hideLoading());
}

function* addThongkeSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addThongkeRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/thongke-detail/' + data._id
    // yield put(addThongkeSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addThongkeFail(data));
    yield put(returnErrors(data, status, 'ADD_THONGKE_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteThongkeSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteThongkeRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchThongke, token, {params: payload.params || {}});
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchThongkeSuccess(_resp.data, {params: payload.params || {}}))
    }
  } else {
    yield put(deleteThongkeFail(data));
  }
  yield put(hideLoading());
}

function* updateThongkeSaga({ payload }) {
  const token = yield call(getToken);
  const thongkeEdited = payload;
  const thongkeEditting = yield select((state) => state.thongkes.thongke);
  console.log(thongkeEdited)
  const { _id } = thongkeEditting;
  const thongkeSendReducer = { _id, ...thongkeEdited }
  yield put(showLoading());
  const resp = yield call(
    patchThongkeRequest,
    token, _id, thongkeEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateThongkeSuccess(thongkeSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateThongkeFail(data));
  }
  yield put(hideLoading());
}

function* thongkeSaga() {
  yield takeLatest(thongkeTypes.GET_ALL_THONGKE, getAllThongkeSaga);
  yield takeLatest(thongkeTypes.SEARCH_THONGKE, searchThongkeSaga);
  yield takeLatest(thongkeTypes.GET_ID_THONGKE, getIdThongkeSaga);
  yield takeLatest(thongkeTypes.ADD_THONGKE, addThongkeSaga);
  yield takeLatest(thongkeTypes.DELETE_THONGKE, deleteThongkeSaga);
  yield takeLatest(thongkeTypes.UPDATE_THONGKE, updateThongkeSaga);
}

export default (thongkeSaga);
