import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllBbdgkt = (token, data) => {
    return getWithToken('api/bbdgkts', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchBbdgkt = (token, data) => {
    return getWithToken('api/bbdgkts/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdBbdgkt = (token, id) => {
    return getWithToken('api/bbdgkts/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addBbdgktRequest = (token, data) => {
    return postWithToken('api/bbdgkts', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteBbdgktRequest = (token, id) => {
    return deleteWithToken('api/bbdgkts', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchBbdgktRequest = (token, id, bbdgktEditting) => {
    return patchWithToken('api/bbdgkts', token, id, bbdgktEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




