import * as bbdgktConstants from '../constants/bbdgkt';

export const listAllBbdgkts = (params = {}) => {
  return {
    type: bbdgktConstants.GET_ALL_BBDGKT,
    payload: {
      params,
    }
  }
}
export const listAllBbdgktsSuccess = (data) => {
  return {
    type: bbdgktConstants.GET_ALL_BBDGKT_SUCCESS,
    payload: data,
  }
}
export const listAllBbdgktsFail = (error) => {
  return {
    type: bbdgktConstants.GET_ALL_BBDGKT_FAIL,
    payload: {
      error,
    }
  }
}
export const searchBbdgkt = (params = {}) => {
  return {
    type: bbdgktConstants.SEARCH_BBDGKT,
    payload: {
      params,
    }
  }
}
export const searchBbdgktSuccess = (data, params) => {
  return {
    type: bbdgktConstants.SEARCH_BBDGKT_SUCCESS,
    payload: { data, params }
  }
}
export const searchBbdgktFail = (error) => {
  return {
    type: bbdgktConstants.SEARCH_BBDGKT_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdBbdgkt = (payload) => {
  return {
    type: bbdgktConstants.GET_ID_BBDGKT,
    payload
  }
}
export const getIdBbdgktSuccess = (payload) => {
  return {
    type: bbdgktConstants.GET_ID_BBDGKT_SUCCESS,
    payload
  }
}
export const getIdBbdgktFail = (payload) => {
  return {
    type: bbdgktConstants.GET_ID_BBDGKT_FAIL,
    payload
  }
}
export const addBbdgkt = (payload) => {
  return {
    type: bbdgktConstants.ADD_BBDGKT,
    payload,
  };
};

export const addBbdgktSuccess = (payload) => {
  return {
    type: bbdgktConstants.ADD_BBDGKT_SUCCESS,
    payload,
  };
};

export const addBbdgktFail = (payload) => {
  return {
    type: bbdgktConstants.ADD_BBDGKT_FAIL,
    payload,
  };
};

export const deleteBbdgkt = (payload, params) => {
  return {
    type: bbdgktConstants.DELETE_BBDGKT,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteBbdgktSuccess = (payload) => {
  return {
    type: bbdgktConstants.DELETE_BBDGKT_SUCCESS,
    payload,
  };
};

export const deleteBbdgktFail = (payload) => {
  return {
    type: bbdgktConstants.DELETE_BBDGKT_FAIL,
    payload,
  };
};

export const updateBbdgkt = (payload) => {
  return {
    type: bbdgktConstants.UPDATE_BBDGKT,
    payload,
  };
};

export const updateBbdgktSuccess = (payload) => {
  return {
    type: bbdgktConstants.UPDATE_BBDGKT_SUCCESS,
    payload,
  };
};

export const updateBbdgktNote = (payload) => {
  return {
    type: bbdgktConstants.UPDATE_BBDGKT_NOTE,
    payload,
  };
};

export const updateBbdgktFail = (payload) => {
  return {
    type: bbdgktConstants.UPDATE_BBDGKT_FAIL,
    payload,
  };
};


export const setBbdgktEditing = (bbdgkt) => ({
  type: bbdgktConstants.SET_BBDGKT_EDITING,
  payload: {
    bbdgkt,
  },
});