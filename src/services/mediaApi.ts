import { omit, pick } from 'lodash';

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
      query: (payload) => ({
        url: '/media/selected',
        method: 'GET',
        params: {
          videoGiftId: payload.videoGiftId
        }
      })
    }),
    getMediaById: builder.query({
      query: (payload) => ({
        url: `/media/${payload.mediaId}`,
        method: 'GET'
      })
    }),
    getSelectedMediaById: builder.query({
      query: (payload) => ({
        url: `/selectedMedia`,
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
      query: ({ videoGiftId, selectedMedia }) => ({
        url: '/media/selected',
        method: 'PATCH',
        body: {
          videoGiftId,
          selectedMedia
        }
      })
    }),
    patchSelectedMedia: builder.mutation({
      query: (payload) => ({
        url: `/selectedMedia`,
        method: 'PATCH',

        body: {
          ...pick(payload, ['title', 'subTitle', 'selectedMediaId'])
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

export const {
  useCreateMediaMutation,
  useSelectMediaMutation,
  useGetSelectedMediaQuery,
  useGetMediaByIdQuery,
  useGetSelectedMediaByIdQuery,
  usePatchSelectedMediaMutation,
  useMoveSelectedMediaOrderMutation,
  usePatchMediaMutation
} = awsApi;
