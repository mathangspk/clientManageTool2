import * as fastReportConstants from '../constants/fastReport';

export const listAllFastReports = (params = {}) => {
  return {
    type: fastReportConstants.GET_ALL_FASTREPORTS,
    payload: {
      params,
    }
  }
}
export const listAllFastReportsSuccess = (data) => {
  return {
    type: fastReportConstants.GET_ALL_FASTREPORTS_SUCCESS,
    payload: data,
  }
}
export const listAllFastReportsFail = (error) => {
  return {
    type: fastReportConstants.GET_ALL_FASTREPORTS_FAIL,
    payload: {
      error,
    }
  }
}
export const searchFastReport = (params = {}) => {
  return {
    type: fastReportConstants.SEARCH_FASTREPORT,
    payload: {
      params,
    }
  }
}
export const searchFastReportSuccess = (data, params) => {
  return {
    type: fastReportConstants.SEARCH_FASTREPORT_SUCCESS,
    payload: { data, params }
  }
}
export const searchFastReportFail = (error) => {
  return {
    type: fastReportConstants.SEARCH_FASTREPORT_FAIL,
    payload: {
      error,
    }
  }
}
export const getIdFastReport = (payload) => {
  return {
    type: fastReportConstants.GET_ID_FASTREPORT,
    payload
  }
}
export const getIdFastReportSuccess = (payload) => {
  return {
    type: fastReportConstants.GET_ID_FASTREPORT_SUCCESS,
    payload
  }
}
export const getIdFastReportFail = (payload) => {
  return {
    type: fastReportConstants.GET_ID_FASTREPORT_FAIL,
    payload
  }
}
export const addFastReport = (payload) => {
  return {
    type: fastReportConstants.ADD_FASTREPORT,
    payload,
  };
};

export const addFastReportSuccess = (payload) => {
  return {
    type: fastReportConstants.ADD_FASTREPORT_SUCCESS,
    payload,
  };
};

export const addFastReportFail = (payload) => {
  return {
    type: fastReportConstants.ADD_FASTREPORT_FAIL,
    payload,
  };
};

export const deleteFastReport = (payload, params) => {
  return {
    type: fastReportConstants.DELETE_FASTREPORT,
    payload: {
      ...payload,
      params
    },
  };
};

export const deleteFastReportSuccess = (payload) => {
  return {
    type: fastReportConstants.DELETE_FASTREPORT_SUCCESS,
    payload,
  };
};

export const deleteFastReportFail = (payload) => {
  return {
    type: fastReportConstants.DELETE_FASTREPORT_FAIL,
    payload,
  };
};

export const updateFastReport = (payload) => {
  return {
    type: fastReportConstants.UPDATE_FASTREPORT,
    payload,
  };
};

export const updateFastReportSuccess = (payload) => {
  return {
    type: fastReportConstants.UPDATE_FASTREPORT_SUCCESS,
    payload,
  };
};

export const updateFastReportNote = (payload) => {
  return {
    type: fastReportConstants.UPDATE_FASTREPORT_NOTE,
    payload,
  };
};

export const updateFastReportFail = (payload) => {
  return {
    type: fastReportConstants.UPDATE_FASTREPORT_FAIL,
    payload,
  };
};


export const setFastReportEditing = (fastReport) => ({
  type: fastReportConstants.SET_FASTREPORT_EDITING,
  payload: {
    fastReport,
  },
});