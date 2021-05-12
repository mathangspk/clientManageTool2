import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllCgsat = (token, data) => {
    return getWithToken('api/cgsats', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchCgsat = (token, data) => {
    return getWithToken('api/cgsats/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdCgsat = (token, id) => {
    return getWithToken('api/cgsats/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addCgsatRequest = (token, data) => {
    return postWithToken('api/cgsats', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteCgsatRequest = (token, id) => {
    return deleteWithToken('api/cgsats', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchCgsatRequest = (token, id, cgsatEditting) => {
    return patchWithToken('api/cgsats', token, id, cgsatEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




