import { rootApi } from './rootApi';

const api = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: (params) => ({
        url: '/user/me',
        method: 'GET',
        params
      })
    })
  }),
  overrideExisting: false
});

export const { useGetMeQuery } = api;
