import * as cgsatConstants from '../constants/cgsat';

export const listAllCgsats = (params = {}) => {
  return {
    type: cgsatConstants.GET_ALL_CGSATS,
    payload: {
      params,
    }
  }
}
export const listAllCgsatsSuccess = (data) => {
  return {
    type: cgsatConstants.GET_ALL_CGSATS_SUCCESS,
    payload: data,
  }
}
export const listAllCgsatsFail = (error) => {
  return {
    type: cgsatConstants.GET_ALL_CGSATS_FAIL,
    payload: {
      error,
    }
  }
}
export const searchCgsat = (params = {}) => {
  return {
    type: cgsatConstants.SEARCH_CGSAT,
    payload: {
      params,
    }
  }
}
export const searchCgsatSuccess = (data, params) => {
  return {
    type: cgsatConstants.SEARCH_CGSAT_SUCCESS,
    payload: { data, params }
  }
}
export const searchCgsatFail = (error) => {
  return {
    type: cgsatConstants.SEARCH_CGSAT_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdCgsat = (payload) => {
  return {
    type: cgsatConstants.GET_ID_CGSAT,
    payload
  }
}
export const getIdCgsatSuccess = (payload) => {
  return {
    type: cgsatConstants.GET_ID_CGSAT_SUCCESS,
    payload
  }
}
export const getIdCgsatFail = (payload) => {
  return {
    type: cgsatConstants.GET_ID_CGSAT_FAIL,
    payload
  }
}
export const addCgsat = (payload) => {
  return {
    type: cgsatConstants.ADD_CGSAT,
    payload,
  };
};

export const addCgsatSuccess = (payload) => {
  return {
    type: cgsatConstants.ADD_CGSAT_SUCCESS,
    payload,
  };
};

export const addCgsatFail = (payload) => {
  return {
    type: cgsatConstants.ADD_CGSAT_FAIL,
    payload,
  };
};

export const deleteCgsat = (payload, params) => {
  return {
    type: cgsatConstants.DELETE_CGSAT,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteCgsatSuccess = (payload) => {
  return {
    type: cgsatConstants.DELETE_CGSAT_SUCCESS,
    payload,
  };
};

export const deleteCgsatFail = (payload) => {
  return {
    type: cgsatConstants.DELETE_CGSAT_FAIL,
    payload,
  };
};

export const updateCgsat = (payload) => {
  return {
    type: cgsatConstants.UPDATE_CGSAT,
    payload,
  };
};

export const updateCgsatSuccess = (payload) => {
  return {
    type: cgsatConstants.UPDATE_CGSAT_SUCCESS,
    payload,
  };
};

export const updateCgsatNote = (payload) => {
  return {
    type: cgsatConstants.UPDATE_CGSAT_NOTE,
    payload,
  };
};

export const updateCgsatFail = (payload) => {
  return {
    type: cgsatConstants.UPDATE_CGSAT_FAIL,
    payload,
  };
};


export const setCgsatEditing = (cgsat) => ({
  type: cgsatConstants.SET_CGSAT_EDITING,
  payload: {
    cgsat,
  },
});