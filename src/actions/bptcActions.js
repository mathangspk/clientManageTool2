import * as bptcConstants from '../constants/bptc';

export const listAllBptcs = (params = {}) => {
  return {
    type: bptcConstants.GET_ALL_BPTC,
    payload: {
      params,
    }
  }
}
export const listAllBptcsSuccess = (data) => {
  return {
    type: bptcConstants.GET_ALL_BPTC_SUCCESS,
    payload: data,
  }
}
export const listAllBptcsFail = (error) => {
  return {
    type: bptcConstants.GET_ALL_BPTC_FAIL,
    payload: {
      error,
    }
  }
}
export const searchBptc = (params = {}) => {
  return {
    type: bptcConstants.SEARCH_BPTC,
    payload: {
      params,
    }
  }
}
export const searchBptcSuccess = (data, params) => {
  return {
    type: bptcConstants.SEARCH_BPTC_SUCCESS,
    payload: { data, params }
  }
}
export const searchBptcFail = (error) => {
  return {
    type: bptcConstants.SEARCH_BPTC_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdBptc = (payload) => {
  return {
    type: bptcConstants.GET_ID_BPTC,
    payload
  }
}
export const getIdBptcSuccess = (payload) => {
  return {
    type: bptcConstants.GET_ID_BPTC_SUCCESS,
    payload
  }
}
export const getIdBptcFail = (payload) => {
  return {
    type: bptcConstants.GET_ID_BPTC_FAIL,
    payload
  }
}
export const addBptc = (payload) => {
  return {
    type: bptcConstants.ADD_BPTC,
    payload,
  };
};

export const addBptcSuccess = (payload) => {
  return {
    type: bptcConstants.ADD_BPTC_SUCCESS,
    payload,
  };
};

export const addBptcFail = (payload) => {
  return {
    type: bptcConstants.ADD_BPTC_FAIL,
    payload,
  };
};

export const deleteBptc = (payload, params) => {
  return {
    type: bptcConstants.DELETE_BPTC,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteBptcSuccess = (payload) => {
  return {
    type: bptcConstants.DELETE_BPTC_SUCCESS,
    payload,
  };
};

export const deleteBptcFail = (payload) => {
  return {
    type: bptcConstants.DELETE_BPTC_FAIL,
    payload,
  };
};

export const updateBptc = (payload) => {
  return {
    type: bptcConstants.UPDATE_BPTC,
    payload,
  };
};

export const updateBptcSuccess = (payload) => {
  return {
    type: bptcConstants.UPDATE_BPTC_SUCCESS,
    payload,
  };
};

export const updateBptcNote = (payload) => {
  return {
    type: bptcConstants.UPDATE_BPTC_NOTE,
    payload,
  };
};

export const updateBptcFail = (payload) => {
  return {
    type: bptcConstants.UPDATE_BPTC_FAIL,
    payload,
  };
};


export const setBptcEditing = (bptc) => ({
  type: bptcConstants.SET_BPTC_EDITING,
  payload: {
    bptc,
  },
});