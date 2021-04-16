import * as types from '../constants/cchtt';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    cchtts: [],
    loading: false,
    isCreateSuccess: false,
    cchttEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_CCHTTS_SUCCESS:
            return {
                ...state,
                cchtts: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_CCHTT_SUCCESS:
            return {
                ...state,
                cchtts: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_CCHTT_SUCCESS:
            return {
                ...state,
                cchtt: action.payload,
                loading: false
            }
        case types.ADD_CCHTT:
            return {
                ...state,
            }
        case types.ADD_CCHTT_SUCCESS: {
            const  data  = action.payload;
            toastSuccess('Thêm mới Work Cchtt thành công!')
            return {
                ...state,
                cchtts: [data, ...state.cchtts],
            };
        }
        case types.ADD_CCHTT_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_CCHTT_SUCCESS:
            return {
                ...state,
                cchtts: [...state.cchtts.filter(cchtt => cchtt._id !== action.payload)]
            }
        case types.SET_CCHTT_EDITING: {
            const { cchtt } = action.payload;
            return {
                ...state,
                cchtt,
            };
        }
        case types.UPDATE_CCHTT: {
            return {
                ...state,
            };
        }
        case types.UPDATE_CCHTT_NOTE: {
            const  cchttEditting  = action.payload;
            return {
                ...state,
                cchtt: cchttEditting
            };
        }
        case types.UPDATE_CCHTT_SUCCESS: {
            const  cchttEditting  = action.payload;
            const { cchtts } = state;
            const index = cchtts.findIndex((item) => item._id === cchttEditting._id);
            if (index !== -1) {
                const newList = [
                    ...cchtts.slice(0, index),
                    cchttEditting,
                    ...cchtts.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    cchtts: newList,
                    cchtt: cchttEditting
                };
            }
            return { ...state, cchtt: cchttEditting }
        }
        case types.UPDATE_CCHTT_FAIL: {
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