import { combineReducers } from 'redux';
import taskReducer from './task';
import uiReducer from './ui';
import modalReducer from './modal';
import auth from './authReducer';
import errorReducer from './errorReducer';
import orders from './order';
import fastReports from './fastReport';
import cchtts from './cchtt';
import cgsats from './cgsat';
import bbdgkts from './bbdgkt';
import bptcs from './bptc';
import thongkes from './thongke';
import customers from './customer';
import tools from './tool';
import images from './image';
import tempImageForTool from './tempImageForTool';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  task: taskReducer,
  ui: uiReducer,
  modal: modalReducer,
  form: formReducer,
  auth,
  error: errorReducer,
  orders,
  fastReports,
  cchtts,
  bbdgkts,
  bptcs,
  thongkes,
  cgsats,
  customers,
  tools,
  images,
  tempImageForTool,
});

export default rootReducer;
