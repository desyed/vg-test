import { rootApi } from './rootApi';

const videoGiftApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getVideoGiftById: builder.query({
      query: ({ organizationId, videoGiftId }) => ({
        url: `/organization/${organizationId}/videogift/${videoGiftId}`,
        method: 'GET'
      }),
      providesTags: ['VideoGifts']
    }),
    patchVideoGift: builder.mutation({
      invalidatesTags: ['VideoGifts'],
      query: ({ id, organizationId, ...body }) => ({
        url: `/organization/${organizationId}/videogift/${id}`,
        method: 'PATCH',
        body
      })
    }),
    generatePreview: builder.mutation({
      query: (payload) => ({
        url: `/organization/${payload?.organizationId}/videogift/output`,
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
