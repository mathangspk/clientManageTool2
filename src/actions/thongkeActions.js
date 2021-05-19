import * as thongkeConstants from '../constants/thongke';

export const listAllThongkes = (params = {}) => {
  return {
    type: thongkeConstants.GET_ALL_THONGKE,
    payload: {
      params,
    }
  }
}
export const listAllThongkesSuccess = (data) => {
  return {
    type: thongkeConstants.GET_ALL_THONGKE_SUCCESS,
    payload: data,
  }
}
export const listAllThongkesFail = (error) => {
  return {
    type: thongkeConstants.GET_ALL_THONGKE_FAIL,
    payload: {
      error,
    }
  }
}
export const searchThongke = (params = {}) => {
  return {
    type: thongkeConstants.SEARCH_THONGKE,
    payload: {
      params,
    }
  }
}
export const searchThongkeSuccess = (data, params) => {
  return {
    type: thongkeConstants.SEARCH_THONGKE_SUCCESS,
    payload: { data, params }
  }
}
export const searchThongkeFail = (error) => {
  return {
    type: thongkeConstants.SEARCH_THONGKE_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdThongke = (payload) => {
  return {
    type: thongkeConstants.GET_ID_THONGKE,
    payload
  }
}
export const getIdThongkeSuccess = (payload) => {
  return {
    type: thongkeConstants.GET_ID_THONGKE_SUCCESS,
    payload
  }
}
export const getIdThongkeFail = (payload) => {
  return {
    type: thongkeConstants.GET_ID_THONGKE_FAIL,
    payload
  }
}
export const addThongke = (payload) => {
  return {
    type: thongkeConstants.ADD_THONGKE,
    payload,
  };
};

export const addThongkeSuccess = (payload) => {
  return {
    type: thongkeConstants.ADD_THONGKE_SUCCESS,
    payload,
  };
};

export const addThongkeFail = (payload) => {
  return {
    type: thongkeConstants.ADD_THONGKE_FAIL,
    payload,
  };
};

export const deleteThongke = (payload, params) => {
  return {
    type: thongkeConstants.DELETE_THONGKE,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteThongkeSuccess = (payload) => {
  return {
    type: thongkeConstants.DELETE_THONGKE_SUCCESS,
    payload,
  };
};

export const deleteThongkeFail = (payload) => {
  return {
    type: thongkeConstants.DELETE_THONGKE_FAIL,
    payload,
  };
};

export const updateThongke = (payload) => {
  return {
    type: thongkeConstants.UPDATE_THONGKE,
    payload,
  };
};

export const updateThongkeSuccess = (payload) => {
  return {
    type: thongkeConstants.UPDATE_THONGKE_SUCCESS,
    payload,
  };
};

export const updateThongkeNote = (payload) => {
  return {
    type: thongkeConstants.UPDATE_THONGKE_NOTE,
    payload,
  };
};

export const updateThongkeFail = (payload) => {
  return {
    type: thongkeConstants.UPDATE_THONGKE_FAIL,
    payload,
  };
};


export const setThongkeEditing = (thongke) => ({
  type: thongkeConstants.SET_THONGKE_EDITING,
  payload: {
    thongke,
  },
});