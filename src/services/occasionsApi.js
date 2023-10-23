import { rootApi } from './rootApi';

const api = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getOccasions: builder.query({
      query: (credentials) => ({
        url: '/occasions',
        method: 'GET'
      })
    })
  }),
  overrideExisting: false
});

export const { useGetOccasionsQuery } = api;
