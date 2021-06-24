import * as types from '../constants/bbdgkt';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    bbdgkts: [],
    loading: false,
    isCreateSuccess: false,
    bbdgktEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_BBDGKT_SUCCESS:
            return {
                ...state,
                bbdgkts: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_BBDGKT_SUCCESS:
            return {
                ...state,
                bbdgkts: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_BBDGKT_SUCCESS:
            return {
                ...state,
                bbdgkt: action.payload,
                loading: false
            }
        case types.ADD_BBDGKT:
            return {
                ...state,
            }
        case types.ADD_BBDGKT_SUCCESS: {
            const  data  = action.payload;
            toastSuccess('Thêm mới Work Bbdgkt thành công!')
            return {
                ...state,
                bbdgkts: [data, ...state.bbdgkts],
            };
        }
        case types.ADD_BBDGKT_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_BBDGKT_SUCCESS:
            return {
                ...state,
                bbdgkts: [...state.bbdgkts.filter(bbdgkt => bbdgkt._id !== action.payload)]
            }
        case types.SET_BBDGKT_EDITING: {
            const { bbdgkt } = action.payload;
            return {
                ...state,
                bbdgkt,
            };
        }
        case types.UPDATE_BBDGKT: {
            return {
                ...state,
            };
        }
        case types.UPDATE_BBDGKT_NOTE: {
            const  bbdgktEditting  = action.payload;
            return {
                ...state,
                bbdgkt: bbdgktEditting
            };
        }
        case types.UPDATE_BBDGKT_SUCCESS: {
            const  bbdgktEditting  = action.payload;
            const { bbdgkts } = state;
            const index = bbdgkts.findIndex((item) => item._id === bbdgktEditting._id);
            if (index !== -1) {
                const newList = [
                    ...bbdgkts.slice(0, index),
                    bbdgktEditting,
                    ...bbdgkts.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    bbdgkts: newList,
                    bbdgkt: bbdgktEditting
                };
            }
            return { ...state, bbdgkt: bbdgktEditting }
        }
        case types.UPDATE_BBDGKT_FAIL: {
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