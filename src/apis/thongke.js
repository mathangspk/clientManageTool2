import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllThongke = (token, data) => {
    return getWithToken('api/thongkes', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchThongke = (token, data) => {
    return getWithToken('api/orders/dashboard', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdThongke = (token, id) => {
    return getWithToken('api/thongkes/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addThongkeRequest = (token, data) => {
    return postWithToken('api/thongkes', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteThongkeRequest = (token, id) => {
    return deleteWithToken('api/thongkes', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchThongkeRequest = (token, id, thongkeEditting) => {
    return patchWithToken('api/thongkes', token, id, thongkeEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




