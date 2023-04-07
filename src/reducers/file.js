import * as types from '../constants/file';
import * as modalTypes from '../constants/modal';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    files: [],
    loading: false,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.UPLOAD_FILE:
            return {
                ...state,
            }
        case types.UPLOAD_FILE_SUCCESS: {
            const data = action.payload;
            for (let i = 0; i < data.length; i++) {
                state.files.push(data[i])
            }
            if (state.files && state.files.length > 0) {
                toastSuccess('Upload file thành công!')
            }
            return {
                ...state,
                files: state.files,
            };
        }
        case types.UPLOAD_FILE_FAIL: {
            const error = action.payload;
            toastError(error);
            return {
                ...state,
            };
        }
        case types.DELETE_FILE_SUCCESS:
            console.log(action)
            toastError("Đã xóa file thành công");
            return {
                ...state,
                files: [...state.files.filter(file => file.idFile !== action.payload)]
            }
        case types.CLEAN_FILES:
        case modalTypes.HIDE_MODAL:
            return {
                ...state,
                files: [],
            }
        default: return state;
    }
}
export default myReducer;