import { postFilesWithToken, deleteFileWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const uploadFilesRequest = (token, listFile) => {
    return postFilesWithToken('api/upload/upload-files', token, listFile).then(res => {
        return res;
    }).catch(err => { return err.response });
};
export const addFileRequest = (token, id, listFile) => {
    return patchWithToken('api/fastReports/addFiles', token, id, listFile).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
};

export const deleteFileRequest = (token, filename) => {
    return deleteFileWithToken('api/upload/file', token, filename).then(res => {
        return res;
    }).catch(err => { return err.response });
}



