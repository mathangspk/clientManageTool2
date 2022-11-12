import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllFastReportsSuccess,
  listAllFastReportsFail,
  searchFastReportSuccess,
  searchFastReportFail,
  getIdFastReportSuccess,
  getIdFastReportFail,
  addFastReportSuccess,
  addFastReportFail,
  deleteFastReportSuccess,
  deleteFastReportFail,
  updateFastReportSuccess,
  updateFastReportFail,
} from '../actions/fastReportActions';

import { getAllFastReport, searchFastReport, getIdFastReport, addFastReportRequest, deleteFastReportRequest, patchFastReportRequest } from '../apis/fastReport';
import { getToken } from '../apis/auth';

import * as fastReportTypes from '../constants/fastReport';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllFastReportSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getAllFastReport, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllFastReportsSuccess(data))
  } else {
    yield put(listAllFastReportsFail(data))
    yield put(returnErrors(data, status, 'GET_ALL_FASTREPORTS_FAIL'))
  }
  yield put(hideLoading());
}

function* searchFastReportSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(searchFastReport, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(searchFastReportSuccess(data, payload))
  } else {
    yield put(searchFastReportFail(data))
    yield put(returnErrors(data, status, 'SEARCH_FASTREPORT_FAIL'))
  }
  yield put(hideLoading());
}

function* getIdFastReportSaga({ payload }) {
  yield put(showLoading());
  const token = yield call(getToken);
  const resp = yield call(getIdFastReport, token, payload);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(getIdFastReportSuccess(data))
  } else {
    yield put(getIdFastReportFail(data))
    yield put(returnErrors(data, status, 'GET_ID_FASTREPORT_FAIL'))
  }
  yield put(hideLoading());
}

function* addFastReportSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addFastReportRequest, token, payload);
  const { data, status } = resp;
  console.log(resp);
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/fastReport-detail/' + data._id
    // yield put(addFastReportSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addFastReportFail(data));
    yield put(returnErrors(data, status, 'ADD_FASTREPORT_FAIL'))
  }
  yield put(hideLoading());
}

function* deleteFastReportSaga({ payload }, params) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteFastReportRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    const _resp = yield call(searchFastReport, token, { params: payload.params || {} });
    if (_resp.data.Status.StatusCode === STATUS_CODE.SUCCESS) {
      yield put(searchFastReportSuccess(_resp.data, { params: payload.params || {} }))
    }
  } else {
    yield put(deleteFastReportFail(data));
  }
  yield put(hideLoading());
}

function* updateFastReportSaga({ payload }) {
  const token = yield call(getToken);
  const fastReportEdited = payload;
  const fastReportEditting = yield select((state) => state.fastReports.fastReport);
  const { _id } = fastReportEditting;
  const fastReportSendReducer = { _id, ...fastReportEdited }
  yield put(showLoading());
  const resp = yield call(
    patchFastReportRequest,
    token, _id, fastReportEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateFastReportSuccess(fastReportSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateFastReportFail(data));
  }
  yield put(hideLoading());
}

function* fastReportSaga() {
  yield takeLatest(fastReportTypes.GET_ALL_FASTREPORTS, getAllFastReportSaga);
  yield takeLatest(fastReportTypes.SEARCH_FASTREPORT, searchFastReportSaga);
  yield takeLatest(fastReportTypes.GET_ID_FASTREPORT, getIdFastReportSaga);
  yield takeLatest(fastReportTypes.ADD_FASTREPORT, addFastReportSaga);
  yield takeLatest(fastReportTypes.DELETE_FASTREPORT, deleteFastReportSaga);
  yield takeLatest(fastReportTypes.UPDATE_FASTREPORT, updateFastReportSaga);
}

export default (fastReportSaga);
