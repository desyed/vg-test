import { rootApi } from './rootApi';

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

export const { useGetSignedPutUrlMutation } = awsApi;
