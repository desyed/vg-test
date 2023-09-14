import { rootApi } from './rootApi';

const videoGiftApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoGift: builder.query({
      query: (credentials) => ({
        url: '/videogift',
        method: 'GET',
        body: credentials
      })
    }),
    createVideoGiftOrder: builder.mutation({
      query: (payload) => ({
        url: `/videogift/${payload.id}/order`,
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['Customers']
    })
  }),
  overrideExisting: false
});

export const { useGetVideoGiftQuery, useCreateVideoGiftOrderMutation } =
  videoGiftApi;
