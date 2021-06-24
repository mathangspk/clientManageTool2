import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllCchtt = (token, data) => {
    return getWithToken('api/cchtts', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchCchtt = (token, data) => {
    return getWithToken('api/cchtts/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdCchtt = (token, id) => {
    return getWithToken('api/cchtts/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addCchttRequest = (token, data) => {
    return postWithToken('api/cchtts', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteCchttRequest = (token, id) => {
    return deleteWithToken('api/cchtts', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchCchttRequest = (token, id, cchttEditting) => {
    return patchWithToken('api/cchtts', token, id, cchttEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




