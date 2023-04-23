import * as fileConstants from '../constants/file';

export const getFile = (params = {}) => {
  return {
    type: fileConstants.GET_FILE,
    payload: {
      params,
    }
  }
}
export const getFileSuccess = (data) => {
  return {
    type: fileConstants.GET_FILE_SUCCESS,
    payload: data,
  }
}
export const getFileFail = (error) => {
  return {
    type: fileConstants.GET_FILE_FAIL,
    payload: {
      error,
    }
  }
}
export const uploadFiles = (payload) => {
  return {
    type: fileConstants.UPLOAD_FILE,
    payload,
  };
};

export const uploadFilesSuccess = (payload) => {
  return {
    type: fileConstants.UPLOAD_FILE_SUCCESS,
    payload,
  };
};

export const uploadFilesFail = (payload) => {
  return {
    type: fileConstants.UPLOAD_FILE_FAIL,
    payload,
  };
};

export const deleteFile = (payload) => {
  return {
    type: fileConstants.DELETE_FILE,
    payload,
  };
};

export const deleteFileSuccess = (payload) => {
  return {
    type: fileConstants.DELETE_FILE_SUCCESS,
    payload,
  };
};

export const deleteFileFail = (payload) => {
  return {
    type: fileConstants.DELETE_FILE_FAIL,
    payload,
  };
};

export const cleanFileStore = () => {
  return {
    type: fileConstants.CLEAN_FILES,
  };
};