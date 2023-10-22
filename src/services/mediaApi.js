import { rootApi } from './rootApi';

const awsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createMedia: builder.mutation({
      query: (payload) => ({
        url: '/media/create',
        method: 'POST',
        body: {
          previewImageUrl: payload.previewImageUrl,
          originalKey: payload.originalKey,
          videoGiftId: payload.videoGiftId,
          type: payload.type,
          participantId: payload.participantId
        }
      })
    }),
    selectMedia: builder.mutation({
      query: (payload) => ({
        url: '/media/selected',
        method: 'POST',
        body: {
          order: payload.order || 'NEXT',
          mediaId: payload.mediaId,
          videoGiftId: payload.videoGiftId
        }
      })
    })
  }),
  overrideExisting: false
});

export const { useCreateMediaMutation, useSelectMediaMutation } = awsApi;
