import * as imageConstants from '../constants/tempImageForTool';

export const getImageForTool = (payload) => {
  return {
    type: imageConstants.GET_IMAGE_FOR_TOOL,
    payload
  }
}
export const cleanData = () => {
  return {
    type: imageConstants.CLEAN_DATA,
  }
}
// export const getImageForTool = (params = {}) => {
//   return {
//     type: imageConstants.GET_IMAGE_FOR_TOOL,
//     payload: {
//       params,
//     }
//   }
// }