import { rootApi } from './rootApi';
import { store } from "../store";

const awsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getSignedPutUrl: builder.mutation({
      query: (payload) => ({
        url: '/signedUrl/create',
        method: 'POST',
        body: payload
      })
    })
  }),
  overrideExisting: false
});



export const sendFile = (signedUrl, file, onSuccess, onFail, onProgress, options = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl);
    // listen for load event
    xhr.onload = () => {
      if (onSuccess) onSuccess();
      resolve();
    };

    // listen for error event
    xhr.onerror = (e) => {
      if (onFail) onFail(e);
      reject(e);
    };

    // listen for abort event
    xhr.onabort = () => {
      reject();
    };

    // listen for progress event
    xhr.onprogress = (e) => {
      if (onProgress) onProgress(e);
      // event.loaded returns how many bytes are downloaded
      // event.total returns the total number of bytes
      // event.total is only available if server sends Content-Length header
    };
    xhr.upload.onprogress = (e) => {
      if (onProgress) onProgress(e);
      // event.loaded returns how many bytes are downloaded
      // event.total returns the total number of bytes
      // event.total is only available if server sends Content-Length header
      // console.log(Upload Downloaded ${e.loaded} of ${e.total} bytes);
    };

    // open and send request

    xhr.setRequestHeader('Content-Type', file.type);
    // xhr.setRequestHeader('x-amz-acl', 'public-read');

    // xhr.setRequestHeader('X-Amz-ACL', 'public-read');
    // xhr.setRequestHeader('Access-Control-Allow-Headers', '*');
    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

    xhr.send(file);
  });
};

export function callGetSignecdUrlDirectly(payload: any) {
  return new Promise((resolve, reject) => {
    store.dispatch(rootApi.endpoints?.getSignedPutUrl.initiate(payload))
      .then(response => {
        if (response.data) {
          // Handle successful response
          resolve(response)
        }
      })
      .catch(error => {
        // Handle error
        reject(error)
      });
  })

}

export const { useGetSignedPutUrlMutation } = awsApi;
