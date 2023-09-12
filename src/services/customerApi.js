import { rootApi } from './rootApi';

const customerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (payload) => ({
        url: '/customers',
        method: 'GET',
        body: payload
      })
    })
  }),
  overrideExisting: false
});

export const { useGetCustomersQuery } = customerApi;
