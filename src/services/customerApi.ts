import { rootApi } from './rootApi';

const customerApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ organizationId, ...payload }) => ({
        url: `/organization/${organizationId}/customers`,
        method: 'GET',
        body: payload
      }),
      providesTags: ['Customers']
    })
  }),
  overrideExisting: false
});

export const { useGetCustomersQuery } = customerApi;
