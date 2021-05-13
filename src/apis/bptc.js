import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllBptc = (token, data) => {
    return getWithToken('api/bptcs', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchBptc = (token, data) => {
    return getWithToken('api/bptcs/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdBptc = (token, id) => {
    return getWithToken('api/bptcs/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addBptcRequest = (token, data) => {
    return postWithToken('api/bptcs', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteBptcRequest = (token, id) => {
    return deleteWithToken('api/bptcs', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchBptcRequest = (token, id, bptcEditting) => {
    return patchWithToken('api/bptcs', token, id, bptcEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




