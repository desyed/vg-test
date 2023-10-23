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
    getVideoGiftById: builder.query({
      query: ({ videoGiftId }) => ({
        url: `/videogift/${videoGiftId}`,
        method: 'GET'
      })
    }),
    getAllVideoGiftParents: builder.query({
      query: (credentials) => ({
        url: '/videogift',
        method: 'GET',
        body: credentials
      })
    }),
    generatePreview: builder.mutation({
      query: (payload) => ({
        url: '/videogift/output',
        method: 'POST',
        body: { videoGiftId: payload.videoGiftId }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetVideoGiftQuery,
  useGeneratePreviewMutation,
  useGetVideoGiftByIdQuery
} = videoGiftApi;
