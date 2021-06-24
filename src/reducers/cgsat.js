import * as types from '../constants/cgsat';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    cgsats: [],
    loading: false,
    isCreateSuccess: false,
    cgsatEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_CGSATS_SUCCESS:
            return {
                ...state,
                cgsats: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_CGSAT_SUCCESS:
            return {
                ...state,
                cgsats: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_CGSAT_SUCCESS:
            return {
                ...state,
                cgsat: action.payload,
                loading: false
            }
        case types.ADD_CGSAT:
            return {
                ...state,
            }
        case types.ADD_CGSAT_SUCCESS: {
            const  data  = action.payload;
            toastSuccess('Thêm mới Work Cgsat thành công!')
            return {
                ...state,
                cgsats: [data, ...state.cgsats],
            };
        }
        case types.ADD_CGSAT_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_CGSAT_SUCCESS:
            return {
                ...state,
                cgsats: [...state.cgsats.filter(cgsat => cgsat._id !== action.payload)]
            }
        case types.SET_CGSAT_EDITING: {
            const { cgsat } = action.payload;
            return {
                ...state,
                cgsat,
            };
        }
        case types.UPDATE_CGSAT: {
            return {
                ...state,
            };
        }
        case types.UPDATE_CGSAT_NOTE: {
            const  cgsatEditting  = action.payload;
            return {
                ...state,
                cgsat: cgsatEditting
            };
        }
        case types.UPDATE_CGSAT_SUCCESS: {
            const  cgsatEditting  = action.payload;
            const { cgsats } = state;
            const index = cgsats.findIndex((item) => item._id === cgsatEditting._id);
            if (index !== -1) {
                const newList = [
                    ...cgsats.slice(0, index),
                    cgsatEditting,
                    ...cgsats.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    cgsats: newList,
                    cgsat: cgsatEditting
                };
            }
            return { ...state, cgsat: cgsatEditting }
        }
        case types.UPDATE_CGSAT_FAIL: {
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