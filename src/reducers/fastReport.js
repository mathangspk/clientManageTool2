import * as types from '../constants/fastReport';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    fastReports: [],
    loading: false,
    isCreateSuccess: false,
    fastReportEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_FASTREPORTS_SUCCESS:
            return {
                ...state,
                fastReports: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_FASTREPORT_SUCCESS:
            return {
                ...state,
                fastReports: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_FASTREPORT_SUCCESS:
            return {
                ...state,
                fastReport: action.payload,
                loading: false
            }
        case types.ADD_FASTREPORT:
            return {
                ...state,
            }
        case types.ADD_FASTREPORT_SUCCESS: {
            const data = action.payload;
            toastSuccess('Thêm mới Work Order thành công!')
            return {
                ...state,
                fastReports: [data, ...state.fastReports],
            };
        }
        case types.ADD_FASTREPORT_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_FASTREPORT_SUCCESS:
            return {
                ...state,
                fastReports: [...state.fastReports.filter(fastReport => fastReport._id !== action.payload)]
            }
        case types.SET_FASTREPORT_EDITING: {
            const { fastReport } = action.payload;
            return {
                ...state,
                fastReport,
            };
        }
        case types.UPDATE_FASTREPORT: {
            return {
                ...state,
            };
        }
        case types.UPDATE_FASTREPORT_NOTE: {
            const fastReportEditting = action.payload;
            return {
                ...state,
                fastReport: fastReportEditting
            };
        }
        case types.UPDATE_FASTREPORT_SUCCESS: {
            const fastReportEditting = action.payload;
            const { fastReports } = state;
            const index = fastReports.findIndex((item) => item._id === fastReportEditting._id);
            if (index !== -1) {
                const newList = [
                    ...fastReports.slice(0, index),
                    fastReportEditting,
                    ...fastReports.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    fastReports: newList,
                    fastReport: fastReportEditting
                };
            }
            return { ...state, fastReport: fastReportEditting }
        }
        case types.UPDATE_FASTREPORT_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        default: return state;
    }
}
export default myReducer;