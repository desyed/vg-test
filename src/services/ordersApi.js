import { rootApi } from './rootApi';

const ordersApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (params) => ({
        url: '/orders',
        method: 'GET',
        params
      })
    }),
    createVideoGiftOrder: builder.mutation({
      query: (payload) => ({
        url: `/videogift/${payload.parentVideoGiftId}/order`,
        method: 'POST',
        body: payload
      })
      // invalidatesTags: ['Orders']
    })
  }),
  overrideExisting: false
});

export const { useGetOrdersQuery, useCreateVideoGiftOrderMutation } = ordersApi;
