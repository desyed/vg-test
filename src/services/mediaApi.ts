import { omit, pick } from 'lodash';

import { rootApi } from './rootApi';
const awsApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    createMedia: builder.mutation({
      query: ({ organizationId, ...payload }) => ({
        url: `/organization/${organizationId}/media/create`,
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

    createBatchMedia: builder.mutation({
      invalidatesTags: ['Media', 'SelectedMedia'],
      query: ({ videoGiftId, participantId, medias, organizationId }) => ({
        url: `/organization/${organizationId}/media/batch`,
        method: 'POST',
        body: {
          // previewImageUrl: payload.previewImageUrl,
          // originalKey: payload.originalKey,
          // videoType: payload.videoType,
          // type: payload.type,
          videoGiftId,
          participantId,
          medias
        }
      })
    }),

    patchMedia: builder.mutation({
      query: (payload) => ({
        url: `/media/${payload.mediaId}`,
        method: 'PUT',
        body: {
          ...omit(payload, ['mediaId'])
        }
      })
    }),

    getSelectedMedia: builder.query({
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'SelectedMedia', id })),
              'SelectedMedia'
            ]
          : ['SelectedMedia'],
      query: ({ organizationId, videoGiftId }) => ({
        url: `/organization/${organizationId}/media/selected`,
        method: 'GET',
        params: {
          videoGiftId
        }
      })
    }),
    getMediaById: builder.query({
      query: (payload) => ({
        url: `/organization/${payload?.organizationId}/media/${payload.mediaId}`,
        method: 'GET'
      })
    }),
    getSelectedMediaById: builder.query({
      query: (payload) => ({
        url: `/organization/${payload?.organizationId}/selectedMedia`,
        method: 'GET',
        params: {
          selectedMediaId: payload.selectedMediaId
        }
      })
    }),
    moveSelectedMediaOrder: builder.mutation({
      invalidatesTags: (result, error, arg) => [
        { type: 'SelectedMedia', id: arg.selectedMediaId },
        'SelectedMedia'
      ],
      query: ({ videoGiftId, selectedMedia, organizationId }) => ({
        url: `/organization/${organizationId}/media/selected`,
        method: 'PATCH',
        body: {
          videoGiftId,
          selectedMedia
        }
      })
    }),
    patchSelectedMedia: builder.mutation({
      query: (payload) => ({
        url: `/organization/${payload?.organizationId}/selectedMedia`,
        method: 'PATCH',
        body: {
          ...pick(payload, ['title', 'subTitle', 'selectedMediaId'])
        }
      })
    }),
    selectMedia: builder.mutation({
      query: (payload) => ({
        url: `/organization/${payload?.organizationId}/media/selected`,
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

export const {
  useCreateMediaMutation,
  useCreateBatchMediaMutation,
  useSelectMediaMutation,
  useGetSelectedMediaQuery,
  useGetMediaByIdQuery,
  useGetSelectedMediaByIdQuery,
  usePatchSelectedMediaMutation,
  useMoveSelectedMediaOrderMutation,
  usePatchMediaMutation
} = awsApi;
