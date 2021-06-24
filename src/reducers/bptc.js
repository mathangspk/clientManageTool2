import * as types from '../constants/bptc';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    bptcs: [],
    loading: false,
    isCreateSuccess: false,
    bptcEditting: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_ALL_BPTC_SUCCESS:
            return {
                ...state,
                bptcs: action.payload.Status.StatusCode === 200 && action.payload.Data.Row || [],
                total: action.payload.Status.StatusCode === 200 && action.payload.Data.Total || 0,
                loading: false
            }
        case types.SEARCH_BPTC_SUCCESS:
            return {
                ...state,
                bptcs: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Row || [],
                total: action.payload.data.Status.StatusCode === 200 && action.payload.data.Data.Total || 0,
                params: action.payload.params.params || {},
                loading: false
            }
        case types.GET_ID_BPTC_SUCCESS:
            return {
                ...state,
                bptc: action.payload,
                loading: false
            }
        case types.ADD_BPTC:
            return {
                ...state,
            }
        case types.ADD_BPTC_SUCCESS: {
            const  data  = action.payload;
            toastSuccess('Thêm mới Work Bptc thành công!')
            return {
                ...state,
                bptcs: [data, ...state.bptcs],
            };
        }
        case types.ADD_BPTC_FAIL: {
            const { error } = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_BPTC_SUCCESS:
            return {
                ...state,
                bptcs: [...state.bptcs.filter(bptc => bptc._id !== action.payload)]
            }
        case types.SET_BPTC_EDITING: {
            const { bptc } = action.payload;
            return {
                ...state,
                bptc,
            };
        }
        case types.UPDATE_BPTC: {
            return {
                ...state,
            };
        }
        case types.UPDATE_BPTC_NOTE: {
            const  bptcEditting  = action.payload;
            return {
                ...state,
                bptc: bptcEditting
            };
        }
        case types.UPDATE_BPTC_SUCCESS: {
            const  bptcEditting  = action.payload;
            const { bptcs } = state;
            const index = bptcs.findIndex((item) => item._id === bptcEditting._id);
            if (index !== -1) {
                const newList = [
                    ...bptcs.slice(0, index),
                    bptcEditting,
                    ...bptcs.slice(index + 1),
                ];
                // toastSuccess('Cập nhật đơn hàng thành công')
                return {
                    ...state,
                    bptcs: newList,
                    bptc: bptcEditting
                };
            }
            return { ...state, bptc: bptcEditting }
        }
        case types.UPDATE_BPTC_FAIL: {
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