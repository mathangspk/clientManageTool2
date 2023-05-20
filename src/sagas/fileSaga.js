import {
  call,
  put,
  takeLatest,
  select,
} from 'redux-saga/effects';

import {
  uploadFilesFail,
  uploadFilesSuccess,
  deleteFileSuccess,
  deleteFileFail,
} from '../actions/fileActions';

import { uploadFilesRequest, deleteFileRequest } from '../apis/file';
import { getToken } from '../apis/auth';

import * as fileTypes from '../constants/file';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { returnErrors } from '../actions/errorActions';
import { hideTempModal, showModal } from '../actions/modal';

function* uploadFilesSaga({ payload }) {
  const token = yield call(getToken);
  //yield put(hideTempModal());
  yield put(showLoading());
  console.log('file saga')
  console.log(payload)
  const resp = yield call(uploadFilesRequest, token, payload);
  console.log(resp)
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(uploadFilesSuccess(data.data));
    console.log(data.data)
  } else {
    yield put(uploadFilesFail(data));
    yield put(returnErrors(data, status, 'UPLOAD_FILES_FAIL'));
  }
  yield put(hideLoading());
  //yield put(showModal());
}

function* deleteFileSaga({ payload }) {
  const filename = payload;
  console.log(filename);
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteFileRequest, token, filename);
  const { data, status } = resp;
  console.log(resp)
  if (status === STATUS_CODE.SUCCESS) {
    yield put(deleteFileSuccess(filename));
  } else {
    yield put(deleteFileFail(data));
    yield put(returnErrors(data, status, 'DELETE_FILE_FAIL'));
  }
  yield put(hideLoading());
}

// function* updateProductSaga({ payload }) {
//   const token = yield call(getToken);
//   const productEdited = payload;
//   const productEditting = yield select((state) => state.products.productEditting);
//   const { _id } = productEditting;
//   const productSendReducer = { _id, ...productEdited }
//   yield put(showLoading());
//   const resp = yield call(
//     patchProductRequest,
//     token, _id, productEdited
//   );
//   const { data, status } = resp;
//   if (status === STATUS_CODE.SUCCESS) {
//     yield put(updateProductSuccess(productSendReducer));
//     yield put(hideModal());
//   } else {
//     yield put(updateProductFail(data));
//     yield put(returnErrors(data, status, 'UPDATE_PRODUCTS_FAIL'));
//   }
//   yield put(hideLoading());
// }

function* fileSaga() {
  yield takeLatest(fileTypes.UPLOAD_FILE, uploadFilesSaga);
  yield takeLatest(fileTypes.DELETE_FILE, deleteFileSaga);
}

export default (fileSaga);
