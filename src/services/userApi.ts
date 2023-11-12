import { rootApi } from './rootApi';

const api = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: (params) => ({
        url: '/user/me',
        method: 'GET',
        params
      })
    }),
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: '/use/me',
        method: 'PATCH',
        body: credentials
      })
    })
  }),
  overrideExisting: false
});

export const { useGetMeQuery } = api;
