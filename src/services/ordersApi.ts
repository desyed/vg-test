import { rootApi } from './rootApi';

const ordersApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      providesTags: ['Orders'],
      query: ({ organizationId, ...params }) => ({
        url: `/organization/${organizationId}/orders`,
        method: 'GET',
        params
      })
    }),
    createVideoGiftOrder: builder.mutation({
      invalidatesTags: ['Orders'],
      query: (payload) => ({
        url: `/organization/${payload?.organizationId}/videogift/${payload.parentVideoGiftId}/order`,
        method: 'POST',
        body: payload
      })
      // invalidatesTags: ['Orders']
    })
  }),
  overrideExisting: false
});

export const { useGetOrdersQuery, useCreateVideoGiftOrderMutation } = ordersApi;
