import * as types from '../constants/thongke';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    thongkes: [],
    loading: false,
    isCreateSuccess: false,
    thongkeEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_THONGKE_SUCCESS:
            return {
                ...state,
                thongkes: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_THONGKE_SUCCESS:
            return {
                ...state,
                thongkes: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_THONGKE_SUCCESS:
            return {
                ...state,
                thongke: action.payload,
                loading: false
            }
        case types.ADD_THONGKE:
            return {
                ...state,
            }
        case types.ADD_THONGKE_SUCCESS: {
            const  data  = action.payload;
            toastSuccess('Thêm mới Work Thongke thành công!')
            return {
                ...state,
                thongkes: [data, ...state.thongkes],
            };
        }
        case types.ADD_THONGKE_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_THONGKE_SUCCESS:
            return {
                ...state,
                thongkes: [...state.thongkes.filter(thongke => thongke._id !== action.payload)]
            }
        case types.SET_THONGKE_EDITING: {
            const { thongke } = action.payload;
            return {
                ...state,
                thongke,
            };
        }
        case types.UPDATE_THONGKE: {
            return {
                ...state,
            };
        }
        case types.UPDATE_THONGKE_NOTE: {
            const  thongkeEditting  = action.payload;
            return {
                ...state,
                thongke: thongkeEditting
            };
        }
        case types.UPDATE_THONGKE_SUCCESS: {
            const  thongkeEditting  = action.payload;
            const { thongkes } = state;
            const index = thongkes.findIndex((item) => item._id === thongkeEditting._id);
            if (index !== -1) {
                const newList = [
                    ...thongkes.slice(0, index),
                    thongkeEditting,
                    ...thongkes.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    thongkes: newList,
                    thongke: thongkeEditting
                };
            }
            return { ...state, thongke: thongkeEditting }
        }
        case types.UPDATE_THONGKE_FAIL: {
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