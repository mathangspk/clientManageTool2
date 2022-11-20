import * as types from '../constants/tempImageForTool';
import * as modalTypes from '../constants/modal';
import { toastError, toastSuccess } from '../helpers/toastHelper';
var initialState = {
    name: null,
    manufacturer: null,
    type: null,
}
var myReducer = (state = initialState, action) => {
    switch (action.type) {

        case types.GET_IMAGE_FOR_TOOL:
            return {
                name: action.payload.name,
                manufacturer: action.payload.manufacturer,
                type: action.payload.type,
            }

        case modalTypes.HIDE_MODAL:
            return {
                name: null,
                manufacturer: null,
                type: null,
            }
        default: return state;
    }
}
export default myReducer;