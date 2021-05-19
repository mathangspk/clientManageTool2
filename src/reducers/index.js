import { combineReducers } from 'redux';
import taskReducer from './task';
import uiReducer from './ui';
import modalReducer from './modal';
import auth from './authReducer';
import errorReducer from './errorReducer';
import orders from './order';
import cchtts from './cchtt';
import cgsats from './cgsat';
import bbdgkts from './bbdgkt';
import bptcs from './bptc';
import thongkes from './thongke';
import customers from './customer';
import tools from './tool';
import images from './image';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  task: taskReducer,
  ui: uiReducer,
  modal: modalReducer,
  form: formReducer,
  auth,
  error: errorReducer,
  orders,
  cchtts,
  bbdgkts,
  bptcs,
  thongkes,
  cgsats,
  customers,
  tools,
  images,

});

export default rootReducer;
