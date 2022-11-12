import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllFastReport = (token, data) => {
    return getWithToken('api/fastReports', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const searchFastReport = (token, data) => {
    return getWithToken('api/fastReports/search', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}
export const getIdFastReport = (token, id) => {
    return getWithToken('api/fastReports/' + id, token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addFastReportRequest = (token, data) => {
    return postWithToken('api/fastReports', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteFastReportRequest = (token, id) => {
    return deleteWithToken('api/fastReports', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchFastReportRequest = (token, id, fastReportEditing) => {
    return patchWithToken('api/fastReports', token, id, fastReportEditing).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




