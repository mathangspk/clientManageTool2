import * as cchttConstants from '../constants/cchtt';

export const listAllCchtts = (params = {}) => {
  return {
    type: cchttConstants.GET_ALL_CCHTTS,
    payload: {
      params,
    }
  }
}
export const listAllCchttsSuccess = (data) => {
  return {
    type: cchttConstants.GET_ALL_CCHTTS_SUCCESS,
    payload: data,
  }
}
export const listAllCchttsFail = (error) => {
  return {
    type: cchttConstants.GET_ALL_CCHTTS_FAIL,
    payload: {
      error,
    }
  }
}
export const searchCchtt = (params = {}) => {
  return {
    type: cchttConstants.SEARCH_CCHTT,
    payload: {
      params,
    }
  }
}
export const searchCchttSuccess = (data, params) => {
  return {
    type: cchttConstants.SEARCH_CCHTT_SUCCESS,
    payload: { data, params }
  }
}
export const searchCchttFail = (error) => {
  return {
    type: cchttConstants.SEARCH_CCHTT_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdCchtt = (payload) => {
  return {
    type: cchttConstants.GET_ID_CCHTT,
    payload
  }
}
export const getIdCchttSuccess = (payload) => {
  return {
    type: cchttConstants.GET_ID_CCHTT_SUCCESS,
    payload
  }
}
export const getIdCchttFail = (payload) => {
  return {
    type: cchttConstants.GET_ID_CCHTT_FAIL,
    payload
  }
}
export const addCchtt = (payload) => {
  return {
    type: cchttConstants.ADD_CCHTT,
    payload,
  };
};

export const addCchttSuccess = (payload) => {
  return {
    type: cchttConstants.ADD_CCHTT_SUCCESS,
    payload,
  };
};

export const addCchttFail = (payload) => {
  return {
    type: cchttConstants.ADD_CCHTT_FAIL,
    payload,
  };
};

export const deleteCchtt = (payload, params) => {
  return {
    type: cchttConstants.DELETE_CCHTT,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteCchttSuccess = (payload) => {
  return {
    type: cchttConstants.DELETE_CCHTT_SUCCESS,
    payload,
  };
};

export const deleteCchttFail = (payload) => {
  return {
    type: cchttConstants.DELETE_CCHTT_FAIL,
    payload,
  };
};

export const updateCchtt = (payload) => {
  return {
    type: cchttConstants.UPDATE_CCHTT,
    payload,
  };
};

export const updateCchttSuccess = (payload) => {
  return {
    type: cchttConstants.UPDATE_CCHTT_SUCCESS,
    payload,
  };
};

export const updateCchttNote = (payload) => {
  return {
    type: cchttConstants.UPDATE_CCHTT_NOTE,
    payload,
  };
};

export const updateCchttFail = (payload) => {
  return {
    type: cchttConstants.UPDATE_CCHTT_FAIL,
    payload,
  };
};


export const setCchttEditing = (cchtt) => ({
  type: cchttConstants.SET_CCHTT_EDITING,
  payload: {
    cchtt,
  },
});