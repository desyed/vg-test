import { rootApi } from './rootApi';

const customerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (payload) => ({
        url: '/customers',
        method: 'GET',
        body: payload
      }),
      providesTags: ['Customers']
    })
  }),
  overrideExisting: false
});

export const { useGetCustomersQuery } = customerApi;
