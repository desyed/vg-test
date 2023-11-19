import { rootApi } from './rootApi';

const videoGiftApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoGiftById: builder.query({
      query: (videoGiftId) => ({
        url: `/videogift/${videoGiftId}`,
        method: 'GET'
      }),
      providesTags: ['VideoGifts']
    }),
    patchVideoGift: builder.mutation({
      invalidatesTags: ['VideoGifts'],
      query: ({ id, ...body }) => ({
        url: `videogift/${id}`,
        method: 'PATCH',
        body
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
  useGeneratePreviewMutation,
  useGetVideoGiftByIdQuery,
  useLazyGetVideoGiftByIdQuery,
  usePatchVideoGiftMutation
} = videoGiftApi;
